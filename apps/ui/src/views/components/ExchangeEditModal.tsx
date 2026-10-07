export const ExchangeEditModal = () => {
    return (
        <dialog
            id="exchange_edit_modal"
            class="modal sm:modal-middle"
            aria-labelledby="edit-exchange-title"
        >
            <div id="exchange_edit_modal_content" class="modal-box"></div>
            <form method="dialog" class="modal-backdrop">
                <button aria-label="Close">close</button>
            </form>
        </dialog>
    );
};
