import { ExchangeSearchByOptions } from "@arbitrator/lister/constants";
import type { ListExchangeInput } from "@arbitrator/lister/types";

/** Elysia fills every pagination default before the handler runs. */
type Resolved<T> = { [K in keyof T]-?: NonNullable<T[K]> };
import { lister } from "@arbitrator/sdk";

import { apiErrorMessage, fieldLabel } from "../../utils";
import { AddExchangeModal } from "../components/AddExchangeModal";
import { ExchangeEditModal } from "../components/ExchangeEditModal";
import { SearchIcon, PlusIcon } from "../components/icons";
import { MarketTableRow } from "../components/MarketTableRow";
import { PageButton } from "../components/PageButton";
import { SortableHeader } from "../components/SortableHeader";

const LIMIT_OPTIONS = [10, 20, 50, 100];

/**
 * The filter bar is static chrome: a list request never re-renders it, so the
 * search input keeps its focus and caret. It submits itself into
 * `#market-list-results`.
 */
const MarketFilter = (props: Resolved<ListExchangeInput>) => {
    const active = ExchangeSearchByOptions.find(
        (option) => option === props.searchBy,
    );

    return (
        <form
            id="market-filter"
            hx-get="/markets/list"
            hx-target="#market-list-results"
            hx-swap="outerMorph"
            hx-trigger="submit, input delay:300ms, exchange-deleted from:body"
            hx-sync="this:replace"
            hx-indicator="#market-list-indicator"
            class="relative flex flex-wrap items-center gap-3"
        >
            <span
                id="market-list-indicator"
                class="htmx-indicator loading loading-spinner loading-xs absolute -right-2 -top-2"
            ></span>

            <div class="join min-w-0 w-full sm:w-auto sm:flex-1">
                <label class="input join-item min-w-0 flex-1">
                    <span class="sr-only">Search exchanges</span>
                    <SearchIcon />
                    <input
                        type="search"
                        name="search"
                        value={props.search}
                        placeholder="Search"
                        autocomplete="off"
                    />
                </label>
                <label class="select join-item w-24 shrink-0 sm:w-36">
                    <span class="sr-only">Search by</span>
                    <select name="searchBy">
                        {ExchangeSearchByOptions.map((option) => (
                            <option value={option} selected={active === option}>
                                {fieldLabel(option)}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <label class="select w-24 shrink-0">
                <span class="sr-only">Rows per page</span>
                <select name="limit">
                    {LIMIT_OPTIONS.map((option) => (
                        <option
                            value={option.toString()}
                            selected={props.limit === option}
                        >
                            {option} rows
                        </option>
                    ))}
                </select>
            </label>

            {/* type=button so it never submits the filter form */}
            <button
                type="button"
                class="btn btn-primary ml-auto"
                onclick="add_exchange_modal.showModal()"
            >
                <PlusIcon /> Add exchange
            </button>
        </form>
    );
};

/**
 * The results are the only swap unit. `GET /markets/list` returns exactly this
 * `<div id="market-list-results">`.
 *
 * The hidden sort inputs live here rather than in the static filter form, so
 * they are refreshed whenever the results are. The native `form` attribute
 * keeps them associated with `#market-filter`, so search and pagination still
 * carry the sort.
 */
export const MarketResults = async (props: Resolved<ListExchangeInput>) => {
    const { data, error } = await lister.exchange.get({ query: props });

    if (error || !data) {
        const message = apiErrorMessage(error);
        return (
            <div id="market-list-results" class="flex flex-col gap-2">
                <div class="alert alert-error" role="alert">
                    <span>Unable to load exchanges.</span>
                    {message ? <span safe>{message}</span> : null}
                </div>
            </div>
        );
    }

    const hasRows = data.data.length > 0;

    return (
        <div id="market-list-results" class="flex flex-col gap-2">
            <input
                type="hidden"
                form="market-filter"
                name="orderBy"
                value={props.orderBy}
            />
            <input
                type="hidden"
                form="market-filter"
                name="order"
                value={props.order}
            />

            <div class="overflow-x-auto w-full">
                <table class="table w-full table-pin-rows table-pin-cols [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4">
                    <thead>
                        <tr>
                            <SortableHeader
                                form="market-filter"
                                url="/markets/list"
                                target="#market-list-results"
                                indicator="#market-list-indicator"
                                field="name"
                                name="Name"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="w-1/2 whitespace-normal"
                            >
                                Name
                            </SortableHeader>
                            <SortableHeader
                                form="market-filter"
                                url="/markets/list"
                                target="#market-list-results"
                                indicator="#market-list-indicator"
                                field="cmcId"
                                name="CMC ID"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden w-20 sm:table-cell"
                            >
                                CMC ID
                            </SortableHeader>
                            <SortableHeader
                                form="market-filter"
                                url="/markets/list"
                                target="#market-list-results"
                                indicator="#market-list-indicator"
                                field="baseCurrency"
                                name="Base"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden w-28 md:table-cell"
                            >
                                Base
                            </SortableHeader>
                            <SortableHeader
                                form="market-filter"
                                url="/markets/list"
                                target="#market-list-results"
                                indicator="#market-list-indicator"
                                field="registeredOnCmc"
                                name="Registered"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden w-28 md:table-cell"
                            >
                                Registered
                            </SortableHeader>
                            <SortableHeader
                                form="market-filter"
                                url="/markets/list"
                                target="#market-list-results"
                                indicator="#market-list-indicator"
                                field="createdAt"
                                name="Created At"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden lg:table-cell"
                            >
                                Created
                            </SortableHeader>
                            <SortableHeader
                                form="market-filter"
                                url="/markets/list"
                                target="#market-list-results"
                                indicator="#market-list-indicator"
                                field="updatedAt"
                                name="Updated At"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden lg:table-cell"
                            >
                                Updated
                            </SortableHeader>
                            <th class="w-20 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="market-table-body">
                        {hasRows ? (
                            data.data.map((exchange) => (
                                <MarketTableRow {...exchange} />
                            ))
                        ) : (
                            <tr id="market-table-empty">
                                <td colspan="7" class="py-16 text-center">
                                    <p class="font-medium">
                                        {props.search
                                            ? "No matching exchanges"
                                            : "No exchanges yet"}
                                    </p>
                                    {props.search ? (
                                        <button
                                            type="button"
                                            class="btn btn-sm mt-4"
                                            hx-get="/markets/list"
                                            hx-include="#market-filter"
                                            hx-vals='{"search":""}'
                                            hx-target="#market-list-results"
                                            hx-swap="outerMorph"
                                            hx-on:click="document.querySelector('#market-filter [name=search]').value=''"
                                        >
                                            Clear search
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            class="btn btn-primary mt-4"
                                            onclick="add_exchange_modal.showModal()"
                                        >
                                            <PlusIcon /> Add exchange
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {hasRows ? (
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <p class="text-sm opacity-70">
                        Showing{" "}
                        <span class="tabular-nums" safe>
                            {data.meta.from}
                        </span>{" "}
                        to{" "}
                        <span class="tabular-nums" safe>
                            {data.meta.to}
                        </span>{" "}
                        of{" "}
                        <span class="tabular-nums" safe>
                            {data.meta.items}
                        </span>{" "}
                        exchanges
                    </p>
                    <div class="join">
                        <PageButton
                            form="market-filter"
                            page={1}
                            edge
                            disabled={data.meta.page === 1}
                        >
                            First
                        </PageButton>
                        <PageButton
                            form="market-filter"
                            page={data.meta.page - 1}
                            disabled={!data.meta.hasPreviousPage}
                        >
                            Previous
                        </PageButton>
                        <button
                            type="button"
                            disabled
                            class="join-item btn btn-sm sm:btn-md"
                        >
                            Page{" "}
                            <span class="tabular-nums" safe>
                                {data.meta.page}
                            </span>
                        </button>
                        <PageButton
                            form="market-filter"
                            page={data.meta.page + 1}
                            disabled={!data.meta.hasNextPage}
                        >
                            Next
                        </PageButton>
                        <PageButton
                            form="market-filter"
                            page={data.meta.pages}
                            edge
                            disabled={
                                data.meta.page === data.meta.pages ||
                                data.meta.items === 0
                            }
                        >
                            Last
                        </PageButton>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

/**
 * The full list card: static filter bar plus swappable results.
 */
export const MarketList = (props: Resolved<ListExchangeInput>) => (
    <section id="market-list" class="w-full">
        <div class="card w-full bg-base-100 shadow-sm">
            <div class="card-body gap-5 p-3 sm:p-6">
                <MarketFilter {...props} />
                <MarketResults {...props} />
            </div>
        </div>
    </section>
);

export const MarketPage = async (props: Resolved<ListExchangeInput>) => (
    <div class="flex flex-col gap-6">
        <AddExchangeModal />
        <ExchangeEditModal />
        <MarketList {...props} />
    </div>
);
