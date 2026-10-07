export const CryptocurrencyEditModal = () => {
    return (
        <dialog
            id="cryptocurrency_edit_modal"
            class="modal sm:modal-middle"
            aria-labelledby="edit-coin-title"
        >
            <div id="cryptocurrency_edit_modal_content" class="modal-box"></div>
            <form method="dialog" class="modal-backdrop">
                <button aria-label="Close">close</button>
            </form>
        </dialog>
    );
};
