import type { CryptocurrencySelect } from "@arbitrator/lister/types";

import { timeAgo } from "../../utils";
import { PencilIcon, RouteIcon } from "./icons";
import { DeleteRowAction, RowActions } from "./RowActions";

export const CoinTableRow = (props: CryptocurrencySelect) => {
    return (
        <tr id={`coin-table-row-${props.id}`}>
            <td class="max-w-0 sm:max-w-none">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="avatar hidden shrink-0 min-[360px]:block">
                        <div class="mask mask-circle size-8 sm:size-10">
                            {/* decorative: the coin name sits next to it */}
                            <img src={props.logo} alt="" loading="lazy" />
                        </div>
                    </div>
                    <div class="min-w-0">
                        <div class="truncate font-medium" safe>
                            {props.name}
                        </div>
                        <div
                            class="hidden truncate text-sm text-base-content/70 sm:block"
                            safe
                        >
                            {props.slug}
                        </div>
                        <div class="truncate text-xs text-base-content/70 sm:hidden">
                            {props.symbol.toUpperCase()}
                        </div>
                    </div>
                </div>
            </td>
            <td class="hidden font-medium sm:table-cell" safe>
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
                        class="btn btn-ghost btn-sm hidden sm:inline-flex"
                        aria-label={`Edit ${props.name}`}
                        title={`Edit ${props.name}`}
                        data-open-dialog="cryptocurrency_edit_modal"
                        hx-get={`/coins/${props.id}/edit-modal`}
                        hx-target="#cryptocurrency_edit_modal_content"
                        hx-swap="innerHTML"
                    >
                        <PencilIcon />
                        Edit
                    </button>
                    <a
                        href={`/coins/${props.id}/assignment`}
                        class="btn btn-sm min-h-9"
                        aria-label={`Manage assignments for ${props.name}`}
                        title={`Manage assignments for ${props.name}`}
                    >
                        Assignments
                    </a>
                    <RowActions
                        id={`coin-actions-${props.id}`}
                        name={props.name}
                    >
                        <li class="sm:hidden">
                            <button
                                type="button"
                                class="min-h-10"
                                aria-label={`Edit ${props.name}`}
                                data-open-dialog="cryptocurrency_edit_modal"
                                hx-get={`/coins/${props.id}/edit-modal`}
                                hx-target="#cryptocurrency_edit_modal_content"
                                hx-swap="innerHTML"
                            >
                                <PencilIcon /> Edit coin
                            </button>
                        </li>
                        <li>
                            <a
                                href={`/coins/${props.id}/routes`}
                                class="min-h-10"
                                aria-label={`View transfer routes for ${props.name}`}
                                title={`View transfer routes for ${props.name}`}
                            >
                                <RouteIcon />
                                Transfer routes
                            </a>
                        </li>
                        <DeleteRowAction
                            entity="coin"
                            name={props.name}
                            url={`/coins/${props.id}`}
                            target={`#coin-table-row-${props.id}`}
                            impact={`This deletes ${props.name} and all of its exchange and chain assignments. Exchanges and chains are kept.`}
                        />
                    </RowActions>
                </div>
            </td>
        </tr>
    );
};
