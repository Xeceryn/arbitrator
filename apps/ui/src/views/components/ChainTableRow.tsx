import type { ChainSelect } from "@arbitrator/lister/types";

import { timeAgo } from "../../utils";
import { PencilIcon } from "./icons";
import { DeleteRowAction, RowActions } from "./RowActions";

export const ChainTableRow = (props: ChainSelect) => {
    return (
        <tr id={`chain-table-row-${props.id}`}>
            <td class="max-w-0 font-medium sm:max-w-none">
                <div class="truncate" safe>
                    {props.name}
                </div>
                <div
                    class="truncate text-xs font-normal uppercase text-base-content/70 sm:hidden"
                    safe
                >
                    {props.code}
                </div>
            </td>
            <td class="hidden sm:table-cell">
                <span class="badge badge-outline font-mono uppercase" safe>
                    {props.code}
                </span>
            </td>
            <td class="hidden whitespace-nowrap opacity-70 md:table-cell" safe>
                {timeAgo(props.createdAt)}
            </td>
            <td class="hidden whitespace-nowrap opacity-70 md:table-cell" safe>
                {timeAgo(props.updatedAt)}
            </td>
            <td>
                <div class="flex justify-end gap-1">
                    <button
                        type="button"
                        class="btn btn-ghost btn-sm min-h-9"
                        aria-label={`Edit ${props.name}`}
                        title={`Edit ${props.name}`}
                        data-open-dialog="chain_edit_modal"
                        hx-get={`/chain/${props.id}/edit-modal`}
                        hx-target="#chain_edit_modal_content"
                        hx-swap="innerHTML"
                    >
                        <PencilIcon />
                        Edit
                    </button>
                    <RowActions
                        id={`chain-actions-${props.id}`}
                        name={props.name}
                    >
                        <DeleteRowAction
                            entity="chain"
                            name={props.name}
                            url={`/chain/${props.id}`}
                            target={`#chain-table-row-${props.id}`}
                            impact={`This deletes ${props.name} and removes its assignments from every exchange. Coins and exchanges are kept.`}
                        />
                    </RowActions>
                </div>
            </td>
        </tr>
    );
};
