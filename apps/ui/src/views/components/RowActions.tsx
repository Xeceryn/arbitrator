import type { PropsWithChildren } from "@kitajs/html";

import { MoreIcon, TrashIcon } from "./icons";

/** A top-layer popover cannot be clipped by a table's scroll container. */
export const RowActions = ({
    id,
    name,
    children,
}: PropsWithChildren<{ id: string; name: string }>) => (
    <>
        <button
            type="button"
            class="btn btn-square btn-ghost btn-sm min-h-9 min-w-9"
            popovertarget={id}
            style={`anchor-name:--${id}`}
            aria-label={`More actions for ${name}`}
            title={`More actions for ${name}`}
        >
            <MoreIcon />
        </button>
        <ul
            id={id}
            popover="auto"
            style={`position-anchor:--${id}`}
            class="dropdown menu row-actions w-52 rounded-box bg-base-100 p-2 shadow-lg"
            aria-label={`Actions for ${name}`}
        >
            {children}
        </ul>
    </>
);

export const DeleteRowAction = ({
    entity,
    name,
    url,
    target,
    impact,
}: {
    entity: string;
    name: string;
    url: string;
    target: string;
    impact: string;
}) => (
    <li class="mt-1 border-t border-base-300 pt-1">
        <button
            type="button"
            class="min-h-10"
            aria-label={`Delete ${name}`}
            hx-delete={url}
            hx-target={target}
            hx-swap="delete"
            hx-confirm={`${impact} This cannot be undone.`}
            data-confirm-title={`Delete ${name}?`}
            data-confirm-label={`Delete ${entity}`}
            data-hx-disable="this"
            {...{ "hx-status:5xx": "swap:none" }}
        >
            <TrashIcon /> Delete {entity}
        </button>
    </li>
);
