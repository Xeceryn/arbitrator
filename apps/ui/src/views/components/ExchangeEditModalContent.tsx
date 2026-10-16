import type { ExchangeUpdate } from "@arbitrator/lister/types";

export const ExchangeEditModalContent = (
    props: ExchangeUpdate & { exchangeId: number },
) => {
    const exchangeId = props.exchangeId ?? 0;
    return (
        <form
            hx-patch={`/markets/${exchangeId}/edit`}
            hx-target={`#market-table-row-${exchangeId}`}
            hx-swap="outerHTML"
            // htmx 4 swaps 4xx by default. Keep validation failures from nuking the row.
            {...{ "hx-status:422": "swap:none" }}
            hx-on:exchange-updated="exchange_edit_modal.close()"
        >
            <h2 id="edit-exchange-title" class="text-lg font-semibold">
                Edit exchange
            </h2>

            <div class="mt-4 flex flex-col gap-3">
                <label class="input input-bordered">
                    <span class="label">Name</span>
                    <input
                        name="name"
                        type="text"
                        placeholder="Binance"
                        autocomplete="off"
                        value={props.name}
                    />
                </label>

                <label class="input input-bordered">
                    <span class="label">Slug</span>
                    <input
                        name="slug"
                        type="text"
                        placeholder="binance"
                        autocomplete="off"
                        value={props.slug}
                    />
                </label>

                <label class="input input-bordered">
                    <span class="label">CMC ID</span>
                    <input
                        name="cmcId"
                        type="number"
                        inputmode="numeric"
                        placeholder="270"
                        value={props.cmcId?.toString() ?? ""}
                    />
                </label>

                <label class="input input-bordered">
                    <span class="label">Logo URL</span>
                    <input
                        name="logo"
                        type="url"
                        placeholder="https://..."
                        value={props.logo}
                    />
                </label>

                <label class="select select-bordered">
                    <span class="label">Base currency</span>
                    <select name="baseCurrency">
                        <option
                            value="usdt"
                            selected={props.baseCurrency === "usdt"}
                        >
                            USDT
                        </option>
                        <option
                            value="idr"
                            selected={props.baseCurrency === "idr"}
                        >
                            IDR
                        </option>
                    </select>
                </label>

                <label class="select select-bordered">
                    <span class="label">Registered on CoinMarketCap</span>
                    <select name="registeredOnCmc">
                        <option
                            value="true"
                            selected={props.registeredOnCmc === true}
                        >
                            Yes
                        </option>
                        <option
                            value="false"
                            selected={props.registeredOnCmc !== true}
                        >
                            No
                        </option>
                    </select>
                </label>
            </div>

            <div class="modal-action">
                <button
                    type="button"
                    class="btn btn-ghost"
                    onclick="exchange_edit_modal.close()"
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
