import type { ChainSelect } from "@arbitrator/lister/types";

import { timeAgo } from "../../utils";
import { PencilIcon, TrashIcon } from "./icons";

export const ChainTableRow = (props: ChainSelect) => {
    return (
        <tr id={`chain-table-row-${props.id}`}>
            <td class="font-medium" safe>
                {props.name}
            </td>
            <td>
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
                        class="btn btn-square btn-outline btn-xs sm:btn-sm"
                        aria-label={`Edit ${props.name}`}
                        title={`Edit ${props.name}`}
                        onclick="chain_edit_modal.showModal()"
                        hx-get={`/chain/${props.id}/edit-modal`}
                        hx-target="#chain_edit_modal_content"
                        hx-swap="innerHTML"
                    >
                        <PencilIcon />
                    </button>
                    <button
                        type="button"
                        class="btn btn-square btn-outline btn-xs sm:btn-sm btn-error"
                        aria-label={`Delete ${props.name}`}
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
