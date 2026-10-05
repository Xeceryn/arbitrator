import type { OpportunitySignal } from "@arbitrator/lister/types";

import {
  formatCompact,
  formatPrice,
  formatProfitPercentage,
} from "../../utils";
import { signalColorClass, signalPairLabel } from "./signal";

type Props = {
  signal: OpportunitySignal;
};

/** One arbitrage signal as a table row. Mirrors the card's information. */
export const SignalTableRow = ({ signal }: Props) => {
  const {
    cmcId,
    coin,
    buyExchange,
    sellExchange,
    buyExchangeSymbol,
    sellExchangeSymbol,
    buyPrice,
    sellPrice,
    profitPercentage,
    profitVolume,
  } = signal;

  return (
    <tr
      id={`signal-row-${cmcId}-${buyExchange.id}-${sellExchange.id}`}
      class={signalColorClass(
        buyExchange.baseCurrency,
        sellExchange.baseCurrency,
      )}
    >
      <td>
        <div class="flex items-center gap-2 sm:gap-3">
          <div class="avatar">
            <div class="mask mask-circle size-7 bg-base-200 sm:size-8">
              <img src={coin.logo} alt="" loading="lazy" />
            </div>
          </div>
          <div class="min-w-0">
            <div class="truncate font-medium" safe>
              {coin.symbol}
            </div>
            <div class="truncate text-xs opacity-60" safe>
              {coin.name}
            </div>
          </div>
        </div>
      </td>
      <td class="hidden lg:table-cell">
        <span class="font-mono text-xs opacity-60">ID {cmcId}</span>
      </td>
      <td>
        <div class="flex items-center gap-2">
          <img
            src={buyExchange.logo}
            alt=""
            loading="lazy"
            class="size-6 rounded-box bg-base-200 object-contain p-0.5"
          />
          <div class="min-w-0">
            <div class="truncate text-sm font-medium" safe>
              {buyExchange.name}
            </div>
            <div
              class="truncate font-mono text-xs opacity-60"
              title={buyExchangeSymbol}
              safe
            >
              {buyExchangeSymbol}
            </div>
          </div>
        </div>
      </td>
      <td>
        <div class="flex items-center gap-2">
          <img
            src={sellExchange.logo}
            alt=""
            loading="lazy"
            class="size-6 rounded-box bg-base-200 object-contain p-0.5"
          />
          <div class="min-w-0">
            <div class="truncate text-sm font-medium" safe>
              {sellExchange.name}
            </div>
            <div
              class="truncate font-mono text-xs opacity-60"
              title={sellExchangeSymbol}
              safe
            >
              {sellExchangeSymbol}
            </div>
          </div>
        </div>
      </td>
      <td class="hidden text-right tabular-nums md:table-cell">
        {formatPrice(buyPrice)}
      </td>
      <td class="hidden text-right tabular-nums md:table-cell">
        {formatPrice(sellPrice)}
      </td>
      <td class="text-right">
        <span class="signal-color font-semibold tabular-nums">
          {formatProfitPercentage(profitPercentage)}
        </span>
      </td>
      <td class="text-right tabular-nums">{formatCompact(profitVolume)}</td>
      <td class="hidden xl:table-cell">
        <span class="badge badge-outline badge-sm signal-color signal-ring">
          {signalPairLabel(buyExchange.baseCurrency, sellExchange.baseCurrency)}
        </span>
      </td>
    </tr>
  );
};
