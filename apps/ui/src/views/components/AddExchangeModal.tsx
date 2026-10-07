export const AddExchangeModal = () => {
    return (
        <dialog
            id="add_exchange_modal"
            class="modal modal-bottom sm:modal-middle"
            aria-labelledby="add-exchange-title"
        >
            <div class="modal-box">
                <h2 id="add-exchange-title" class="text-lg font-semibold">
                    Add an exchange
                </h2>

                <form
                    id="add-exchange-form"
                    hx-post="/markets"
                    hx-target="#market-table-body"
                    hx-swap="afterbegin"
                    hx-on:add-exchange-success="add_exchange_modal.close()"
                    class="mt-4 flex flex-col gap-3"
                >
                    <label class="input input-bordered">
                        <span class="label">Name</span>
                        <input
                            name="name"
                            type="text"
                            placeholder="Binance"
                            autocomplete="off"
                            required
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">Slug</span>
                        <input
                            name="slug"
                            type="text"
                            placeholder="binance"
                            autocomplete="off"
                            required
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">CMC ID</span>
                        <input
                            name="cmcId"
                            type="number"
                            inputmode="numeric"
                            placeholder="270"
                            required
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">Logo URL</span>
                        <input
                            name="logo"
                            type="url"
                            placeholder="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png"
                            required
                        />
                    </label>

                    <label class="select select-bordered">
                        <span class="label">Base currency</span>
                        <select name="baseCurrency">
                            <option value="usdt">USDT</option>
                            <option value="idr">IDR</option>
                        </select>
                    </label>

                    <label class="select select-bordered">
                        <span class="label">Registered on CoinMarketCap</span>
                        <select name="registeredOnCmc">
                            <option value="true" selected>
                                Yes
                            </option>
                            <option value="false">No</option>
                        </select>
                    </label>

                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-ghost"
                            onclick="add_exchange_modal.close()"
                        >
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Add exchange
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
