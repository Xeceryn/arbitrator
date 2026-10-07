import { createLogger } from "@arbitrator/logger";
import { connect } from "amqplib";
import type { Channel, ConsumeMessage, RecoveringChannelModel } from "amqplib";

const logger = createLogger("arbitrator/messaging");

/** Topic exchange every service publishes to. */
export const AMQP_EXCHANGE = Bun.env.AMQP_EXCHANGE ?? "arbitrator";

function amqpUrl(): string {
    return (
        Bun.env.AMQP_URL ??
        Bun.env.RABBITMQ_URL ??
        "amqp://arbitrator:arbitrator@localhost:5672"
    );
}

// ---------------------------------------------------------------- connection
let model: RecoveringChannelModel | undefined;
let connecting: Promise<RecoveringChannelModel> | undefined;

/**
 * Lazily connect to RabbitMQ. The connection recovers on its own; channels are
 * recreated by their owners because amqplib recovery does not resurrect them.
 * A failed initial connect rejects so callers can fall back to "messaging
 * disabled" instead of hanging forever.
 */
async function ensureModel(): Promise<RecoveringChannelModel> {
    if (model) return model;
    if (!connecting) {
        const url = amqpUrl();
        connecting = connect(url, {
            recovery: {
                waitForConnect: false,
                initialDelay: 200,
                maxDelay: 5_000,
                factor: 2,
                jitter: 0.2,
                maxRetries: Infinity,
                // Fail fast at boot; never give up once we have been connected.
                initialMaxRetries: 5,
            },
        })
            .then(async (m) => {
                m.on("connect", () =>
                    logger.info(`connected to rabbitmq at ${url}`),
                );
                m.on("disconnect", (error: Error) =>
                    logger.warn(`rabbitmq disconnected: ${error.message}`),
                );
                m.on("reconnect-scheduled", ({ attempt, delay }) =>
                    logger.warn(
                        `rabbitmq reconnect attempt ${attempt} in ${delay}ms`,
                    ),
                );
                m.on("reconnect-failed", (error: Error) =>
                    logger.error(`rabbitmq reconnect failed: ${error.message}`),
                );
                m.on("error", (error: Error) =>
                    logger.warn(`rabbitmq connection error: ${error.message}`),
                );
                await m.waitForConnect();
                model = m;
                return m;
            })
            .catch((error: unknown) => {
                connecting = undefined;
                throw error;
            });
    }
    return connecting;
}

// ---------------------------------------------------------------- publish
let publishChannel: Channel | undefined;
let ensuringPublisher: Promise<Channel> | undefined;

/** Ensure the shared publisher channel and exchange exist. */
export function ensurePublisher(): Promise<Channel> {
    if (publishChannel) return Promise.resolve(publishChannel);
    if (ensuringPublisher) return ensuringPublisher;

    const pending = ensureModel().then(async (m) => {
        const channel = await m.createChannel();
        channel.on("error", (error: Error) =>
            logger.warn(`rabbitmq publisher channel error: ${error.message}`),
        );
        channel.on("close", () => {
            if (publishChannel === channel) publishChannel = undefined;
        });
        await channel.assertExchange(AMQP_EXCHANGE, "topic", { durable: true });
        publishChannel = channel;
        return channel;
    });

    ensuringPublisher = pending.finally(() => {
        ensuringPublisher = undefined;
    });
    return ensuringPublisher;
}

function publishOn(
    channel: Channel,
    routingKey: string,
    payload: unknown,
    persistent: boolean,
): boolean {
    return channel.publish(
        AMQP_EXCHANGE,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
        {
            contentType: "application/json",
            persistent,
            timestamp: Date.now(),
        },
    );
}

/**
 * Best-effort publish. Never throws; returns whether the message was handed to
 * the channel. Used by the lister, where a lost event only delays convergence.
 */
export async function publish(
    routingKey: string,
    payload: unknown,
    options: { persistent?: boolean } = {},
): Promise<boolean> {
    try {
        const channel = await ensurePublisher();
        return publishOn(
            channel,
            routingKey,
            payload,
            options.persistent ?? false,
        );
    } catch (error: unknown) {
        logger.warn(
            `rabbitmq publish to ${routingKey} failed: ${String(error)}`,
        );
        return false;
    }
}

/**
 * Synchronous publish for hot paths (orderbook workers). Returns false when the
 * channel is not ready yet and kicks off (re)connection so later calls succeed.
 * Dropping an orderbook snapshot is fine: the next one supersedes it.
 */
export function publishNow(
    routingKey: string,
    payload: unknown,
    persistent = false,
): boolean {
    const channel = publishChannel;
    if (!channel) {
        void ensurePublisher().catch(() => {});
        return false;
    }
    return publishOn(channel, routingKey, payload, persistent);
}

/**
 * Synchronous send straight to a named queue over the default exchange. Used by
 * the orderbook workers, where each exchange owns its own queue. Returns false
 * when the channel is not ready yet (and kicks off reconnect).
 *
 * The queue must already exist: the receiver declares it on startup, and the
 * broker silently drops a send to a queue nobody has declared.
 */
export function sendToQueueNow(
    queue: string,
    payload: unknown,
    persistent = false,
): boolean {
    const channel = publishChannel;
    if (!channel) {
        void ensurePublisher().catch(() => {});
        return false;
    }
    return channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
        contentType: "application/json",
        persistent,
        timestamp: Date.now(),
    });
}

// ---------------------------------------------------------------- consume
export type Delivery = {
    readonly body: Buffer;
    readonly routingKey: string;
    readonly redelivered: boolean;
    json<T = unknown>(): T;
    ack(): void;
    nack(requeue?: boolean): void;
};

export type SubscribeOptions = {
    queue: string;
    /**
     * Topic patterns bound to the queue. Omit for a queue fed directly by name
     * (`sendToQueueNow`), such as the per-exchange orderbook queues.
     */
    patterns?: string[];
    prefetch?: number;
    durable?: boolean;
    /**
     * Delete the queue when the last consumer disconnects. Useful for a firehose
     * whose backlog is worthless once nobody is reading it.
     */
    autoDelete?: boolean;
    /** Max queued messages before the broker drops the oldest. */
    maxLength?: number;
};

export type Consumer = AsyncIterable<Delivery> & {
    close(): Promise<void>;
};

type Buffered = { channel: Channel; message: ConsumeMessage };

class ConsumerImpl implements Consumer {
    private readonly options: SubscribeOptions & {
        patterns: string[];
        prefetch: number;
        durable: boolean;
        autoDelete: boolean;
    };
    private channel: Channel | undefined;
    private consumerTag: string | undefined;
    private starting = false;
    private stopped = false;
    private retryTimer: ReturnType<typeof setTimeout> | undefined;
    private buffer: Buffered[] = [];
    private waiter: ((value: Delivery | undefined) => void) | undefined;

    constructor(options: SubscribeOptions) {
        this.options = {
            patterns: [],
            prefetch: 32,
            durable: false,
            autoDelete: false,
            ...options,
        };
        void this.start();
    }

    private async start(): Promise<void> {
        if (this.stopped || this.starting || this.channel) return;
        this.starting = true;
        try {
            const m = await ensureModel();
            if (this.stopped) return;

            const channel = await m.createChannel();
            if (this.stopped) {
                await channel.close().catch(() => {});
                return;
            }

            channel.on("error", (error: Error) =>
                logger.warn(
                    `rabbitmq consumer channel error on ${this.options.queue}: ${error.message}`,
                ),
            );
            channel.on("close", () => {
                if (this.channel !== channel) return;
                this.channel = undefined;
                this.consumerTag = undefined;
                this.scheduleRetry();
            });

            if (this.options.patterns.length > 0) {
                await channel.assertExchange(AMQP_EXCHANGE, "topic", {
                    durable: true,
                });
            }
            await channel.assertQueue(this.options.queue, {
                durable: this.options.durable,
                autoDelete: this.options.autoDelete,
                ...(this.options.maxLength !== undefined
                    ? { maxLength: this.options.maxLength }
                    : {}),
            });
            for (const pattern of this.options.patterns) {
                await channel.bindQueue(
                    this.options.queue,
                    AMQP_EXCHANGE,
                    pattern,
                );
            }
            await channel.prefetch(this.options.prefetch);
            const { consumerTag } = await channel.consume(
                this.options.queue,
                (message) => this.handleMessage(channel, message),
                { noAck: false },
            );

            this.channel = channel;
            this.consumerTag = consumerTag;
            const binding =
                this.options.patterns.length > 0
                    ? ` [${this.options.patterns.join(", ")}]`
                    : "";
            logger.info(`rabbitmq consuming ${this.options.queue}${binding}`);
        } catch (error: unknown) {
            logger.warn(
                `rabbitmq subscribe to ${this.options.queue} failed: ${String(error)}`,
            );
            this.scheduleRetry();
        } finally {
            this.starting = false;
        }
    }

    private scheduleRetry(): void {
        if (this.stopped || this.retryTimer) return;
        this.retryTimer = setTimeout(() => {
            this.retryTimer = undefined;
            void this.start();
        }, 2_000);
    }

    private handleMessage(
        channel: Channel,
        message: ConsumeMessage | null,
    ): void {
        // Broker-initiated cancel: channel close follows and restarts us.
        if (message === null) return;

        if (this.stopped) {
            this.safe(() => channel.nack(message, false, true));
            return;
        }

        const delivery = this.makeDelivery(channel, message);
        const waiter = this.waiter;
        if (waiter) {
            this.waiter = undefined;
            waiter(delivery);
            return;
        }
        this.buffer.push({ channel, message });
    }

    private makeDelivery(channel: Channel, message: ConsumeMessage): Delivery {
        return {
            body: message.content,
            routingKey: message.fields.routingKey,
            redelivered: message.fields.redelivered,
            json<T = unknown>(): T {
                return JSON.parse(message.content.toString("utf8")) as T;
            },
            ack: () => this.safe(() => channel.ack(message)),
            nack: (requeue = false) =>
                this.safe(() => channel.nack(message, false, requeue)),
        };
    }

    private safe(action: () => void): void {
        try {
            action();
        } catch {
            // The channel is gone; the broker will redeliver unacked messages.
        }
    }

    private next(): Promise<Delivery | undefined> {
        if (this.stopped) return Promise.resolve(undefined);
        const buffered = this.buffer.shift();
        if (buffered) {
            return Promise.resolve(
                this.makeDelivery(buffered.channel, buffered.message),
            );
        }
        return new Promise((resolve) => {
            this.waiter = resolve;
        });
    }

    async *[Symbol.asyncIterator](): AsyncIterator<Delivery> {
        while (!this.stopped) {
            const delivery = await this.next();
            if (delivery === undefined) return;
            yield delivery;
        }
    }

    async close(): Promise<void> {
        if (this.stopped) return;
        this.stopped = true;

        if (this.retryTimer) {
            clearTimeout(this.retryTimer);
            this.retryTimer = undefined;
        }
        this.waiter?.(undefined);
        this.waiter = undefined;

        // Requeue anything delivered by the broker but never pulled by the caller.
        for (const { channel, message } of this.buffer) {
            this.safe(() => channel.nack(message, false, true));
        }
        this.buffer = [];

        const channel = this.channel;
        const consumerTag = this.consumerTag;
        this.channel = undefined;
        this.consumerTag = undefined;
        if (channel) {
            if (consumerTag) {
                await channel.cancel(consumerTag).catch(() => {});
            }
            await channel.close().catch(() => {});
        }
    }
}

/** Subscribe to routing keys via a named queue. Manual ack, one ack per delivery. */
export function subscribe(options: SubscribeOptions): Consumer {
    return new ConsumerImpl(options);
}

/** Close the shared connection. Consumers should be closed first. */
export async function closeMessaging(): Promise<void> {
    if (publishChannel) {
        await publishChannel.close().catch(() => {});
        publishChannel = undefined;
    }
    if (model) {
        await model.close().catch(() => {});
        model = undefined;
    }
    connecting = undefined;
}
