import type { CryptocurrencyUpdate } from "@arbitrator/lister/types";

export const CryptocurrencyEditModalContent = (
    props: CryptocurrencyUpdate & { coinId: number },
) => {
    const coinId = props.coinId ?? 0;
    return (
        // A real <form>: htmx collects name/value of every control automatically.
        // No hx-include list that can drift out of sync with the fields.
        <form
            hx-patch={`/coins/${coinId}/edit`}
            hx-target={`#coin-table-row-${coinId}`}
            hx-swap="outerHTML"
            // htmx 4 swaps 4xx by default. Keep validation failures from nuking the row.
            {...{ "hx-status:422": "swap:none" }}
            // Server sends `HX-Trigger: update_coin_success` on success.
            hx-on:update_coin_success="cryptocurrency_edit_modal.close()"
        >
            <h2 id="edit-coin-title" class="text-lg font-semibold">
                Edit cryptocurrency
            </h2>

            <div class="mt-4 flex flex-col gap-3">
                <label class="input input-bordered">
                    <span class="label">Name</span>
                    <input
                        name="name"
                        autocomplete="off"
                        type="text"
                        placeholder="Bitcoin"
                        value={props.name}
                    />
                </label>

                <label class="input input-bordered">
                    <span class="label">Slug</span>
                    <input
                        name="slug"
                        type="text"
                        placeholder="bitcoin"
                        value={props.slug}
                    />
                </label>

                <label class="input input-bordered">
                    <span class="label">Symbol</span>
                    <input
                        name="symbol"
                        type="text"
                        placeholder="BTC"
                        value={props.symbol}
                    />
                </label>

                <label class="input input-bordered">
                    <span class="label">CMC ID</span>
                    <input
                        name="cmcId"
                        type="number"
                        inputmode="numeric"
                        placeholder="1"
                        value={props.cmcId?.toString() ?? ""}
                    />
                </label>
            </div>

            <div class="modal-action">
                <button
                    type="button"
                    class="btn btn-ghost"
                    onclick="cryptocurrency_edit_modal.close()"
                >
                    Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                    Save changes
                </button>
            </div>
        </form>
    );
};
