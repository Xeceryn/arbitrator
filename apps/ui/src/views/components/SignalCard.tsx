import type { OpportunitySignal } from "@arbitrator/lister/types";

import {
  formatCompact,
  formatPrice,
  formatProfitPercentage,
} from "../../utils";
import { ArrowRightIcon } from "./icons";
import { signalColorClass, signalPairLabel } from "./signal";

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
      class={`card border border-base-300 bg-base-100 shadow-sm ${signalColorClass(
        buyExchange.baseCurrency,
        sellExchange.baseCurrency,
      )}`}
    >
      <div class="card-body gap-2 p-2.5">
        <header class="flex items-center justify-between gap-1.5">
          <div class="flex min-w-0 items-center gap-1.5">
            <img
              src={coin.logo}
              alt=""
              loading="lazy"
              class="size-5 rounded-full bg-base-200 object-contain"
            />
            <span class="truncate text-xs font-semibold" safe>
              {coin.symbol}
            </span>
            <span class="badge badge-ghost badge-xs font-mono">ID {cmcId}</span>
          </div>
          <span
            class="badge badge-outline badge-xs signal-color signal-ring"
            title={signalPairLabel(
              buyExchange.baseCurrency,
              sellExchange.baseCurrency,
            )}
          >
            {signalPairLabel(
              buyExchange.baseCurrency,
              sellExchange.baseCurrency,
            )}
          </span>
        </header>

        <dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-2 gap-y-0.5 text-xs">
          <dt class="opacity-60">Buy price</dt>
          <dd class="text-right font-medium tabular-nums">
            {formatPrice(buyPrice)}
          </dd>
          <dt class="opacity-60">Sell price</dt>
          <dd class="text-right font-medium tabular-nums">
            {formatPrice(sellPrice)}
          </dd>
        </dl>

        <div class="text-center">
          <p class="signal-color text-2xl font-bold tabular-nums">
            {formatProfitPercentage(profitPercentage)}
          </p>
          <p class="text-xs opacity-70">
            Profit{" "}
            <span class="font-semibold tabular-nums">
              {formatCompact(profitVolume)}
            </span>
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-1.5">
          <span
            class="signal-bg rounded-box px-2 py-0.5 text-xs font-semibold"
            title={buyExchange.name}
            safe
          >
            {buyExchangeSymbol}
          </span>
          <span
            class="signal-bg rounded-box px-2 py-0.5 text-xs font-semibold"
            title={sellExchange.name}
            safe
          >
            {sellExchangeSymbol}
          </span>
        </div>

        <div class="flex items-center justify-center gap-2">
          <div class="flex w-14 flex-col items-center gap-0.5">
            <img
              src={buyExchange.logo}
              alt={buyExchange.name}
              loading="lazy"
              class="size-6 rounded-box bg-base-200 object-contain p-0.5"
            />
            <span class="truncate text-[0.625rem] opacity-70" safe>
              {buyExchange.name}
            </span>
          </div>
          <ArrowRightIcon class="signal-color size-4 shrink-0" />
          <div class="flex w-14 flex-col items-center gap-0.5">
            <img
              src={sellExchange.logo}
              alt={sellExchange.name}
              loading="lazy"
              class="size-6 rounded-box bg-base-200 object-contain p-0.5"
            />
            <span class="truncate text-[0.625rem] opacity-70" safe>
              {sellExchange.name}
            </span>
          </div>
        </div>

        <dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-2 text-xs">
          <dt class="opacity-60">Buy volume</dt>
          <dd class="text-right tabular-nums">{formatCompact(buyVolume)}</dd>
          <dt class="opacity-60">Sell volume</dt>
          <dd class="text-right tabular-nums">{formatCompact(sellVolume)}</dd>
        </dl>
      </div>
    </article>
  );
};
