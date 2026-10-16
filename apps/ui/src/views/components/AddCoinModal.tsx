import { ariaInvalidHandler, FormErrorRegion } from "./FormErrors";

/**
 * Add-coin dialog. The form is a real `<form>` (htmx collects every named
 * control) that posts to `/coins`; the response is the smallest fragment — the
 * new row — plus partials that clear the error region and drop the empty-state
 * row. `HX-Trigger: coin-created` closes the dialog.
 */
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

                <form
                    id="add-coin-form"
                    hx-post="/coins"
                    hx-target="#coin-table-body"
                    hx-swap="afterbegin"
                    {...{
                        // htmx 4 swaps 4xx by default; route validation into the
                        // inline region instead of the table body.
                        "hx-status:422":
                            "target:#add-coin-error swap:innerHTML",
                        "hx-status:5xx": "swap:none",
                        "hx-on:coin-validation-error": ariaInvalidHandler(),
                        "hx-on:coin-created":
                            "add_coin_modal.close(); this.reset();",
                    }}
                    class="mt-4 flex flex-col gap-3"
                >
                    <FormErrorRegion id="add-coin-error" />

                    <label class="input input-bordered">
                        <span class="label">Name</span>
                        <input
                            name="name"
                            type="text"
                            placeholder="Bitcoin"
                            autocomplete="off"
                            required
                            aria-describedby="add-coin-error"
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">Symbol</span>
                        <input
                            name="symbol"
                            type="text"
                            placeholder="BTC"
                            autocomplete="off"
                            required
                            aria-describedby="add-coin-error"
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">Slug</span>
                        <input
                            name="slug"
                            type="text"
                            placeholder="bitcoin"
                            autocomplete="off"
                            required
                            aria-describedby="add-coin-error"
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">CMC ID</span>
                        <input
                            name="cmcId"
                            type="number"
                            inputmode="numeric"
                            placeholder="1"
                            required
                            aria-describedby="add-coin-error"
                        />
                    </label>

                    <label class="input input-bordered">
                        <span class="label">Logo URL</span>
                        <input
                            name="logo"
                            type="url"
                            placeholder="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
                            required
                            aria-describedby="add-coin-error"
                        />
                    </label>

                    <div class="modal-action">
                        <button
                            type="button"
                            class="btn btn-ghost"
                            onclick="add_coin_modal.close()"
                        >
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            Add coin
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
