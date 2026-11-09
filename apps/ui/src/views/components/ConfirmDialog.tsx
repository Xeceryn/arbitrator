/** htmx's native confirmation remains the fallback if browser scripts fail. */
export const ConfirmDialog = () => (
    <dialog
        id="confirm-removal"
        class="modal modal-bottom sm:modal-middle"
        aria-labelledby="confirm-removal-title"
        aria-describedby="confirm-removal-description"
    >
        <div class="modal-box max-w-md p-5 sm:p-6">
            <h2
                id="confirm-removal-title"
                class="break-words text-lg font-semibold"
            >
                Remove item?
            </h2>
            <p
                id="confirm-removal-description"
                class="mt-3 text-sm text-base-content/80"
            ></p>
            <form method="dialog" class="modal-action">
                <button
                    type="submit"
                    value="cancel"
                    class="btn btn-ghost"
                    autofocus
                >
                    Cancel
                </button>
                <button type="submit" value="confirm" class="btn btn-error">
                    Remove
                </button>
            </form>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button value="cancel" aria-label="Cancel removal">
                close
            </button>
        </form>
    </dialog>
);
