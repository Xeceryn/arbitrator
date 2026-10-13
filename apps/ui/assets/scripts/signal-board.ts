/**
 * Client-side hide/sort for the live signal board.
 *
 * The WebSocket only ever swaps the cards that changed (see the signal
 * controller), so this script never replaces the list. It reads the controls
 * and applies two things after every push:
 *
 * - `hide`: which cards match a hidden exchange, via `style.display`.
 * - rank: descending by the active metric, via the CSS `order` property on the
 *   grid items.
 *
 * Using `order` instead of moving nodes matters: re-appending a card between
 * the mousedown and mouseup of a copy click makes the browser retarget the
 * click, so `clipboard.js` never sees it and the page can jump. With `order`,
 * the nodes stay put and only their paint order changes.
 */

type OrderBy = "profitPercentage" | "profitVolume";

const ORDER_ATTRS: Record<OrderBy, string> = {
    profitPercentage: "data-profit-percentage",
    profitVolume: "data-profit-volume",
};

function readState(): {
    orderBy: OrderBy;
    hide: Set<string>;
} {
    const form = document.querySelector<HTMLFormElement>("#signal-controls");
    const orderBy =
        (form?.querySelector<HTMLSelectElement>('select[name="orderBy"]')
            ?.value as OrderBy | undefined) ?? "profitPercentage";
    const hide = new Set(
        Array.from(
            form?.querySelectorAll<HTMLInputElement>(
                'input[name="hide"]:checked',
            ) ?? [],
        ).map((input) => input.value),
    );

    return { orderBy, hide };
}

function applyState() {
    const list = document.querySelector<HTMLElement>("[data-signal-list]");
    if (!list) return;

    const { orderBy, hide } = readState();
    const attr = ORDER_ATTRS[orderBy];

    const nodes = Array.from(
        list.querySelectorAll<HTMLElement>("[data-signal-node]"),
    );

    for (const node of nodes) {
        const hidden =
            hide.has(node.dataset.buySlug ?? "") ||
            hide.has(node.dataset.sellSlug ?? "");
        node.style.display = hidden ? "none" : "";
    }

    nodes.sort((a, b) => {
        const av = Number(a.getAttribute(attr) ?? 0);
        const bv = Number(b.getAttribute(attr) ?? 0);
        return bv - av;
    });

    for (const [index, node] of nodes.entries()) {
        node.style.order = String(index);
    }

    const count = document.querySelector("#signal-hide-count");
    if (count) count.textContent = hide.size > 0 ? ` (${hide.size})` : "";
}

function init() {
    const form = document.querySelector("#signal-controls");
    if (!form) return;

    form.addEventListener("change", applyState);
    applyState();
}

document.addEventListener("htmx:after:swap", () => applyState());

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
