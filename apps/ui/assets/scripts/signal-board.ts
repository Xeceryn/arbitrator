/**
 * Client-side hide/sort for the live signal board.
 *
 * The WebSocket only ever swaps the cards that changed (see the signal
 * controller), so this script never replaces the list. It reads the controls
 * and applies two things after every push:
 *
 * - `hide`: which cards match a hidden exchange, via `style.display`.
 * - `route`: which of the four buy→sell base-currency routes to show. All four
 *   checked (or none, for a stale form) means no route filtering.
 * - rank: descending by the active metric, via the CSS `order` property on the
 *   grid items.
 *
 * Using `order` instead of moving nodes matters: re-appending a card between
 * the mousedown and mouseup of a copy click makes the browser retarget the
 * click, so `clipboard.js` never sees it and the page can jump. With `order`,
 * the nodes stay put and only their paint order changes.
 *
 * Once the state is on the DOM it emits `BOARD_APPLIED_EVENT` with the now
 * first card, which is what `signal-audio.ts` plays an alarm for. Only the
 * swap path emits: a fresh page, or a local sort/hide change, is not an
 * incoming board update and must not sound the alarm.
 */

import { BOARD_APPLIED_EVENT, type BoardAppliedDetail } from "./board-state";

type OrderBy = "profitPercentage" | "profitVolume";

const ORDER_ATTRS: Record<OrderBy, string> = {
    profitPercentage: "data-profit-percentage",
    profitVolume: "data-profit-volume",
};

function readState(): {
    orderBy: OrderBy;
    hide: Set<string>;
    routes: Set<string>;
    routeCount: number;
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

    const routeInputs = Array.from(
        form?.querySelectorAll<HTMLInputElement>('input[name="route"]') ?? [],
    );
    const routes = new Set(
        routeInputs
            .filter((input) => input.checked)
            .map((input) => input.value),
    );

    return { orderBy, hide, routes, routeCount: routeInputs.length };
}

function applyState(emit = false) {
    const list = document.querySelector<HTMLElement>("[data-signal-list]");
    if (!list) return;

    const { orderBy, hide, routes, routeCount } = readState();
    const attr = ORDER_ATTRS[orderBy];
    const filterByRoute = routes.size > 0 && routes.size < routeCount;

    const nodes = Array.from(
        list.querySelectorAll<HTMLElement>("[data-signal-node]"),
    );

    let visible = 0;
    for (const node of nodes) {
        const hidden =
            hide.has(node.dataset.buySlug ?? "") ||
            hide.has(node.dataset.sellSlug ?? "") ||
            (filterByRoute && !routes.has(node.dataset.route ?? ""));
        node.style.display = hidden ? "none" : "";
        if (!hidden) visible += 1;
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

    const routeLabel = document.querySelector("#signal-route-count");
    if (routeLabel) {
        routeLabel.textContent = filterByRoute
            ? ` (${routes.size}/${routeCount})`
            : "";
    }

    // The server only renders the empty state when there are no signals at
    // all; local filters hiding every card needs its own message.
    const filterEmpty = document.querySelector("#signal-filter-empty");
    if (filterEmpty) {
        filterEmpty.classList.toggle("hidden", visible > 0);
    }

    if (!emit) return;

    // `nodes` is already sorted, so the first one still displayed on the board
    // is the card the user sees first. Hidden exchanges must not win the rank.
    const top = nodes.find((node) => node.style.display !== "none");
    document.dispatchEvent(
        new CustomEvent<BoardAppliedDetail>(BOARD_APPLIED_EVENT, {
            detail: {
                top: top
                    ? {
                          id: top.id,
                          profitPercentage: Number(
                              top.dataset.profitPercentage ?? 0,
                          ),
                      }
                    : null,
            },
        }),
    );
}

function init() {
    const form = document.querySelector("#signal-controls");
    if (!form) return;

    form.addEventListener("change", () => applyState());
    applyState();
}

// A swap is either an incoming board push or an htmx page render; only the
// former should sound the alarm, and only a push carries new percentages.
document.addEventListener("htmx:after:swap", () => applyState(true));

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
