import { resolveChain } from "./chains";
import type { Snapshot } from "./types";

/**
 * Cross-exchange network equivalence.
 *
 * For every coin on every crawled venue we want to know which raw labels denote
 * the *same* blockchain network, so lister ends up with one chain per real
 * network instead of one per spelling. Labels are nodes; we union them with
 * three independent signals, strongest first:
 *
 * 1. **contract address** — for the same coin, two labels that report the same
 *    contract address are the same chain. This is data-derived, not a guess,
 *    and it is what lets us prove `ERC20` == `ETH` instead of inferring it.
 * 2. **canonical resolution** — the deterministic rules (`BEP20` -> `BSC`,
 *    `LINEAETH` -> `LINEA`, `SEGWITBTC` -> `BTC`).
 * 3. **name equality** — labels identical up to case/punctuation.
 *
 * The result is reported as components: each is a proposed lister chain, with
 * the evidence that justifies it. Components backed only by name similarity are
 * flagged for review.
 */

type Member = {
    key: string;
    exchangeSlug: string;
    label: string;
    hint?: string;
    contracts: Set<string>;
    coins: Set<string>;
    rows: number;
};

type EdgeType = "contract" | "canonical" | "name";

export type Component = {
    code: string;
    name: string;
    /** Every raw label in this component. */
    labels: string[];
    exchanges: string[];
    members: Array<
        Omit<Member, "contracts" | "coins"> & {
            contracts: string[];
            coins: string[];
        }
    >;
    evidence: { canonical: boolean; contract: boolean; name: boolean };
    /** Distinct canonical codes found among the members (>1 = conflict). */
    canonicalCodes: string[];
    /** >1 distinct label means this component merges spellings. */
    distinctLabels: number;
};

export type ProposedAlias = {
    label: string;
    hint?: string;
    code: string;
    name: string;
    evidence: { canonical: boolean; contract: boolean; name: boolean };
};

export type Analysis = {
    generatedAt: string;
    nodes: number;
    components: Component[];
    /**
     * Alias entries for labels that currently resolve to a different code than
     * their component, i.e. the merges worth adding to `CHAIN_ALIASES`.
     */
    proposedAliases: ProposedAlias[];
    /** Per-exchange coverage: coins seen, coins with at least one contract. */
    coverage: Array<{
        slug: string;
        coins: number;
        networks: number;
        withContract: number;
    }>;
};

const SEP = "\u0000";

function squash(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function memberKey(slug: string, label: string, hint?: string): string {
    return `${slug}${SEP}${label}${SEP}${hint ?? ""}`;
}

class DisjointSet {
    private readonly parent = new Map<string, string>();

    find(key: string): string {
        const parent = this.parent.get(key) ?? key;
        if (parent === key) return key;
        const root = this.find(parent);
        this.parent.set(key, root);
        return root;
    }

    union(a: string, b: string): void {
        const rootA = this.find(a);
        const rootB = this.find(b);
        if (rootA !== rootB) this.parent.set(rootA, rootB);
    }
}

function buildMembers(snapshot: Snapshot): Map<string, Member> {
    const members = new Map<string, Member>();

    for (const row of snapshot.networks) {
        const key = memberKey(row.exchangeSlug, row.network, row.networkHint);
        let member = members.get(key);
        if (!member) {
            member = {
                key,
                exchangeSlug: row.exchangeSlug,
                label: row.network,
                hint: row.networkHint,
                contracts: new Set(),
                coins: new Set(),
                rows: 0,
            };
            members.set(key, member);
        }

        member.rows += 1;
        if (row.exchangeSymbol) member.coins.add(row.exchangeSymbol);
        if (row.contractAddress) {
            member.contracts.add(row.contractAddress.toLowerCase());
        }
    }

    return members;
}

function collectCoverage(snapshot: Snapshot): Analysis["coverage"] {
    const perSlug = new Map<
        string,
        { coins: Set<string>; networks: number; withContract: number }
    >();

    for (const row of snapshot.networks) {
        let entry = perSlug.get(row.exchangeSlug);
        if (!entry) {
            entry = { coins: new Set(), networks: 0, withContract: 0 };
            perSlug.set(row.exchangeSlug, entry);
        }
        entry.coins.add(row.exchangeSymbol);
        entry.networks += 1;
        if (row.contractAddress) entry.withContract += 1;
    }

    return [...perSlug.entries()].map(([slug, entry]) => ({
        slug,
        coins: entry.coins.size,
        networks: entry.networks,
        withContract: entry.withContract,
    }));
}

/** Union every group of member keys and record the edge type used. */
function linkGroup(
    dsu: DisjointSet,
    edges: Array<{ type: EdgeType; a: string; b: string }>,
    type: EdgeType,
    keys: string[],
): void {
    if (keys.length < 2) return;
    const first = keys[0]!;
    for (let i = 1; i < keys.length; i += 1) {
        const other = keys[i]!;
        if (dsu.find(first) === dsu.find(other)) continue;
        dsu.union(first, other);
        edges.push({ type, a: first, b: other });
    }
}

export function analyzeNetworks(snapshot: Snapshot): Analysis {
    const members = buildMembers(snapshot);
    const dsu = new DisjointSet();
    const edges: Array<{ type: EdgeType; a: string; b: string }> = [];

    for (const key of members.keys()) dsu.find(key);

    // --- Signal 1: contract address + coin symbol (from rows) -----------------
    // Same coin + same address usually means the same chain, but omnichain
    // tokens (e.g. LayerZero's ZRO) reuse one address across chains. So a label
    // is anchored to a canonical code only when *every* address bucket it
    // appears in agrees on that one code. This attaches an unmapped label to a
    // known chain (ZKSERA -> ZKSYNC) without chaining labels together, which is
    // what previously let BSC and MONAD transitively merge.
    const byContract = new Map<string, string[]>();
    for (const row of snapshot.networks) {
        if (!row.contractAddress) continue;
        const key = memberKey(row.exchangeSlug, row.network, row.networkHint);
        const bucketKey = `${squash(row.exchangeSymbol)}${SEP}${row.contractAddress.toLowerCase()}`;
        const bucket = byContract.get(bucketKey);
        if (bucket) bucket.push(key);
        else byContract.set(bucketKey, [key]);
    }

    const anchorCodes = new Map<string, Set<string>>();
    for (const keys of byContract.values()) {
        const unique = [...new Set(keys)];
        if (unique.length < 2) continue;

        const known = new Set<string>();
        for (const key of unique) {
            const member = members.get(key);
            if (!member) continue;
            const resolved = resolveChain(member.label, member.hint);
            if (resolved.canonical) known.add(resolved.code);
        }
        // Omnichain deployment (ETH vs BSC) or no known chain: cannot anchor.
        if (known.size !== 1) continue;

        const code = [...known][0]!;
        for (const key of unique) {
            const member = members.get(key);
            if (!member) continue;
            const resolved = resolveChain(member.label, member.hint);
            if (resolved.canonical && resolved.code === code) continue;
            const set = anchorCodes.get(key) ?? new Set<string>();
            set.add(code);
            anchorCodes.set(key, set);
        }
    }

    const representative = new Map<string, string>();
    for (const member of members.values()) {
        const resolved = resolveChain(member.label, member.hint);
        if (resolved.canonical && !representative.has(resolved.code)) {
            representative.set(resolved.code, member.key);
        }
    }
    for (const [key, codes] of anchorCodes) {
        if (codes.size !== 1) continue;
        const rep = representative.get([...codes][0]!);
        if (rep && rep !== key) linkGroup(dsu, edges, "contract", [key, rep]);
    }

    // --- Signal 2: deterministic canonical code -------------------------------
    const byCanonicalCode = new Map<string, string[]>();
    for (const member of members.values()) {
        const resolved = resolveChain(member.label, member.hint);
        const bucket = byCanonicalCode.get(resolved.code);
        if (bucket) bucket.push(member.key);
        else byCanonicalCode.set(resolved.code, [member.key]);
    }
    for (const keys of byCanonicalCode.values()) {
        linkGroup(dsu, edges, "canonical", keys);
    }

    // --- Signal 3: name equality (case/punctuation-insensitive) ---------------
    const byName = new Map<string, string[]>();
    for (const member of members.values()) {
        const name = squash(member.label);
        const bucket = byName.get(name);
        if (bucket) bucket.push(member.key);
        else byName.set(name, [member.key]);
    }
    for (const keys of byName.values()) {
        linkGroup(dsu, edges, "name", keys);
    }

    // --- Group into components ------------------------------------------------
    const byRoot = new Map<string, Member[]>();
    for (const member of members.values()) {
        const root = dsu.find(member.key);
        const bucket = byRoot.get(root);
        if (bucket) bucket.push(member);
        else byRoot.set(root, [member]);
    }

    const components: Component[] = [];
    for (const group of byRoot.values()) {
        const set = new Set(group.map((member) => member.key));
        const evidence = {
            contract: edges.some(
                (e) => e.type === "contract" && set.has(e.a) && set.has(e.b),
            ),
            canonical: edges.some(
                (e) => e.type === "canonical" && set.has(e.a) && set.has(e.b),
            ),
            name: edges.some(
                (e) => e.type === "name" && set.has(e.a) && set.has(e.b),
            ),
        };

        const resolved = group.map((member) =>
            resolveChain(member.label, member.hint),
        );
        const canonical = resolved.filter((item) => item.canonical);

        let code: string;
        let name: string;
        if (canonical.length > 0) {
            const counts = new Map<string, { count: number; name: string }>();
            for (const item of canonical) {
                const entry = counts.get(item.code);
                if (entry) entry.count += 1;
                else counts.set(item.code, { count: 1, name: item.name });
            }
            const best = [...counts.entries()].sort(
                (a, b) =>
                    b[1].count - a[1].count ||
                    a[0].length - b[0].length ||
                    a[0].localeCompare(b[0]),
            )[0]!;
            code = best[0];
            name = best[1].name;
        } else {
            const best = [...group].sort((a, b) => b.rows - a.rows)[0]!;
            code = resolveChain(best.label, best.hint).code;
            name = best.label;
        }

        const labels = [...new Set(group.map((member) => member.label))];
        const exchanges = [...new Set(group.map((m) => m.exchangeSlug))].sort();
        const canonicalCodes = [
            ...new Set(canonical.map((item) => item.code)),
        ].sort();

        components.push({
            code,
            name,
            labels,
            exchanges,
            evidence,
            canonicalCodes,
            distinctLabels: labels.length,
            members: group.map((member) => ({
                key: member.key,
                exchangeSlug: member.exchangeSlug,
                label: member.label,
                hint: member.hint,
                rows: member.rows,
                contracts: [...member.contracts],
                coins: [...member.coins],
            })),
        });
    }

    components.sort(
        (a, b) =>
            b.distinctLabels - a.distinctLabels ||
            b.exchanges.length - a.exchanges.length ||
            a.code.localeCompare(b.code),
    );

    // Alias entries for labels that currently resolve elsewhere: the merges the
    // operator can fold into `CHAIN_ALIASES`.
    const proposedAliases: ProposedAlias[] = [];
    for (const component of components) {
        for (const member of component.members) {
            const resolved = resolveChain(member.label, member.hint);
            if (resolved.canonical && resolved.code === component.code)
                continue;
            if (resolved.code === component.code) continue;
            proposedAliases.push({
                label: member.label,
                ...(member.hint ? { hint: member.hint } : {}),
                code: component.code,
                name: component.name,
                evidence: component.evidence,
            });
        }
    }

    return {
        generatedAt: new Date().toISOString(),
        nodes: members.size,
        components,
        proposedAliases,
        coverage: collectCoverage(snapshot),
    };
}

export function analyzeSummary(analysis: Analysis): {
    merges: Component[];
    namingOnly: Component[];
    singletons: number;
} {
    const merges = analysis.components.filter((c) => c.distinctLabels > 1);
    const namingOnly = merges.filter(
        (c) => !c.evidence.contract && !c.evidence.canonical,
    );
    const singletons = analysis.components.filter(
        (c) => c.distinctLabels === 1,
    ).length;
    return { merges, namingOnly, singletons };
}

function evidenceTag(component: Component): string {
    const tags: string[] = [];
    if (component.evidence.contract) tags.push("contract");
    if (component.evidence.canonical) tags.push("canonical");
    if (component.evidence.name) tags.push("name");
    return tags.join("+") || "none";
}

export function printAnalysis(analysis: Analysis): void {
    const { merges, namingOnly, singletons } = analyzeSummary(analysis);

    console.log(
        `\nnetwork equivalence: ${analysis.nodes} labels -> ${analysis.components.length} chains`,
    );

    console.log("coverage:");
    for (const row of analysis.coverage) {
        console.log(
            `  ${row.slug.padEnd(9)} coins:${String(row.coins).padStart(5)} networks:${String(row.networks).padStart(5)} with-contract:${String(row.withContract).padStart(5)}`,
        );
    }

    console.log(
        `\nmerges: ${merges.length}  (naming-only, needs review: ${namingOnly.length})  singleton chains: ${singletons}`,
    );

    const conflicts = analysis.components.filter(
        (c) => c.canonicalCodes.length > 1,
    );
    if (conflicts.length > 0) {
        console.log(
            `\nCONFLICTS (a component mixes different canonical chains — investigate): ${conflicts.length}`,
        );
        for (const component of conflicts.slice(0, 20)) {
            console.log(
                `  ${component.code.padEnd(12)} ${component.canonicalCodes.join(" vs ")}  labels: ${component.labels.slice(0, 8).join(", ")}`,
            );
        }
    }

    console.log(`\nproposed aliases: ${analysis.proposedAliases.length}`);

    const top = merges.slice(0, 30);
    if (top.length > 0) {
        console.log("\ntop merges (proposed chain <- labels):");
        for (const component of top) {
            const labels = component.labels
                .slice(0, 8)
                .map((label) => label.trim() || "<empty>")
                .join(", ");
            const more =
                component.labels.length > 8
                    ? ` …+${component.labels.length - 8}`
                    : "";
            console.log(
                `  ${component.code.padEnd(12)} [${evidenceTag(component)}] {${component.exchanges.join(",")}}  ${labels}${more}`,
            );
        }
    }

    if (namingOnly.length > 0) {
        console.log("\nnaming-only merges (no contract/canonical proof):");
        for (const component of namingOnly.slice(0, 30)) {
            console.log(
                `  ${component.code.padEnd(12)} {${component.exchanges.join(",")}}  ${component.labels.slice(0, 8).join(", ")}`,
            );
        }
    }
}

export async function writeAnalysis(
    dataDir: string,
    analysis: Analysis,
): Promise<void> {
    await Bun.write(
        `${dataDir}/network-equivalence.json`,
        `${JSON.stringify(analysis, null, 2)}\n`,
    );
}
