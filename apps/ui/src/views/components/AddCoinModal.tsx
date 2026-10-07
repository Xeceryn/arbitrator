export const AddCoinModal = () => {
    return (
        <dialog
            id="add_coin_modal"
            class="modal modal-bottom sm:modal-middle"
            aria-labelledby="add-coin-title"
        >
            <div class="modal-box">
                <h2 id="add-coin-title" class="text-lg font-semibold">
                    Add a cryptocurrency
                </h2>
                <p class="mt-1 text-sm text-base-content/70">
                    Use the slug from the CoinMarketCap URL, for example{" "}
                    <span class="font-mono">bitcoin</span>.
                </p>

                <label class="input input-bordered mt-4 w-full">
                    <span class="label">Slug</span>
                    <input
                        id="slug-add-coin-field"
                        name="slug"
                        type="text"
                        placeholder="bitcoin"
                        autocomplete="off"
                    />
                </label>

                <div class="modal-action">
                    <form method="dialog">
                        <button class="btn btn-ghost">Cancel</button>
                    </form>
                    <button
                        hx-post="/coins"
                        hx-trigger="click"
                        {...{
                            "hx-on:add-coin-success": `
                add_coin_modal.close();
                document.querySelector('#slug-add-coin-field').value = '';
              `,
                        }}
                        hx-target="#coin-table-body"
                        hx-include="[name=slug]"
                        hx-swap="beforebegin"
                        class="btn btn-primary"
                    >
                        Add coin
                    </button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button aria-label="Close">close</button>
            </form>
        </dialog>
    );
};
