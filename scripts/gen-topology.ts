/**
 * Generates the RabbitMQ topology diagrams from the code, not from memory.
 *
 *   bun run scripts/gen-topology.ts
 *
 * Source of truth: `packages/contracts/src/messaging.ts` (names, exchange type)
 * plus the `publish` / `subscribe` / `sendToQueueNow` call sites in `apps/`.
 *
 * Outputs (both committed, both regenerated):
 *   docs/architecture/topology.d2   — render with `d2 docs/architecture/topology.d2`
 *   docs/architecture/topology.md   — renders on GitHub with no tooling
 *
 * The point of generating this is the one thing hand-drawn broker diagrams
 * always get wrong: the orderbook path does *not* go through the exchange. The
 * sender workers `sendToQueue` directly into a per-exchange queue, so there is
 * no binding from the topic exchange to `arbitrator.orderbook.<exchange>`.
 */

import * as fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const CONTRACTS = `${ROOT}/packages/contracts/src/messaging.ts`;

const CONTROL_COLOR = "#6366f1";
const DATA_COLOR = "#14b8a6";

type Entry = { name: string; value: string; parameter?: string };

type Usage = {
    app: string;
    file: string;
    /** RoutingKeys members this file publishes. */
    publishes: string[];
    /** Queues members this file consumes. */
    consumes: string[];
    /** RoutingKeys members bound to the consumed queue. */
    patterns: string[];
    /** Queues members this file sends to directly (default exchange). */
    sends: string[];
};

const APP_LABELS: Record<string, string> = {
    ui: "UI",
    lister: "Lister",
    sender: "Sender",
    receiver: "Receiver",
    "cmc-collector": "CMC collector",
    "chain-metadata-collector": "Chain metadata collector",
};

/** Files that are intentionally not part of the live topology. */
const IGNORED = new Set(["concurrent.ts", "main-concurrent.ts"]);

function extractObject(source: string, exportName: string): string {
    const marker = `export const ${exportName} = {`;
    const start = source.indexOf(marker);
    if (start === -1) throw new Error(`gen-topology: missing ${exportName}`);

    const open = source.indexOf("{", start);
    let depth = 0;
    for (let index = open; index < source.length; index += 1) {
        const char = source[index];
        if (char === "{") depth += 1;
        else if (char === "}") {
            depth -= 1;
            if (depth === 0) return source.slice(open + 1, index);
        }
    }

    throw new Error(`gen-topology: unterminated ${exportName}`);
}

const STATIC_ENTRY = /^\s*([A-Za-z_$][\w$]*):\s*"([^"]*)",?\s*$/;
const DYNAMIC_ENTRY =
    /^\s*([A-Za-z_$][\w$]*):\s*\(([^)]*)\)\s*=>\s*`([^`]*)`,?\s*$/;

function parseEntries(block: string): Entry[] {
    const entries: Entry[] = [];

    for (const line of block.split("\n")) {
        const trimmed = line.trim();
        if (
            trimmed === "" ||
            trimmed.startsWith("//") ||
            trimmed.startsWith("/*") ||
            trimmed.startsWith("*")
        ) {
            continue;
        }

        const dynamic = DYNAMIC_ENTRY.exec(line);
        if (dynamic) {
            entries.push({
                name: dynamic[1]!,
                value: dynamic[3]!,
                parameter: dynamic[2]!.split(":")[0]!.trim(),
            });
            continue;
        }

        const literal = STATIC_ENTRY.exec(line);
        if (literal) entries.push({ name: literal[1]!, value: literal[2]! });
    }

    return entries;
}

async function walk(directory: string): Promise<string[]> {
    const output: string[] = [];

    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
        const path = `${directory}/${entry.name}`;
        if (entry.isDirectory()) {
            output.push(...(await walk(path)));
        } else if (entry.name.endsWith(".ts")) {
            if (entry.name.endsWith(".test.ts") || IGNORED.has(entry.name)) {
                continue;
            }
            output.push(path);
        }
    }

    return output;
}

function collect(source: string, pattern: RegExp): string[] {
    const found = new Set<string>();
    for (const match of source.matchAll(pattern)) {
        const name = match[1];
        if (name) found.add(name);
    }
    return [...found];
}

/** `arbitrator.orderbook.<exchange>` in prose instead of the template literal. */
function humanize(entry: Entry): string {
    if (!entry.parameter) return entry.value;
    return entry.value.replace(
        `\${${entry.parameter}}`,
        `<${entry.parameter}>`,
    );
}

function id(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "_")
        .replace(/^([0-9])/, "_$1");
}

async function scanUsages(queueNames: Set<string>): Promise<Usage[]> {
    const usages: Usage[] = [];

    for (const file of (await walk(`${ROOT}/apps`)).sort()) {
        const relative = file.slice(ROOT.length);
        const slug = /^\/apps\/([^/]+)\//.exec(relative)?.[1];
        if (!slug) continue;

        const source = await Bun.file(file).text();

        const publishes = collect(
            source,
            /(?<![\w.])publish(?:Now)?\(\s*RoutingKeys\.(\w+)/g,
        );
        const directConsumes = collect(source, /queue:\s*Queues\.(\w+)/g);
        const patterns = collect(
            source,
            /patterns:\s*\[\s*RoutingKeys\.(\w+)/g,
        );
        // Dynamic queues are built into a local (`const queue = Queues.x(...)`)
        // and then either consumed or sent to, so the call sites decide. The
        // receiver declares `orderbookFor`; the sender worker protocol sends
        // to it. Same builder, opposite direction.
        const builtQueues = collect(source, /Queues\.(\w+)\(/g).filter((name) =>
            queueNames.has(name),
        );
        const consumes = /(?<![\w.])subscribe\(/.test(source)
            ? [...new Set([...directConsumes, ...builtQueues])]
            : directConsumes;
        const sends = /sendToQueueNow\(/.test(source) ? builtQueues : [];

        if (
            publishes.length === 0 &&
            consumes.length === 0 &&
            patterns.length === 0 &&
            sends.length === 0
        ) {
            continue;
        }

        usages.push({
            app: APP_LABELS[slug] ?? slug,
            file: relative.slice(1),
            publishes,
            consumes,
            patterns,
            sends,
        });
    }

    return usages;
}

async function main(): Promise<void> {
    const contracts = await Bun.file(CONTRACTS).text();

    const exchangeType =
        /export const ExchangeType = "([^"]+)"/.exec(contracts)?.[1] ?? "topic";
    const routingKeys = parseEntries(extractObject(contracts, "RoutingKeys"));
    const queues = parseEntries(extractObject(contracts, "Queues"));

    const usages = await scanUsages(new Set(queues.map((entry) => entry.name)));

    const key = (name: string) =>
        routingKeys.find((entry) => entry.name === name);
    const queue = (name: string) => queues.find((entry) => entry.name === name);

    const producers = new Map<string, string[]>();
    const consumers = new Map<string, string[]>();
    const bindings = new Map<string, string[]>();
    const appNodes = new Set<string>();

    const remember = (
        index: Map<string, string[]>,
        name: string,
        app: string,
    ) => {
        index.set(name, [...(index.get(name) ?? []), app]);
    };

    for (const usage of usages) {
        appNodes.add(usage.app);
        for (const name of usage.publishes) {
            remember(producers, name, usage.app);
        }
        for (const name of usage.consumes) {
            remember(consumers, name, usage.app);
        }
        for (const name of usage.patterns) {
            remember(bindings, name, usage.app);
        }
    }

    // Legacy entrypoints still declare the shared queue; keep it out of the
    // diagram because nothing in the live path touches it.
    const liveQueues = queues.filter(
        (entry) => entry.name !== "orderbook" || consumers.has(entry.name),
    );
    const dynamicQueues = liveQueues.filter((entry) => entry.parameter);
    const staticQueues = liveQueues.filter((entry) => !entry.parameter);

    // ---- d2 ---------------------------------------------------------------
    const d2: string[] = [
        "# GENERATED by scripts/gen-topology.ts — do not edit by hand.",
        "# Sources: packages/contracts/src/messaging.ts + publish/subscribe call sites.",
        "",
        "direction: right",
        "",
        "title: |md",
        "  **RabbitMQ topology**",
        "",
        "  Indigo = control plane. Teal = orderbook data plane.",
        "|",
        "",
        "classes: {",
        "  app: {",
        "    shape: rectangle",
        "  }",
        "  queue: {",
        "    shape: queue",
        '    style.fill: "#fffbeb"',
        "  }",
        "  exchange: {",
        "    shape: hexagon",
        '    style.fill: "#eef2ff"',
        "  }",
        "}",
        "",
    ];

    for (const app of [...appNodes].sort()) {
        d2.push(`${id(app)}: "${app}" { class: app }`);
    }

    d2.push("", 'amqp: "RabbitMQ" {');
    d2.push("  exchange: {");
    d2.push("    class: exchange");
    d2.push(`    label: "${exchangeType} exchange\\n$AMQP_EXCHANGE"`);
    d2.push("  }");

    for (const entry of staticQueues) {
        d2.push(`  ${id(entry.name)}: "${entry.value}" { class: queue }`);
    }
    for (const entry of dynamicQueues) {
        d2.push(`  ${id(entry.name)}: {`);
        d2.push("    class: queue");
        d2.push(`    label: "${humanize(entry)}"`);
        d2.push("  }");
    }
    d2.push("}", "");

    for (const usage of usages) {
        const prefix = usage.publishes.length ? "publish" : "publish";
        for (const name of usage.publishes) {
            const routing = key(name);
            if (!routing) continue;
            d2.push(
                `${id(usage.app)} -> amqp.exchange: "${prefix} ${routing.value}" {`,
            );
            d2.push(`  style.stroke: "${CONTROL_COLOR}"`);
            d2.push("}");
        }

        for (const pattern of usage.patterns) {
            const routing = key(pattern);
            if (!routing) continue;
            for (const name of usage.consumes) {
                const target = queue(name);
                if (!target || target.parameter) continue;
                d2.push(
                    `amqp.exchange -> amqp.${id(name)}: "bind ${routing.value}" {`,
                );
                d2.push(`  style.stroke: "${CONTROL_COLOR}"`);
                d2.push("}");
            }
        }

        for (const name of usage.sends) {
            const target = queue(name);
            if (!target) continue;
            d2.push(
                `${id(usage.app)} -> amqp.${id(name)}: "sendToQueue (direct)" {`,
            );
            d2.push(`  style.stroke: "${DATA_COLOR}"`);
            d2.push("}");
        }
    }

    for (const [name, apps] of consumers) {
        const target = queue(name);
        if (!target) continue;
        for (const app of apps) {
            d2.push(`amqp.${id(name)} -> ${id(app)}: "delivers" {`);
            d2.push(
                `  style.stroke: "${target.parameter ? DATA_COLOR : CONTROL_COLOR}"`,
            );
            d2.push("}");
        }
    }

    await fs.writeFile(
        `${ROOT}/docs/architecture/topology.d2`,
        `${d2.join("\n")}\n`,
    );

    // ---- mermaid + tables -------------------------------------------------
    const mermaid: string[] = [
        "# RabbitMQ topology",
        "",
        "<!-- GENERATED by scripts/gen-topology.ts — do not edit by hand. -->",
        "",
        `Exchange type \`${exchangeType}\`; exchange name comes from \`AMQP_EXCHANGE\`.`,
        "",
        "```mermaid",
        "flowchart LR",
        '  subgraph apps["Services"]',
    ];

    for (const app of [...appNodes].sort()) {
        mermaid.push(`    ${id(app)}["${app}"]`);
    }

    mermaid.push("  end", "", '  subgraph broker["RabbitMQ"]');
    mermaid.push(
        `    exchange{{"${exchangeType} exchange<br/>AMQP_EXCHANGE"}}`,
    );

    for (const entry of staticQueues) {
        mermaid.push(`    ${id(entry.name)}[["${entry.value}"]]`);
    }
    for (const entry of dynamicQueues) {
        const label = humanize(entry).replace("<", "&lt;").replace(">", "&gt;");
        mermaid.push(`    ${id(entry.name)}[["${label}"]]`);
    }
    mermaid.push("  end", "");

    const edges = new Map<
        string,
        { from: string; to: string; label: string }
    >();
    const addEdge = (from: string, to: string, label: string) => {
        edges.set(`${from}\u0000${to}\u0000${label}`, { from, to, label });
    };

    for (const usage of usages) {
        for (const name of usage.publishes) {
            const routing = key(name);
            if (!routing) continue;
            addEdge(id(usage.app), "exchange", `publish ${routing.value}`);
        }
        for (const pattern of usage.patterns) {
            const routing = key(pattern);
            if (!routing) continue;
            for (const name of usage.consumes) {
                const target = queue(name);
                if (!target || target.parameter) continue;
                addEdge("exchange", id(name), `bind ${routing.value}`);
            }
        }
        for (const name of usage.sends) {
            const target = queue(name);
            if (!target) continue;
            addEdge(id(usage.app), id(name), "sendToQueue (direct)");
        }
    }
    for (const [name, apps] of consumers) {
        const target = queue(name);
        if (!target) continue;
        for (const app of apps) addEdge(id(name), id(app), "delivers");
    }

    for (const { from, to, label } of edges.values()) {
        mermaid.push(`  ${from} -->|"${label}"| ${to}`);
    }

    mermaid.push("```", "");

    mermaid.push("## Routing keys", "");
    mermaid.push("| Member | Key | Published by | Bound to |");
    mermaid.push("| --- | --- | --- | --- |");
    for (const entry of routingKeys) {
        mermaid.push(
            `| \`${entry.name}\` | \`${entry.value}\` | ${
                (producers.get(entry.name) ?? []).join(", ") || "—"
            } | ${(bindings.get(entry.name) ?? []).join(", ") || "—"} |`,
        );
    }

    mermaid.push("", "## Queues", "");
    mermaid.push("| Member | Name | Fed by | Consumed by |");
    mermaid.push("| --- | --- | --- | --- |");
    for (const entry of liveQueues) {
        const fed = entry.parameter
            ? "sender worker threads, `sendToQueue` over the default exchange"
            : (producers.get(entry.name) ?? []).join(", ") || "—";
        mermaid.push(
            `| \`${entry.name}\` | \`${humanize(entry)}\` | ${fed} | ${
                (consumers.get(entry.name) ?? []).join(", ") || "—"
            } |`,
        );
    }

    mermaid.push(
        "",
        "## Notes",
        "",
        "- The orderbook path is **not** bound to the topic exchange. Workers call",
        "  `sendToQueue` over the default exchange, straight into",
        "  `arbitrator.orderbook.<exchange>`, which the receiver declares at boot.",
        "- `Queues.orderbook` and `RoutingKeys.orderbookNormalizedAll` belong to the",
        "  legacy `concurrent.ts` entrypoint and are excluded from the diagram.",
        "- Consumer attribution is heuristic: it reads `queue:` / `patterns:` from",
        "  each file. Keep those call shapes stable, or update this script.",
        "",
    );

    await fs.writeFile(
        `${ROOT}/docs/architecture/topology.md`,
        `${mermaid.join("\n")}\n`,
    );

    console.log(
        `gen-topology: ${routingKeys.length} routing keys, ${liveQueues.length} queues, ${usages.length} call sites`,
    );
}

await main();
