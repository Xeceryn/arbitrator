import type {
    CryptocurrencySelect,
    MarketWithRelations,
} from "@arbitrator/lister/types";

import { ExchangeAssignmentCard } from "./ExchangeAssignmentCard";
import { PlusIcon } from "./icons";

type ListProps = {
    coinId: number;
    markets: MarketWithRelations[];
};

/**
 * The stable list of exchange assignment cards. Writes append to this element
 * (or morph a single card); the whole list is only rendered on first load.
 */
export const CoinAssignmentList = ({ coinId, markets }: ListProps) => (
    <div id="coin-assignment-list" class="flex flex-col gap-3">
        {markets.map((market) => (
            <ExchangeAssignmentCard coinId={coinId} market={market} />
        ))}
    </div>
);

/**
 * Stable empty state, always present as a sibling of the list so a partial can
 * morph it after any mutation. `hidden` keeps it truthful without deleting the
 * target.
 */
export const CoinAssignmentEmpty = ({ hidden }: { hidden: boolean }) => (
    <div
        id="coin-assignment-empty"
        hidden={hidden}
        class="rounded-box bg-base-100 p-6 text-center"
    >
        <p class="text-sm font-medium">No exchanges assigned</p>
        <p class="mt-1 text-sm opacity-60">
            Use Add exchange to assign this coin to an exchange.
        </p>
    </div>
);

type HeaderProps = {
    coin: CryptocurrencySelect;
};

/**
 * The coin identity shown as the modal title. Rendered empty in `BaseLayout`
 * on page load and filled by a partial when the panel is requested.
 */
export const CoinAssignmentHeader = ({ coin }: HeaderProps) => (
    <div
        id="coin_assignment_header"
        class="flex min-w-0 flex-1 items-center gap-3"
    >
        <div class="avatar">
            <div class="mask mask-circle size-10">
                <img src={coin.logo} alt="" loading="lazy" />
            </div>
        </div>
        <div class="min-w-0 flex-1">
            <h2 class="truncate text-lg font-semibold">{coin.name}</h2>
            <p class="truncate text-sm opacity-60">
                {coin.symbol.toUpperCase()} · {coin.slug}
            </p>
        </div>
    </div>
);

type Props = {
    coin: CryptocurrencySelect;
    markets: MarketWithRelations[];
};

/**
 * The scrollable body of the assignment modal. The staged add flow lives in
 * `#assignment-staging`; the assignment cards and their empty state are
 * siblings below so each region can be updated on its own.
 */
export const CoinAssignmentPanel = ({ coin, markets }: Props) => (
    <div class="flex flex-col gap-4">
        <section class="rounded-box bg-base-200 p-4">
            <div class="flex items-center justify-between gap-2">
                <h3 class="text-xs font-semibold tracking-wide uppercase opacity-60">
                    Assign to exchange
                </h3>
                <button
                    type="button"
                    id="add-exchange-button"
                    class="btn btn-ghost btn-xs"
                    aria-expanded="false"
                    aria-controls="assignment-staging"
                    hx-get={`/coins/${coin.id}/assignment/new`}
                    hx-target="#assignment-staging"
                    hx-swap="innerHTML"
                    hx-indicator="#coin-assignment-indicator"
                    hx-on:click="this.setAttribute('aria-expanded','true')"
                >
                    <PlusIcon />
                    Add exchange
                </button>
            </div>
            {/* Empty by default: step 1 / step 2 render here on demand. */}
            <div id="assignment-staging" class="mt-3"></div>
        </section>

        <section class="flex flex-col gap-3 rounded-box bg-base-300/40 p-4">
            <h3 class="text-xs font-semibold tracking-wide uppercase opacity-60">
                Assigned exchanges
            </h3>
            <CoinAssignmentList coinId={coin.id} markets={markets} />
            <CoinAssignmentEmpty hidden={markets.length > 0} />
        </section>
    </div>
);
