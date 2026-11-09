import type {
    CryptocurrencySelect,
    MarketWithRelations,
} from "@arbitrator/lister/types";

import { AssignmentDialog } from "./AssignmentDialog";
import { ExchangeAssignmentCard } from "./ExchangeAssignmentCard";
import { PlusIcon, SearchIcon } from "./icons";

export const CoinAssignmentList = ({
    coinId,
    markets,
}: {
    coinId: number;
    markets: MarketWithRelations[];
}) => (
    <table id="coin-assignment-list" class="table block w-full sm:table">
        <caption class="sr-only">
            Exchange assignments, trading settings, and linked chains
        </caption>
        <thead class="hidden sm:table-header-group">
            <tr>
                <th scope="col">Exchange</th>
                <th scope="col" class="hidden sm:table-cell">
                    Symbol
                </th>
                <th scope="col" class="w-16 md:w-28">
                    Trading
                </th>
                <th scope="col" class="w-20 text-right sm:w-40">
                    Chains
                </th>
                <th scope="col" class="w-10">
                    <span class="sr-only">Actions</span>
                </th>
            </tr>
        </thead>
        {markets.map((market) => (
            <ExchangeAssignmentCard coinId={coinId} market={market} />
        ))}
    </table>
);

/** The target remains present even after the last assignment is removed. */
export const CoinAssignmentEmpty = ({ hidden }: { hidden: boolean }) => (
    <div
        id="coin-assignment-empty"
        hidden={hidden}
        class="py-8 text-center text-sm"
    >
        No exchanges assigned
    </div>
);

export const CoinAssignmentPanel = ({
    coin,
    markets,
}: {
    coin: CryptocurrencySelect;
    markets: MarketWithRelations[];
}) => (
    <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <label class="input w-full sm:w-80">
                <span class="sr-only">Find an assigned exchange</span>
                <SearchIcon />
                <input
                    type="search"
                    id="assignment-filter"
                    placeholder="Find an assigned exchange"
                    autocomplete="off"
                />
            </label>
            <div class="ml-auto flex items-center gap-3">
                <span
                    id="coin-assignment-indicator"
                    class="htmx-indicator loading loading-spinner loading-sm"
                    aria-hidden="true"
                ></span>
                <button
                    type="button"
                    id="add-exchange-button"
                    class="btn btn-primary min-h-11"
                    aria-expanded="false"
                    aria-haspopup="dialog"
                    aria-controls="assign-exchange-dialog"
                    data-open-dialog="assign-exchange-dialog"
                    hx-get={`/coins/${coin.id}/assignment/new`}
                    hx-target="#assignment-staging"
                    hx-swap="innerHTML"
                    hx-indicator="#assignment-staging-indicator"
                >
                    <PlusIcon /> Assign exchange
                </button>
            </div>
        </div>
        <AssignmentDialog
            id="assign-exchange-dialog"
            contentId="assignment-staging"
            title="Assign exchange"
            context={`${coin.name} · ${coin.symbol.toUpperCase()}`}
        />
        <div class="overflow-x-auto rounded-box bg-base-100">
            <CoinAssignmentList coinId={coin.id} markets={markets} />
            <CoinAssignmentEmpty hidden={markets.length > 0} />
            <p
                id="assignment-no-match"
                hidden
                class="px-4 py-8 text-center text-sm"
            >
                No matching assignments. Try another exchange name or symbol.
            </p>
        </div>
    </div>
);
