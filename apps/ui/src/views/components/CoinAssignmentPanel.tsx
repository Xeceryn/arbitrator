import type {
    CryptocurrencySelect,
    MarketWithRelations,
} from "@arbitrator/lister/types";

import { AssignExchangeDropdown } from "./AssignExchangeDropdown";
import { ExchangeAssignmentCard } from "./ExchangeAssignmentCard";

type ListProps = {
    coinId: number;
    markets: MarketWithRelations[];
};

/** The refreshable list of exchange assignments for a coin. */
export const CoinAssignmentList = ({ coinId, markets }: ListProps) => (
    <div id="coin-assignment-list" class="flex flex-col gap-3">
        {markets.length === 0 ? (
            <div class="rounded-box bg-base-100 p-6 text-center">
                <p class="text-sm font-medium">No exchanges assigned</p>
                <p class="mt-1 text-sm opacity-60">
                    Use the search above to assign this coin to an exchange.
                </p>
            </div>
        ) : (
            markets.map((market) => (
                <ExchangeAssignmentCard coinId={coinId} market={market} />
            ))
        )}
    </div>
);

type HeaderProps = {
    coin: CryptocurrencySelect;
    /** Set on the panel response to swap the modal title out-of-band. */
    oob?: boolean;
};

/**
 * The coin identity shown as the modal title. Rendered empty in `BaseLayout`
 * on page load and filled by an out-of-band swap when the panel is requested.
 */
export const CoinAssignmentHeader = ({ coin, oob }: HeaderProps) => (
    <div
        id="coin_assignment_header"
        class="flex min-w-0 flex-1 items-center gap-3"
        {...(oob ? { "hx-swap-oob": "true" } : {})}
    >
        <div class="avatar">
            <div class="mask mask-circle size-10">
                <img src={coin.logo} alt="" loading="lazy" />
            </div>
        </div>
        <div class="min-w-0 flex-1">
            <h2 class="truncate text-lg font-semibold" safe>
                {coin.name}
            </h2>
            <p class="truncate text-sm opacity-60" safe>
                {coin.symbol.toUpperCase()} · {coin.slug}
            </p>
        </div>
    </div>
);

type Props = {
    coin: CryptocurrencySelect;
    markets: MarketWithRelations[];
};

/** The scrollable body of the assignment modal. */
export const CoinAssignmentPanel = ({ coin, markets }: Props) => (
    <div class="flex flex-col gap-4">
        <section class="rounded-box bg-base-200 p-4">
            <h3 class="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">
                Assign to exchange
            </h3>
            <AssignExchangeDropdown coinId={coin.id} />
        </section>

        <section class="flex flex-col gap-3 rounded-box bg-base-300/40 p-4">
            <h3 class="text-xs font-semibold tracking-wide uppercase opacity-60">
                Assigned exchanges
            </h3>
            <CoinAssignmentList coinId={coin.id} markets={markets} />
        </section>
    </div>
);
