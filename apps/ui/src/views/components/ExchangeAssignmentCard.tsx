import type { MarketWithRelations } from "@arbitrator/lister/types";

import { AssignmentDialog } from "./AssignmentDialog";
import { ExchangeSymbolInput } from "./AssignmentStaging";
import { AssignmentToggle } from "./AssignmentToggle";
import { ChevronDownIcon, PencilIcon } from "./icons";
import { RowActions } from "./RowActions";

/** A table row group is the smallest self-contained exchange assignment. */
export const ExchangeAssignmentCard = ({
    coinId,
    market,
}: {
    coinId: number;
    market: MarketWithRelations;
}) => {
    const editSymbol = `const r=document.getElementById('symbol-editor-${market.id}');r.hidden=false;document.querySelectorAll('[data-symbol-trigger="${market.id}"]').forEach(b=>b.setAttribute('aria-expanded','true'));r.querySelector('input').focus()`;
    const closeSymbol = `document.getElementById('symbol-editor-${market.id}').hidden=true;const edit=[...document.querySelectorAll('[data-symbol-trigger="${market.id}"]')].find(b=>b.getClientRects().length);document.querySelectorAll('[data-symbol-trigger="${market.id}"]').forEach(b=>b.setAttribute('aria-expanded','false'));edit?.focus()`;
    const cancelSymbol = `this.form.reset();document.getElementById('symbol-error-${market.id}').replaceChildren();this.form.querySelector('input').removeAttribute('aria-invalid');${closeSymbol}`;
    return (
        <tbody
            id={`market-card-${market.id}`}
            class="block border-b border-base-300 last:border-b-0 sm:table-row-group sm:border-0"
            data-assignment-name={`${market.exchange.name} ${market.exchangeSymbol}`.toLowerCase()}
        >
            <tr class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-2 border-0 p-3 sm:table-row sm:border-b sm:p-0">
                <td class="col-span-2 min-w-0 p-0 sm:px-4 sm:py-3">
                    <div class="flex min-w-0 items-center gap-2 sm:gap-3">
                        <img
                            src={market.exchange.logo}
                            alt=""
                            loading="lazy"
                            class="size-7 shrink-0 rounded-full object-contain sm:size-8"
                        />
                        <div class="min-w-0">
                            <span class="block truncate font-medium">
                                {market.exchange.name}
                            </span>
                            <span class="block truncate text-xs uppercase text-base-content/80">
                                {market.exchange.baseCurrency}
                            </span>
                        </div>
                    </div>
                </td>
                <td class="row-start-2 min-w-0 p-0 sm:px-4 sm:py-3">
                    <button
                        type="button"
                        id={`edit-symbol-button-${market.id}`}
                        class="btn btn-sm min-h-11 max-w-full gap-1 px-2 font-mono sm:gap-2 sm:px-3"
                        aria-label={`Edit exchange symbol for ${market.exchange.name}`}
                        aria-expanded="false"
                        aria-controls={`symbol-editor-${market.id}`}
                        data-symbol-trigger={String(market.id)}
                        hx-on:click={editSymbol}
                    >
                        <span class="max-w-12 truncate sm:max-w-32">
                            {market.exchangeSymbol}
                        </span>
                        <PencilIcon />
                        <span class="font-sans sm:hidden">Edit</span>
                    </button>
                </td>
                <td class="col-start-3 row-start-1 p-0 sm:px-4 sm:py-3">
                    <AssignmentToggle
                        label="Trading"
                        name={`Trading on ${market.exchange.name}`}
                        enabled={market.tradeEnabled}
                        url={`/coins/${coinId}/assignments/${market.id}`}
                        field="tradeEnabled"
                        compact
                    />
                </td>
                <td class="col-start-2 row-start-2 p-0 text-right sm:px-4 sm:py-3">
                    <button
                        type="button"
                        id={`expand-chains-button-${market.id}`}
                        class="btn btn-sm min-h-11 gap-1 px-2 aria-expanded:btn-active sm:gap-2"
                        aria-label={`Manage chains for ${market.exchange.name}`}
                        aria-expanded="false"
                        aria-controls={`market-chains-row-${market.id}`}
                        hx-get={`/coins/${coinId}/assignments/${market.id}/chains`}
                        hx-target={`#market-chains-${market.id}`}
                        hx-swap="innerHTML"
                        hx-indicator="#coin-assignment-indicator"
                        hx-morph-skip="true"
                        hx-on:click={`const r=document.getElementById('market-chains-row-${market.id}');r.hidden=!r.hidden;this.setAttribute('aria-expanded',String(!r.hidden));this.querySelector('svg').classList.toggle('rotate-180',!r.hidden)`}
                    >
                        <span class="whitespace-nowrap">
                            <span class="hidden sm:inline">Manage chains</span>
                            <span class="sm:hidden">Chains</span>
                        </span>
                        <ChevronDownIcon />
                    </button>
                </td>
                <td class="col-start-3 row-start-2 p-0 sm:px-4 sm:py-3">
                    <RowActions
                        id={`assignment-actions-${market.id}`}
                        name={market.exchange.name}
                    >
                        <li>
                            <button
                                type="button"
                                class="min-h-10"
                                hx-on:click={editSymbol}
                            >
                                <PencilIcon /> Edit symbol
                            </button>
                        </li>
                        <li class="mt-1 border-t border-base-300 pt-1">
                            <button
                                type="button"
                                class="min-h-10"
                                aria-label={`Remove ${market.exchange.name} assignment`}
                                hx-delete={`/coins/${coinId}/assignments/${market.id}`}
                                hx-confirm={`This removes ${market.cryptocurrency.name} from ${market.exchange.name}, including trading and all chain assignments for this pair. The coin and exchange are kept.`}
                                data-confirm-title={`Remove ${market.exchange.name}?`}
                                data-confirm-label="Remove exchange"
                                hx-target={`#market-card-${market.id}`}
                                hx-swap="delete"
                                data-hx-disable="this"
                                hx-indicator="#coin-assignment-indicator"
                                {...{ "hx-status:5xx": "swap:none" }}
                            >
                                Remove assignment
                            </button>
                        </li>
                    </RowActions>
                </td>
            </tr>
            <tr
                id={`symbol-editor-${market.id}`}
                class="block sm:table-row"
                hidden
            >
                <td
                    colspan="5"
                    class="block bg-base-200 p-3 sm:table-cell sm:px-4 sm:py-4"
                >
                    <form
                        class="flex max-w-2xl flex-col gap-4 rounded-box border border-base-content/25 bg-base-100 p-4 sm:p-5"
                        hx-patch={`/coins/${coinId}/assignments/${market.id}`}
                        hx-target={`#market-card-${market.id}`}
                        hx-swap="outerMorph"
                        data-hx-disable="find button[type=submit]"
                        hx-indicator="#coin-assignment-indicator"
                        hx-on:assignment-symbol-saved={closeSymbol}
                        hx-on:keydown={`if(event.key==='Escape'){event.preventDefault();this.reset();document.getElementById('symbol-error-${market.id}').replaceChildren();this.querySelector('input').removeAttribute('aria-invalid');${closeSymbol}}`}
                        {...{
                            "hx-status:422": `target:#symbol-error-${market.id} swap:innerHTML`,
                            "hx-status:5xx": "swap:none",
                        }}
                    >
                        <label
                            for={`exchange-symbol-${market.id}`}
                            class="text-base font-semibold"
                        >
                            Edit symbol on {market.exchange.name}
                        </label>
                        <ExchangeSymbolInput
                            id={`exchange-symbol-${market.id}`}
                            value={market.exchangeSymbol}
                            describedBy={`symbol-error-${market.id}`}
                            ariaLabel={null}
                        />
                        <div
                            id={`symbol-error-${market.id}`}
                            role="alert"
                            class="empty:hidden"
                        ></div>
                        <div class="flex flex-wrap justify-end gap-2 border-t border-base-300 pt-4">
                            <button
                                type="button"
                                class="btn min-h-11"
                                hx-on:click={cancelSymbol}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                class="btn btn-primary min-h-11"
                            >
                                Save symbol
                            </button>
                        </div>
                    </form>
                </td>
            </tr>
            <tr
                id={`market-chains-row-${market.id}`}
                class="block sm:table-row"
                hidden
                hx-morph-skip="true"
            >
                <td
                    colspan="5"
                    class="block bg-base-200 p-2 sm:table-cell sm:px-4 sm:py-4"
                >
                    <section
                        class="rounded-box border border-base-content/25 bg-base-100 p-3 sm:p-5"
                        aria-label={`Chain settings on ${market.exchange.name}`}
                    >
                        <h3 class="mb-3 text-base font-semibold">
                            Chains on {market.exchange.name}
                        </h3>
                        <div id={`market-chains-${market.id}`}>
                            <p class="py-4 text-sm" role="status">
                                Loading chains…
                            </p>
                        </div>
                    </section>
                    <AssignmentDialog
                        id={`assign-chain-dialog-${market.id}`}
                        contentId={`market-chain-staging-${market.id}`}
                        title="Assign chain"
                        context={`${market.exchange.name} · ${market.cryptocurrency.name}`}
                    />
                </td>
            </tr>
        </tbody>
    );
};
