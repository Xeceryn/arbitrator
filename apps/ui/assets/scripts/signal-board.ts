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
 * The same state is mirrored into the URL (`orderBy`, `hide`, `route`) with
 * `replaceState`, so a filtered board can be reloaded, bookmarked or shared.
 * Defaults are omitted to keep the canonical view at a bare `/signals`.
 *
 * Once the state is on the DOM it emits `BOARD_APPLIED_EVENT` with the now
 * first card, which is what `signal-audio.ts` plays an alarm for. Only the
 * swap path emits: a fresh page, or a local sort/hide change, is not an
 * incoming board update and must not sound the alarm.
 */

import { BOARD_APPLIED_EVENT, type BoardAppliedDetail } from "./board-state";

type OrderBy = "profitPercentage" | "profitVolume";

const DEFAULT_ORDER_BY: OrderBy = "profitPercentage";

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

type BoardState = ReturnType<typeof readState>;

/**
 * Mirror the filter state into the query string. Replacement (not push) keeps
 * the browser history clean: the board changes every 500ms, and the user did
 * not navigate. Only the params this board owns are touched, and nothing is
 * written when the URL already matches, so a steady board costs no work.
 */
function syncUrl(state: BoardState) {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    if (state.orderBy === DEFAULT_ORDER_BY) params.delete("orderBy");
    else params.set("orderBy", state.orderBy);

    params.delete("hide");
    for (const slug of [...state.hide].sort()) params.append("hide", slug);

    params.delete("route");
    const routeFilterActive =
        state.routes.size > 0 && state.routes.size < state.routeCount;
    if (routeFilterActive) {
        for (const route of [...state.routes].sort()) {
            params.append("route", route);
        }
    }

    const query = params.toString();
    const next = `${url.pathname}${query ? `?${query}` : ""}`;
    const current = `${window.location.pathname}${window.location.search}`;
    if (next === current) return;

    window.history.replaceState(window.history.state, "", next);
}

function applyState(emit = false) {
    if (!document.querySelector("#signal-controls")) return;

    const state = readState();
    syncUrl(state);
    const { orderBy, hide, routes, routeCount } = state;

    const list = document.querySelector<HTMLElement>("[data-signal-list]");
    if (!list) return;

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
