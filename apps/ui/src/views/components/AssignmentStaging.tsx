import type {
    CryptocurrencySelect,
    ExchangeSelect,
    PaginatedExchangeList,
} from "@arbitrator/lister/types";

import { AvailableExchanges } from "./AssignExchangeDropdown";
import { SearchIcon } from "./icons";

/**
 * Step 1 of the staged assignment flow: choose an exchange.
 *
 * Swapped into the assignment dialog by the "Assign exchange" control. The
 * candidates arrive in the same response, so opening the picker never looks empty.
 */
export const ExchangePicker = ({
    coinId,
    data,
}: {
    coinId: number;
    data: PaginatedExchangeList;
}) => (
    <div id="assignment-exchange-picker">
        <h3 class="mb-3 text-base font-semibold">Choose an exchange</h3>

        <form
            class="flex flex-col"
            hx-get={`/coins/${coinId}/available-exchanges`}
            hx-target="#available-exchanges"
            hx-swap="innerHTML"
            hx-trigger="submit, input delay:300ms, search"
            hx-sync="#available-exchanges:replace"
            hx-indicator="#exchange-search-indicator"
        >
            <label class="input min-h-11 w-full bg-base-100">
                <span class="sr-only">Search exchanges</span>
                <SearchIcon />
                <input
                    id="exchange-search"
                    type="search"
                    name="search"
                    class="min-w-0 placeholder:text-base-content/70 placeholder:opacity-100 focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Search exchanges"
                    autocomplete="off"
                    data-autofocus
                />
                <span
                    id="exchange-search-indicator"
                    class="htmx-indicator loading loading-spinner loading-xs"
                ></span>
            </label>
        </form>

        {/* Stable region: rendered before its content, announced politely. */}
        <div
            id="available-exchanges"
            role="status"
            aria-live="polite"
            class="mt-4 flex flex-col"
        >
            <AvailableExchanges coinId={coinId} data={data} />
        </div>
        <div class="mt-5 flex justify-end border-t border-base-300 pt-4">
            <button
                type="button"
                class="btn min-h-11"
                hx-on:click="this.closest('dialog').close()"
            >
                Cancel
            </button>
        </div>
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
    focusOnLoad = false,
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
    focusOnLoad?: boolean;
}) => (
    <input
        id={id}
        type="text"
        name="exchangeSymbol"
        value={value}
        maxlength="255"
        autocomplete="off"
        class={`input min-h-11 w-full bg-base-100 font-mono ${invalid ? "input-error" : ""}`}
        aria-label={ariaLabel ?? undefined}
        aria-invalid={invalid ? "true" : undefined}
        aria-describedby={describedBy}
        data-autofocus={focusOnLoad ? "true" : undefined}
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
 * Close only after a successful write; validation leaves this form intact.
 */
export const AssignmentConfirmCard = ({
    coin,
    exchange,
    defaultSymbol,
}: ConfirmProps) => (
    <div
        id="assignment-confirm"
        hx-on:assignment-exchange-added="this.closest('dialog').close()"
    >
        <div class="flex items-center justify-between gap-3 border-b border-base-300 pb-4">
            <div class="flex min-w-0 items-center gap-3">
                <img
                    src={exchange.logo}
                    alt=""
                    class="size-9 shrink-0 rounded-full object-contain"
                />
                <h3 class="break-words text-base font-semibold">
                    {exchange.name}
                </h3>
            </div>
            <button
                type="button"
                class="btn btn-sm min-h-11 shrink-0"
                hx-get={`/coins/${coin.id}/assignment/new`}
                hx-target="#assignment-staging"
                hx-swap="innerHTML"
                hx-indicator="#assignment-staging-indicator"
            >
                Change exchange
            </button>
        </div>

        {/* Persistent error region: it is rendered first and only its content
        changes, so a 422 retarget always has a target. */}
        <div id="assignment-error" role="alert" class="mt-2"></div>

        <form
            class="mt-4 flex flex-col gap-5"
            hx-post={`/coins/${coin.id}/assignments`}
            hx-target="#coin-assignment-list"
            hx-swap="beforeend"
            hx-indicator="#assignment-staging-indicator"
            data-hx-disable="find button[type=submit]"
            hx-vals="js:{ tradeEnabled: this.querySelector('[name=tradeEnabled]').checked }"
            {...{ "hx-status:422": "target:#assignment-error swap:innerHTML" }}
            {...{ "hx-status:5xx": "swap:none" }}
        >
            <input
                type="hidden"
                name="exchangeId"
                value={String(exchange.id)}
            />

            <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium" for="exchange-symbol-input">
                    Exchange symbol
                </label>
                <ExchangeSymbolInput
                    value={defaultSymbol}
                    ariaLabel={null}
                    focusOnLoad
                />
            </div>

            <label class="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-field bg-base-200 p-3 text-sm font-medium">
                <span>Enable trading</span>
                <input
                    type="checkbox"
                    name="tradeEnabled"
                    value="true"
                    checked
                    class="toggle"
                />
            </label>

            <div class="flex flex-wrap justify-end gap-2 border-t border-base-300 pt-4">
                <button
                    type="button"
                    class="btn min-h-11"
                    hx-on:click="this.closest('dialog').close()"
                >
                    Cancel
                </button>
                <button type="submit" class="btn btn-primary min-h-11">
                    Add exchange
                </button>
            </div>
        </form>
    </div>
);
