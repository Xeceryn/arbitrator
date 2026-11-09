import type { ExchangeSelect } from "@arbitrator/lister/types";

import { timeAgo } from "../../utils";
import { PencilIcon } from "./icons";
import { DeleteRowAction, RowActions } from "./RowActions";

export const MarketTableRow = (props: ExchangeSelect) => {
    return (
        <tr id={`market-table-row-${props.id}`}>
            <td class="max-w-0 sm:max-w-none">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="avatar shrink-0">
                        <div class="mask mask-circle size-8 sm:size-10">
                            {/* decorative: the exchange name sits next to it */}
                            <img src={props.logo} alt="" loading="lazy" />
                        </div>
                    </div>
                    <div class="min-w-0">
                        <div class="truncate font-medium" safe>
                            {props.name}
                        </div>
                        <div class="truncate text-sm text-base-content/70" safe>
                            {props.slug}
                        </div>
                    </div>
                </div>
            </td>
            <td class="hidden tabular-nums sm:table-cell">{props.cmcId}</td>
            <td class="hidden md:table-cell">
                <span class="badge badge-outline font-mono uppercase" safe>
                    {props.baseCurrency}
                </span>
            </td>
            <td class="hidden md:table-cell">
                {props.registeredOnCmc ? (
                    <span class="badge badge-success badge-sm whitespace-nowrap">
                        Registered
                    </span>
                ) : (
                    <span class="badge badge-ghost badge-sm whitespace-nowrap">
                        Not registered
                    </span>
                )}
            </td>
            <td class="hidden whitespace-nowrap opacity-70 lg:table-cell" safe>
                {timeAgo(props.createdAt)}
            </td>
            <td class="hidden whitespace-nowrap opacity-70 lg:table-cell" safe>
                {timeAgo(props.updatedAt)}
            </td>
            <td>
                <div class="flex justify-end gap-1">
                    <button
                        type="button"
                        class="btn btn-ghost btn-sm min-h-9"
                        aria-label={`Edit ${props.name}`}
                        title={`Edit ${props.name}`}
                        data-open-dialog="exchange_edit_modal"
                        hx-get={`/markets/${props.id}/edit-modal`}
                        hx-target="#exchange_edit_modal_content"
                        hx-swap="innerHTML"
                    >
                        <PencilIcon />
                        Edit
                    </button>
                    <RowActions
                        id={`exchange-actions-${props.id}`}
                        name={props.name}
                    >
                        <DeleteRowAction
                            entity="exchange"
                            name={props.name}
                            url={`/markets/${props.id}`}
                            target={`#market-table-row-${props.id}`}
                            impact={`This deletes ${props.name} and all coin and chain assignments on this exchange. Coins and chains are kept.`}
                        />
                    </RowActions>
                </div>
            </td>
        </tr>
    );
};
