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
        data-clipboard-text={value}
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
        /*
          `data-theme="light"` re-scopes daisyUI's light palette onto this
          subtree, so the card stays a white surface with dark text whatever
          the page theme is. On the default dark theme that makes the board
          read as a distinct surface instead of blending into `base-100`.
        */
        <article
            id={`signal-card-${cmcId}-${buyExchange.id}-${sellExchange.id}`}
            data-signal-node="true"
            data-theme="light"
            data-buy-slug={buyExchange.slug}
            data-sell-slug={sellExchange.slug}
            data-route={`${buyExchange.baseCurrency}-${sellExchange.baseCurrency}`}
            data-profit-percentage={profitPercentage}
            data-profit-volume={profitVolume}
            class={`card border border-base-300 bg-base-100 text-base-content shadow-lg ${signalColorClass(
                buyExchange.baseCurrency,
                sellExchange.baseCurrency,
            )}`}
        >
            <div class="card-body gap-2 p-2.5 font-bold">
                <header class="flex items-center justify-between gap-1.5">
                    <div class="flex min-w-0 items-center gap-1.5">
                        <span
                            class="cursor-pointer truncate text-sm font-bold transition-opacity hover:opacity-90 active:opacity-70"
                            data-clipboard-text={coin.symbol.toUpperCase()}
                            role="button"
                            tabindex="0"
                            title={`Copy ${coin.symbol.toUpperCase()}`}
                            safe
                        >
                            {coin.symbol.toUpperCase()}
                        </span>
                        <span
                            class="badge badge-sm cursor-pointer border-base-300 bg-base-100 font-mono font-bold text-base-content transition-opacity hover:opacity-90 active:opacity-70"
                            data-clipboard-text={String(cmcId)}
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

                {/*
                  Logos only, no exchange names: the label was truncated to a
                  few characters in the 6/8-column layout anyway. The name now
                  lives in `alt` and the `title` tooltip. They load eagerly:
                  lazy loading left the `alt` text showing in a 48px box while
                  the handful of exchange logos were still in flight.
                */}
                <div class="flex items-center justify-center gap-2">
                    <img
                        src={buyExchange.logo}
                        alt={buyExchange.name}
                        title={buyExchange.name}
                        class="size-12 object-contain 2xl:size-10"
                    />
                    <ArrowRightIcon class="signal-color size-5 shrink-0 2xl:size-4" />
                    <img
                        src={sellExchange.logo}
                        alt={sellExchange.name}
                        title={sellExchange.name}
                        class="size-12 object-contain 2xl:size-10"
                    />
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
