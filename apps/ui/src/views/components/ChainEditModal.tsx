export const ChainEditModal = () => {
  return (
    <dialog
      id="chain_edit_modal"
      class="modal sm:modal-middle"
      aria-labelledby="edit-chain-title"
    >
      <div id="chain_edit_modal_content" class="modal-box"></div>
      <form method="dialog" class="modal-backdrop">
        <button aria-label="Close">close</button>
      </form>
    </dialog>
  );
};
