import type { OpportunitySignal } from "@arbitrator/lister/types";

import {
    formatCompact,
    formatPrice,
    formatProfitPercentage,
} from "../../utils";
import { ArrowRightIcon } from "./icons";
import { signalColorClass } from "./signal";

/** A badge that copies its value when clicked (handled by `copy-to-clipboard.js`). */
const CopyBadge = ({ value }: { value: string }) => (
    <span
        class="signal-bg rounded-box cursor-pointer select-none px-4 py-2 text-lg font-bold transition-opacity hover:opacity-90 active:opacity-70"
        data-copy={value}
        role="button"
        tabindex="0"
        title={`Copy ${value}`}
    >
        {value.toUpperCase()}
    </span>
);

const ExchangeSymbolBadge = (x: {
    buyExchangeSymbol: string;
    sellExchangeSymbol: string;
}) => {
    if (x.buyExchangeSymbol === x.sellExchangeSymbol) {
        return <CopyBadge value={x.buyExchangeSymbol} />;
    }

    return (
        <>
            <CopyBadge value={x.buyExchangeSymbol} />
            <CopyBadge value={x.sellExchangeSymbol} />
        </>
    );
};

type Props = {
    signal: OpportunitySignal;
};

/**
 * One arbitrage signal as a card. The pair colour is a redundant cue: the
 * `USDT → IDR` badge, the numbers and the exchange names carry the same
 * information without colour.
 */
export const SignalCard = ({ signal }: Props) => {
    const {
        cmcId,
        coin,
        buyExchange,
        sellExchange,
        buyExchangeSymbol,
        sellExchangeSymbol,
        buyPrice,
        sellPrice,
        buyVolume,
        sellVolume,
        profitPercentage,
        profitVolume,
    } = signal;

    return (
        <article
            id={`signal-card-${cmcId}-${buyExchange.id}-${sellExchange.id}`}
            data-signal-node="true"
            data-buy-slug={buyExchange.slug}
            data-sell-slug={sellExchange.slug}
            data-profit-percentage={profitPercentage}
            data-profit-volume={profitVolume}
            class={`card border border-slate-300 bg-secondary-content text-black shadow-sm ${signalColorClass(
                buyExchange.baseCurrency,
                sellExchange.baseCurrency,
            )}`}
        >
            <div class="card-body gap-2 p-2.5 font-bold">
                <header class="flex items-center justify-between gap-1.5">
                    <div class="flex min-w-0 items-center gap-1.5">
                        <span
                            class="cursor-pointer truncate text-sm font-bold transition-opacity hover:opacity-90 active:opacity-70"
                            data-copy={coin.symbol.toUpperCase()}
                            role="button"
                            tabindex="0"
                            title={`Copy ${coin.symbol.toUpperCase()}`}
                            safe
                        >
                            {coin.symbol.toUpperCase()}
                        </span>
                        <span
                            class="badge badge-sm cursor-pointer border-slate-300 bg-secondary-content font-mono font-bold text-gray-900 transition-opacity hover:opacity-90 active:opacity-70"
                            data-copy={String(cmcId)}
                            role="button"
                            tabindex="0"
                            title="Copy CMC ID"
                        >
                            ID {cmcId}
                        </span>
                    </div>
                </header>

                <dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-2 gap-y-0.5 text-sm font-bold">
                    <dt class="opacity-90">Buy price</dt>
                    <dd class="text-right font-bold tabular-nums">
                        {formatPrice(buyPrice)}
                    </dd>
                    <dt class="opacity-90">Sell price</dt>
                    <dd class="text-right font-bold tabular-nums">
                        {formatPrice(sellPrice)}
                    </dd>
                </dl>

                <div class="text-center">
                    <p class="signal-color text-3xl font-bold tabular-nums">
                        {formatProfitPercentage(profitPercentage)}
                    </p>
                    <p class="text-sm font-bold opacity-90">
                        Profit{" "}
                        <span class="font-bold tabular-nums">
                            {formatCompact(profitVolume)}
                        </span>
                    </p>
                </div>

                <div class="flex flex-wrap items-center justify-center gap-1.5">
                    <ExchangeSymbolBadge
                        buyExchangeSymbol={buyExchangeSymbol}
                        sellExchangeSymbol={sellExchangeSymbol}
                    />
                    {/*
          <span
            class="signal-bg rounded-box px-4 py-2 text-lg font-bold"
            title={buyExchange.name}
            safe
          >
            {buyExchangeSymbol}
          </span>
          <span
            class="signal-bg rounded-box px-4 py-2 text-lg font-bold"
            title={sellExchange.name}
            safe
          >
            {sellExchangeSymbol}
          </span>
					*/}
                </div>

                <div class="flex items-center justify-center gap-2">
                    <div class="flex w-14 flex-col items-center gap-0.5">
                        <img
                            src={buyExchange.logo}
                            alt={buyExchange.name}
                            loading="lazy"
                            class="size-6 rounded-box bg-slate-200 object-contain p-0.5"
                        />
                        <span
                            class="truncate text-xs font-bold opacity-90"
                            safe
                        >
                            {buyExchange.name}
                        </span>
                    </div>
                    <ArrowRightIcon class="signal-color size-4 shrink-0" />
                    <div class="flex w-14 flex-col items-center gap-0.5">
                        <img
                            src={sellExchange.logo}
                            alt={sellExchange.name}
                            loading="lazy"
                            class="size-6 rounded-box bg-slate-200 object-contain p-0.5"
                        />
                        <span
                            class="truncate text-xs font-bold opacity-90"
                            safe
                        >
                            {sellExchange.name}
                        </span>
                    </div>
                </div>

                <dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-2 text-sm font-bold">
                    <dt class="opacity-90">Buy volume</dt>
                    <dd class="text-right font-bold tabular-nums">
                        {formatCompact(buyVolume)}
                    </dd>
                    <dt class="opacity-90">Sell volume</dt>
                    <dd class="text-right font-bold tabular-nums">
                        {formatCompact(sellVolume)}
                    </dd>
                </dl>
            </div>
        </article>
    );
};
