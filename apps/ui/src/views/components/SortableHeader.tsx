import type { PropsWithChildren } from "@kitajs/html";

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "./icons";

export type SortDirection = "asc" | "desc";

type Props = PropsWithChildren<{
  /** id of the filter form holding the current query, re-submitted on sort. */
  form: string;
  /** List endpoint that renders the swap unit, e.g. `/coins/list`. */
  url: string;
  /** Swap-unit selector, e.g. `#coin-list-results`. */
  target: string;
  /** Loading indicator selector, e.g. `#coin-list-indicator`. */
  indicator: string;
  /** Column key sent as `orderBy`. */
  field: string;
  /** Active `orderBy` from the query. */
  orderBy: string;
  /** Active `order` from the query. */
  order: SortDirection;
  /** Accessible column name, e.g. `CMC ID`. */
  name: string;
  /** Extra classes for the `<th>`: width and responsive visibility. */
  class?: string;
}>;

/**
 * A clickable table header cell. `aria-sort` on the `<th>` announces the
 * current direction; the button toggles it by re-requesting the list with
 * `orderBy`/`order` merged over the filter form's values.
 *
 * The button lives outside the filter form, so it uses `hx-include` to pick
 * the current search/limit, and `hx-vals` to override the sort. `hx-vals`
 * wins over included values, and `page` is not part of the form, so sorting
 * always jumps back to page one.
 */
export const SortableHeader = ({
  form,
  url,
  target,
  indicator,
  field,
  orderBy,
  order,
  name,
  class: className,
  children,
}: Props) => {
  const isActive = orderBy === field;
  const nextOrder: SortDirection = isActive && order === "asc" ? "desc" : "asc";
  const ariaSort = isActive
    ? order === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th aria-sort={ariaSort} class={className}>
      <button
        type="button"
        class="group inline-flex items-center gap-1 rounded-box text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label={`Sort by ${name}, ${nextOrder === "asc" ? "ascending" : "descending"}`}
        hx-get={url}
        hx-target={target}
        hx-swap="outerMorph"
        hx-include={`#${form}`}
        hx-indicator={indicator}
        hx-sync="this:replace"
        hx-vals={JSON.stringify({ orderBy: field, order: nextOrder })}
      >
        <span>{children}</span>
        {isActive ? (
          order === "asc" ? (
            <ArrowUpIcon />
          ) : (
            <ArrowDownIcon />
          )
        ) : (
          <ChevronsUpDownIcon class="opacity-0 transition-opacity group-hover:opacity-60 group-focus-visible:opacity-60" />
        )}
      </button>
    </th>
  );
};
