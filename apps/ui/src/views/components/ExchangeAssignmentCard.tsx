import type { MarketWithRelations } from "@arbitrator/lister/types";

import { ChevronDownIcon, PencilIcon, XIcon } from "./icons";

type Props = {
    coinId: number;
    market: MarketWithRelations;
};

/**
 * One exchange assignment for a coin, as a self-contained card.
 *
 * The header row wraps on narrow widths. The trade toggle and unassign refresh
 * the whole list (outerMorph); the chain panel is marked `hx-morph-skip` so a
 * refresh does not drop an expanded chain list. The pencil reveals an inline
 * editor for `exchangeSymbol`.
 */
export const ExchangeAssignmentCard = ({ coinId, market }: Props) => {
    return (
        <div
            id={`market-card-${market.id}`}
            class="flex flex-col gap-3 rounded-box bg-base-100 p-3 shadow-sm transition-colors hover:bg-base-200/60 sm:p-4"
        >
            <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <div class="avatar">
                    <div class="mask mask-circle size-8">
                        <img src={market.exchange.logo} alt="" loading="lazy" />
                    </div>
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                        <span class="truncate font-medium" safe>
                            {market.exchange.name}
                        </span>
                        <span
                            class="badge badge-outline font-mono text-xs"
                            title="Exchange symbol"
                            safe
                        >
                            {market.exchangeSymbol}
                        </span>
                    </div>
                    <div class="truncate text-sm opacity-60" safe>
                        {market.exchange.slug}
                    </div>
                </div>

                <label class="label w-fit cursor-pointer gap-2">
                    <span class="label-text">Trade</span>
                    <input
                        type="checkbox"
                        class="toggle toggle-sm"
                        checked={market.tradeEnabled}
                        hx-patch={`/coins/${coinId}/assignments/${market.id}`}
                        hx-trigger="change"
                        hx-vals="js:{ tradeEnabled: event.target.checked }"
                        hx-swap="none"
                        hx-indicator="#coin-assignment-indicator"
                        hx-on:toggle-error="this.checked = event.detail.tradeEnabled"
                    />
                </label>

                <div class="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        class="btn btn-square btn-ghost btn-xs"
                        aria-label={`Edit exchange symbol for ${market.exchange.name}`}
                        title="Edit exchange symbol"
                        hx-on:click={`const el=document.getElementById('symbol-editor-${market.id}');el.classList.toggle('hidden');if(!el.classList.contains('hidden'))el.querySelector('input')?.focus();`}
                    >
                        <PencilIcon />
                    </button>

                    <button
                        type="button"
                        id={`expand-chains-button-${market.id}`}
                        class="btn btn-square btn-ghost btn-xs"
                        aria-label={`Show or hide chains for ${market.exchange.name}`}
                        aria-expanded="false"
                        title="Show / hide chains"
                        hx-get={`/coins/${coinId}/assignments/${market.id}/chains`}
                        hx-trigger="click once"
                        hx-target={`#market-chains-${market.id}`}
                        hx-swap="innerHTML"
                        hx-indicator="#coin-assignment-indicator"
                        hx-morph-skip="true"
                        hx-on:click={`const p=document.getElementById('market-chains-${market.id}');p.classList.toggle('hidden');const i=document.getElementById('expand-chains-icon-${market.id}');i&&i.classList.toggle('rotate-180');document.getElementById('expand-chains-button-${market.id}').setAttribute('aria-expanded',p.classList.contains('hidden')?'false':'true');`}
                    >
                        <ChevronDownIcon
                            id={`expand-chains-icon-${market.id}`}
                            class="size-4 transition-transform duration-150 ease-out"
                        />
                    </button>

                    <button
                        type="button"
                        class="btn btn-square btn-ghost btn-xs btn-error"
                        aria-label={`Unassign ${market.exchange.name}`}
                        title={`Unassign ${market.exchange.name}`}
                        hx-delete={`/coins/${coinId}/assignments/${market.id}`}
                        hx-confirm={`Unassign ${market.exchange.name} from this coin?`}
                        hx-target="#coin-assignment-list"
                        hx-swap="outerMorph"
                        hx-indicator="#coin-assignment-indicator"
                    >
                        <XIcon />
                    </button>
                </div>
            </div>

            <div id={`symbol-editor-${market.id}`} class="hidden">
                <form
                    class="flex flex-wrap items-center gap-2"
                    hx-patch={`/coins/${coinId}/assignments/${market.id}`}
                    hx-target="#coin-assignment-list"
                    hx-swap="outerMorph"
                    hx-indicator="#coin-assignment-indicator"
                >
                    <input
                        name="exchangeSymbol"
                        value={market.exchangeSymbol}
                        required
                        maxlength="255"
                        autocomplete="off"
                        aria-label="Exchange symbol"
                        class="input input-bordered input-sm w-40 font-mono"
                    />
                    <button type="submit" class="btn btn-sm btn-primary">
                        Save
                    </button>
                    <button
                        type="button"
                        class="btn btn-sm btn-ghost"
                        hx-on:click={`document.getElementById('symbol-editor-${market.id}').classList.add('hidden')`}
                    >
                        Cancel
                    </button>
                </form>
            </div>

            <div
                id={`market-chains-${market.id}`}
                class="hidden"
                hx-morph-skip="true"
            ></div>
        </div>
    );
};
