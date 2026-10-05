import type { ExchangeSelect } from "@arbitrator/lister/types";
import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia } from "elysia";
import z from "zod";

import { BaseLayout } from "../helpers/BaseLayout";
import { PageHeading } from "../views/components/PageHeading";
import {
  SignalBoardPush,
  type SignalQuery,
  SignalPage,
  type SignalsData,
} from "../views/pages/SignalPage";

/**
 * `hide` arrives as a repeated query param (`hide=a&hide=b`), a single value,
 * or nothing. Normalise all three to a string array.
 */
const hideSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((value) =>
    value === undefined ? [] : Array.isArray(value) ? value : [value],
  );

const signalQuerySchema = z.object({
  view: z.enum(["card", "table"]).default("card"),
  orderBy: z
    .enum(["profitPercentage", "profitVolume"])
    .default("profitPercentage"),
  order: z.enum(["asc", "desc"]).default("desc"),
  hide: hideSchema,
});

const DEFAULT_QUERY: SignalQuery = {
  view: "card",
  orderBy: "profitPercentage",
  order: "desc",
  hide: [],
};

function parseSignalQuery(input: unknown): SignalQuery {
  const parsed = signalQuerySchema.safeParse(input);
  return parsed.success ? parsed.data : DEFAULT_QUERY;
}

/** Profitable signals, minus any leg touching a hidden exchange. */
async function loadSignals(query: SignalQuery): Promise<SignalsData> {
  const [error, data] = await listerClient.opportunity.list({
    orderBy: query.orderBy,
    order: query.order,
  });

  if (error || !data) {
    return { ok: false, message: error?.message ?? "Unable to load signals." };
  }

  const hidden = new Set(query.hide);
  return {
    ok: true,
    signals: data.filter(
      (signal) =>
        !hidden.has(signal.buyExchange.slug) &&
        !hidden.has(signal.sellExchange.slug),
    ),
  };
}

async function loadExchanges(): Promise<ExchangeSelect[]> {
  const [error, data] = await listerClient.exchange.list({ limit: -1 });
  if (error || !data) return [];
  return data.data;
}

type ConnectionState = {
  query: SignalQuery;
  busy: boolean;
};

/** One state + interval per connected board; cleared when the socket closes. */
const connections = new Map<
  string,
  { state: ConnectionState; timer: ReturnType<typeof setInterval> }
>();

type Sendable = {
  readyState: number;
  send(data: unknown): unknown;
};

/** Push the current board; skips while a previous push is still in flight. */
async function pushBoard(ws: Sendable, state: ConnectionState) {
  if (state.busy || ws.readyState !== 1) return;
  state.busy = true;
  try {
    const data = await loadSignals(state.query);
    if (ws.readyState !== 1) return;
    ws.send(<SignalBoardPush query={state.query} data={data} />);
  } finally {
    state.busy = false;
  }
}

export const SignalController = new Elysia()
  .use(htmx())

  .get(
    "/signals",
    async ({ query, hx }) => {
      const [data, exchanges] = await Promise.all([
        loadSignals(query),
        loadExchanges(),
      ]);

      if (!hx.isHTMX) {
        return (
          <BaseLayout title="arbitmage - Signals" heading="Signals">
            <SignalPage query={query} data={data} exchanges={exchanges} />
          </BaseLayout>
        );
      }
      return (
        <>
          <PageHeading heading="Signals" oob />
          <title>Signals</title>
          <SignalPage query={query} data={data} exchanges={exchanges} />
        </>
      );
    },
    { query: signalQuerySchema },
  )

  /**
   * The only WebSocket in the UI. It pushes the board immediately and then
   * every second; the filter form sends its values back over the same socket
   * (`hx-ws:send`), which updates the per-connection query and re-pushes.
   */
  .ws("/signals/ws", {
    query: signalQuerySchema,
    open(ws) {
      const state: ConnectionState = {
        query: parseSignalQuery(ws.data.query),
        busy: false,
      };

      const timer = setInterval(() => void pushBoard(ws, state), 1000);
      connections.set(ws.id, { state, timer });
      void pushBoard(ws, state);
    },
    message(ws, raw) {
      const entry = connections.get(ws.id);
      if (!entry) return;

      let values: unknown;
      try {
        values = typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        return;
      }

      entry.state.query = parseSignalQuery(values);
      void pushBoard(ws, entry.state);
    },
    close(ws) {
      const entry = connections.get(ws.id);
      if (entry) clearInterval(entry.timer);
      connections.delete(ws.id);
    },
  });
