/**
 * Client-side view / sort / hide for the live signal board.
 *
 * The WebSocket broadcasts one identical board to every connected client, so
 * ordering, exchange hiding and the card/table switch all happen here instead
 * of on the server. State is re-applied after every htmx morph, because each
 * push replaces the board with the neutral, unfiltered payload.
 */

type OrderBy = "profitPercentage" | "profitVolume";
type Order = "asc" | "desc";
type View = "card" | "table";

const ORDER_ATTRS: Record<OrderBy, string> = {
  profitPercentage: "data-profit-percentage",
  profitVolume: "data-profit-volume",
};

function readState(): {
  view: View;
  orderBy: OrderBy;
  order: Order;
  hide: Set<string>;
} {
  const form = document.querySelector<HTMLFormElement>("#signal-controls");
  const view =
    (form?.querySelector<HTMLInputElement>('input[name="view"]:checked')
      ?.value as View | undefined) ?? "card";
  const orderBy =
    (form?.querySelector<HTMLSelectElement>('select[name="orderBy"]')
      ?.value as OrderBy | undefined) ?? "profitPercentage";
  const order =
    (form?.querySelector<HTMLSelectElement>('select[name="order"]')
      ?.value as Order | undefined) ?? "desc";
  const hide = new Set(
    Array.from(
      form?.querySelectorAll<HTMLInputElement>('input[name="hide"]:checked') ??
        [],
    ).map((input) => input.value),
  );

  return { view, orderBy, order, hide };
}

function applyState() {
  const board = document.querySelector("#signal-board");
  if (!board) return;

  const { view, orderBy, order, hide } = readState();

  for (const panel of board.querySelectorAll<HTMLElement>(
    "[data-signal-panel]",
  )) {
    panel.style.display = panel.dataset.signalPanel === view ? "" : "none";
  }

  const attr = ORDER_ATTRS[orderBy];

  for (const list of board.querySelectorAll<HTMLElement>("[data-signal-list]")) {
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
      return order === "asc" ? av - bv : bv - av;
    });

    for (const node of nodes) list.appendChild(node);
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
