import { XIcon } from "./icons";

/** A stable, protected-focus shell for the picker and its confirmation step. */
export const AssignmentDialog = ({
    id,
    contentId,
    title,
    context,
}: {
    id: string;
    contentId: string;
    title: string;
    context: string;
}) => (
    <dialog
        id={id}
        class="modal modal-middle bg-neutral/70 p-3 sm:p-6"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-context`}
    >
        <div class="modal-box flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden p-0 shadow-2xl">
            <header class="flex shrink-0 items-center justify-between gap-3 border-b border-base-300 bg-base-200 px-4 py-3 sm:px-6 sm:py-4">
                <div class="min-w-0">
                    <h2 id={`${id}-title`} class="text-lg font-semibold">
                        {title}
                    </h2>
                    <p
                        id={`${id}-context`}
                        class="break-words text-sm text-base-content/80"
                    >
                        {context}
                    </p>
                </div>
                <div class="flex shrink-0 items-center gap-2">
                    <span
                        id={`${contentId}-indicator`}
                        class="htmx-indicator loading loading-spinner loading-sm"
                        aria-hidden="true"
                    ></span>
                    <button
                        type="button"
                        class="btn btn-square btn-ghost min-h-11"
                        aria-label={`Close ${title.toLowerCase()}`}
                        onclick="this.closest('dialog').close()"
                    >
                        <XIcon />
                    </button>
                </div>
            </header>
            <div
                id={contentId}
                class="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6"
                data-dialog-content
            ></div>
            <template data-dialog-loading>
                <p
                    class="flex min-h-32 items-center justify-center gap-3 text-sm"
                    role="status"
                >
                    <span class="loading loading-spinner loading-sm"></span>
                    <span data-load-message>Loading available choices…</span>
                </p>
            </template>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button aria-label={`Cancel ${title.toLowerCase()}`}>close</button>
        </form>
    </dialog>
);
