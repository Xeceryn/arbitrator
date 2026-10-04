import type { CryptocurrencySelect } from "@arbitrator/lister/types";

import { timeAgo } from "../../utils";
import { LinkIcon, PencilIcon, RouteIcon, TrashIcon } from "./icons";

export const CoinTableRow = (props: CryptocurrencySelect) => {
  // const logoUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${props.cmcId}.png`;
  return (
    <tr id={`coin-table-row-${props.id}`}>
      <td>
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="avatar">
            <div class="mask mask-circle size-8 sm:size-10">
              {/* decorative: the coin name sits next to it */}
              <img src={props.logo} alt="" loading="lazy" />
            </div>
          </div>
          <div class="min-w-0">
            <div class="truncate font-medium" safe>
              {props.name}
            </div>
            <div class="truncate text-sm text-base-content/60" safe>
              {props.slug}
            </div>
          </div>
        </div>
      </td>
      <td class="font-medium" safe>
        {props.symbol.toUpperCase()}
      </td>
      <td class="hidden tabular-nums sm:table-cell">{props.cmcId}</td>
      <td
        class="hidden whitespace-nowrap text-base-content/70 lg:table-cell"
        safe
      >
        {timeAgo(props.createdAt)}
      </td>
      <td
        class="hidden whitespace-nowrap text-base-content/70 lg:table-cell"
        safe
      >
        {timeAgo(props.updatedAt)}
      </td>
      <td>
        <div class="flex justify-end gap-1">
          <button
            type="button"
            class="btn btn-square btn-outline btn-xs sm:btn-sm"
            aria-label={`Edit ${props.name}`}
            title={`Edit ${props.name}`}
            onclick="cryptocurrency_edit_modal.showModal()"
            hx-get={`/coins/${props.id}/edit-modal`}
            hx-target="#cryptocurrency_edit_modal_content"
            hx-swap="innerHTML"
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            class="btn btn-square btn-outline btn-xs sm:btn-sm"
            aria-label={`Manage assignments for ${props.name}`}
            title={`Manage assignments for ${props.name}`}
            hx-get={`/coins/${props.id}/assignment`}
            hx-target="#coin_assignment_panel"
            hx-swap="innerHTML"
            hx-indicator="#coin-assignment-indicator"
            onclick="coin_assignment_dialog.showModal()"
          >
            <LinkIcon />
          </button>
          <button
            type="button"
            class="btn btn-square btn-outline btn-xs sm:btn-sm"
            aria-label={`View transfer routes for ${props.name}`}
            title={`View transfer routes for ${props.name}`}
            hx-get={`/coins/${props.id}/routes`}
            hx-target="#coin-route-modal-content"
            hx-swap="innerHTML"
            hx-indicator="#coin-route-indicator"
            onclick="coin_route_modal.showModal()"
          >
            <RouteIcon />
          </button>
          <button
            type="button"
            class="btn btn-square btn-outline btn-xs sm:btn-sm btn-error"
            aria-label={`Delete ${props.name}`}
            _="on click alert('ngawor sampean mas')"
            title={`Delete ${props.name}`}
            /* TODO: wire the delete request and add a confirmation step. */
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
};
