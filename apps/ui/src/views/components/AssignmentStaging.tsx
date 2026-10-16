import type {
    CryptocurrencySelect,
    ExchangeSelect,
} from "@arbitrator/lister/types";

import { SearchIcon } from "./icons";

/**
 * Step 1 of the staged assignment flow: choose an exchange.
 *
 * Swapped into `#assignment-staging` by the "Add exchange" control. The
 * candidate region starts empty and only fills after a deliberate search,
 * submit or pagination click — there is no `hx-trigger="load"` anywhere.
 */
export const ExchangePicker = ({ coinId }: { coinId: number }) => (
    <div id="assignment-exchange-picker">
        <div class="mb-3 flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold">Choose an exchange</h3>
            <button
                type="button"
                class="btn btn-ghost btn-xs"
                hx-on:click="this.closest('#assignment-staging').replaceChildren(); document.getElementById('add-exchange-button')?.setAttribute('aria-expanded','false')"
            >
                Cancel
            </button>
        </div>

        <form
            class="flex flex-col"
            hx-get={`/coins/${coinId}/available-exchanges`}
            hx-target="#available-exchanges"
            hx-swap="innerHTML"
            hx-trigger="submit"
            hx-sync="#available-exchanges:replace"
            hx-indicator="#exchange-search-indicator"
        >
            <label class="input input-bordered w-full">
                <span class="sr-only">Search exchanges</span>
                <SearchIcon />
                <input
                    id="exchange-search"
                    type="search"
                    name="search"
                    placeholder="Search exchange"
                    autocomplete="off"
                    hx-get={`/coins/${coinId}/available-exchanges`}
                    hx-target="#available-exchanges"
                    hx-swap="innerHTML"
                    hx-trigger="input changed delay:300ms, search"
                    hx-include="closest form"
                    hx-sync="#available-exchanges:replace"
                    hx-indicator="#exchange-search-indicator"
                />
            </label>
            <span
                id="exchange-search-indicator"
                class="htmx-indicator loading loading-spinner loading-xs"
            ></span>
            <button type="submit" class="btn btn-primary btn-sm mt-2 w-fit">
                Search
            </button>
        </form>

        {/* Stable region: rendered before its content, announced politely. */}
        <div
            id="available-exchanges"
            role="status"
            aria-live="polite"
            class="mt-2 flex flex-col"
        ></div>
    </div>
);

/**
 * The exchange symbol field, shared by the confirm card and the 422 partial so
 * the field can be re-rendered with validation state without touching the
 * rest of the card.
 */
export const ExchangeSymbolInput = ({
    id = "exchange-symbol-input",
    value,
    invalid = false,
    describedBy,
    ariaLabel = "Exchange symbol",
}: {
    id?: string;
    value: string;
    invalid?: boolean;
    describedBy?: string;
    /**
     * Accessible name for the field. Pass `null` where a visible `<label>`
     * already names this input via `for`/`id`, so there is exactly one
     * association and no duplicated name.
     */
    ariaLabel?: string | null;
}) => (
    <input
        id={id}
        type="text"
        name="exchangeSymbol"
        value={value}
        maxlength="255"
        autocomplete="off"
        class={`input input-bordered w-full font-mono ${invalid ? "input-error" : ""}`}
        aria-label={ariaLabel ?? undefined}
        aria-invalid={invalid ? "true" : undefined}
        aria-describedby={invalid ? describedBy : undefined}
    />
);

/** Inline validation message. Swapped into a `role="alert"` region. */
export const AssignmentError = ({ message }: { message: string }) => (
    <p class="text-sm text-error">{message}</p>
);

type ConfirmProps = {
    coin: CryptocurrencySelect;
    exchange: ExchangeSelect;
    defaultSymbol: string;
};

/**
 * Step 2: an explicit confirmation before anything is written.
 *
 * The root listens for `assignment-exchange-added` and re-requests step 1 into
 * `#assignment-staging`. That is the whole reset mechanism: after a successful
 * assign the region returns to step 1 purely from server-provided markup, with
 * no client routing state to keep in sync.
 */
export const AssignmentConfirmCard = ({
    coin,
    exchange,
    defaultSymbol,
}: ConfirmProps) => (
    <div
        id="assignment-confirm"
        hx-trigger="assignment-exchange-added from:body"
        hx-get={`/coins/${coin.id}/assignment/new`}
        hx-target="#assignment-staging"
        hx-swap="innerHTML"
        hx-indicator="#coin-assignment-indicator"
    >
        <h3 class="text-sm font-semibold">Confirm assignment</h3>
        <p class="mt-1 text-sm opacity-70">
            Assign <span class="font-medium">{coin.name}</span> to{" "}
            <span class="font-medium">{exchange.name}</span> as{" "}
            <span class="font-mono">{defaultSymbol}</span>.
        </p>

        {/* Persistent error region: it is rendered first and only its content
        changes, so a 422 retarget always has a target. */}
        <div id="assignment-error" role="alert" class="mt-2"></div>

        <form
            class="mt-3 flex flex-col gap-3"
            hx-post={`/coins/${coin.id}/assignments`}
            hx-target="#coin-assignment-list"
            hx-swap="beforeend"
            hx-indicator="#coin-assignment-indicator"
            hx-vals="js:{ tradeEnabled: this.querySelector('[name=tradeEnabled]').checked }"
            {...{ "hx-status:422": "target:#assignment-error swap:innerHTML" }}
            {...{ "hx-status:5xx": "swap:none" }}
        >
            <input type="hidden" name="exchangeId" value={String(exchange.id)} />

            <div class="form-control w-full">
                <label class="label-text" for="exchange-symbol-input">
                    Exchange symbol
                </label>
                <ExchangeSymbolInput
                    value={defaultSymbol}
                    ariaLabel={null}
                />
                <span class="mt-1 text-xs opacity-60">
                    Optional. Leave the suggested value to use the coin symbol.
                </span>
            </div>

            <label class="label w-fit cursor-pointer gap-2">
                <span class="label-text">Trade enabled</span>
                <input
                    type="checkbox"
                    name="tradeEnabled"
                    value="true"
                    checked
                    class="toggle toggle-sm"
                />
            </label>

            <div class="flex flex-wrap gap-2">
                <button type="submit" class="btn btn-primary btn-sm">
                    Assign exchange
                </button>
                <button
                    type="button"
                    class="btn btn-ghost btn-sm"
                    hx-get={`/coins/${coin.id}/assignment/new`}
                    hx-target="#assignment-staging"
                    hx-swap="innerHTML"
                    hx-indicator="#coin-assignment-indicator"
                >
                    Choose another exchange
                </button>
            </div>
        </form>
    </div>
);
