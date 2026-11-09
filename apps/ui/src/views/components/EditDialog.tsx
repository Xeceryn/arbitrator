import { XIcon } from "./icons";

export const EditDialog = ({
    id,
    contentId,
    entity,
}: {
    id: string;
    contentId: string;
    entity: string;
}) => (
    <dialog
        id={id}
        class="modal modal-bottom sm:modal-middle"
        aria-labelledby={`edit-${entity}-title`}
    >
        <div class="modal-box w-full max-w-xl p-5 sm:p-6">
            <div id={contentId} data-dialog-content></div>
            <template data-dialog-loading>
                <div class="flex items-center justify-between gap-3">
                    <h2
                        id={`edit-${entity}-title`}
                        class="text-lg font-semibold"
                    >
                        Edit {entity}
                    </h2>
                    <button
                        type="button"
                        class="btn btn-square btn-ghost btn-sm"
                        aria-label={`Close ${entity} editor`}
                        onclick={`document.getElementById('${id}').close()`}
                    >
                        <XIcon />
                    </button>
                </div>
                <p class="flex items-center gap-2 py-8 text-sm" role="status">
                    <span class="loading loading-spinner loading-sm"></span>
                    <span data-load-message>Loading {entity}…</span>
                </p>
            </template>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button aria-label="Close">close</button>
        </form>
    </dialog>
);
