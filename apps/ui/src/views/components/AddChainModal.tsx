export const AddChainModal = () => {
    return (
        <dialog
            id="add_chain_modal"
            class="modal modal-bottom sm:modal-middle"
            aria-labelledby="add-chain-title"
        >
            <div class="modal-box">
                <h2 id="add-chain-title" class="text-lg font-semibold">
                    Add a chain
                </h2>

                <form
                    id="add-chain-form"
                    hx-post="/chain"
                    hx-target="#chain-table-body"
                    hx-swap="afterbegin"
                    hx-on:add-chain-success="add_chain_modal.close()"
                    class="mt-4 flex flex-col gap-3"
                >
                    <label class="input input-bordered">
                        <span class="label">Name</span>
                        <input
                            name="name"
                            type="text"
                            placeholder="Ethereum"
                            autocomplete="off"
                            required
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">Code</span>
                        <input
                            name="code"
                            type="text"
                            placeholder="ETH"
                            autocomplete="off"
                            required
                        />
                    </label>

                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-ghost"
                            onclick="add_chain_modal.close()"
                        >
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Add chain
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button aria-label="Close">close</button>
            </form>
        </dialog>
    );
};
