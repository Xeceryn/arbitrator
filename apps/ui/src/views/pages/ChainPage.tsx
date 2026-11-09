import { ChainSearchByOptions } from "@arbitrator/lister/constants";
import type { ListChainInput } from "@arbitrator/lister/types";

/** Elysia fills every pagination default before the handler runs. */
type Resolved<T> = { [K in keyof T]-?: NonNullable<T[K]> };
import { lister } from "@arbitrator/sdk";

import { apiErrorMessage, fieldLabel } from "../../utils";
import { AddChainModal } from "../components/AddChainModal";
import { ChainEditModal } from "../components/ChainEditModal";
import { ChainTableRow } from "../components/ChainTableRow";
import { PlusIcon, SearchIcon } from "../components/icons";
import { PageButton } from "../components/PageButton";
import { SortableHeader } from "../components/SortableHeader";

const LIMIT_OPTIONS = [10, 20, 50, 100];

/**
 * The filter bar is static chrome: a list request never re-renders it, so the
 * search input keeps its focus and caret. It submits itself into
 * `#chain-list-results`.
 */
const ChainFilter = (props: Resolved<ListChainInput>) => {
    const active = ChainSearchByOptions.find(
        (option) => option === props.searchBy,
    );

    return (
        <form
            id="chain-filter"
            hx-get="/chain/list"
            hx-target="#chain-list-results"
            hx-swap="outerMorph"
            hx-trigger="submit, input delay:300ms, chain-deleted from:body"
            hx-sync="this:replace"
            hx-indicator="#chain-list-indicator"
            class="relative flex flex-wrap items-center gap-3"
        >
            <span
                id="chain-list-indicator"
                class="htmx-indicator loading loading-spinner loading-xs absolute -right-2 -top-2"
            ></span>

            <div class="join min-w-0 w-full sm:w-auto sm:flex-1">
                <label class="input join-item min-w-0 flex-1">
                    <span class="sr-only">Search chains</span>
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
                        {ChainSearchByOptions.map((option) => (
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
                onclick="add_chain_modal.showModal()"
            >
                <PlusIcon /> Add chain
            </button>
        </form>
    );
};

/**
 * The results are the only swap unit. `GET /chain/list` returns exactly this
 * `<div id="chain-list-results">`.
 *
 * The hidden sort inputs live here rather than in the static filter form, so
 * they are refreshed whenever the results are. The native `form` attribute
 * keeps them associated with `#chain-filter`, so search and pagination still
 * carry the sort.
 */
export const ChainResults = async (props: Resolved<ListChainInput>) => {
    const { data, error } = await lister.chain.get({ query: props });

    if (error || !data) {
        const message = apiErrorMessage(error);
        return (
            <div id="chain-list-results" class="flex flex-col gap-2">
                <div class="alert alert-error" role="alert">
                    <span>Unable to load chains.</span>
                    {message ? <span safe>{message}</span> : null}
                </div>
            </div>
        );
    }

    const hasRows = data.data.length > 0;

    return (
        <div id="chain-list-results" class="flex flex-col gap-2">
            <input
                type="hidden"
                form="chain-filter"
                name="orderBy"
                value={props.orderBy}
            />
            <input
                type="hidden"
                form="chain-filter"
                name="order"
                value={props.order}
            />

            <div class="overflow-x-auto w-full">
                <table class="table w-full table-pin-rows table-pin-cols [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4">
                    <thead>
                        <tr>
                            <SortableHeader
                                form="chain-filter"
                                url="/chain/list"
                                target="#chain-list-results"
                                indicator="#chain-list-indicator"
                                field="name"
                                name="Name"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="w-1/2 whitespace-normal"
                            >
                                Name
                            </SortableHeader>
                            <SortableHeader
                                form="chain-filter"
                                url="/chain/list"
                                target="#chain-list-results"
                                indicator="#chain-list-indicator"
                                field="code"
                                name="Code"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden w-24 sm:table-cell"
                            >
                                Code
                            </SortableHeader>
                            <SortableHeader
                                form="chain-filter"
                                url="/chain/list"
                                target="#chain-list-results"
                                indicator="#chain-list-indicator"
                                field="createdAt"
                                name="Created At"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden md:table-cell"
                            >
                                Created
                            </SortableHeader>
                            <SortableHeader
                                form="chain-filter"
                                url="/chain/list"
                                target="#chain-list-results"
                                indicator="#chain-list-indicator"
                                field="updatedAt"
                                name="Updated At"
                                orderBy={props.orderBy}
                                order={props.order}
                                class="hidden md:table-cell"
                            >
                                Updated
                            </SortableHeader>
                            <th class="w-20 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="chain-table-body">
                        {hasRows ? (
                            data.data.map((chain) => (
                                <ChainTableRow {...chain} />
                            ))
                        ) : (
                            <tr id="chain-table-empty">
                                <td colspan="5" class="py-16 text-center">
                                    <p class="font-medium">
                                        {props.search
                                            ? "No matching chains"
                                            : "No chains yet"}
                                    </p>
                                    {props.search ? (
                                        <button
                                            type="button"
                                            class="btn btn-sm mt-4"
                                            hx-get="/chain/list"
                                            hx-include="#chain-filter"
                                            hx-vals='{"search":""}'
                                            hx-target="#chain-list-results"
                                            hx-swap="outerMorph"
                                            hx-on:click="document.querySelector('#chain-filter [name=search]').value=''"
                                        >
                                            Clear search
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            class="btn btn-primary mt-4"
                                            onclick="add_chain_modal.showModal()"
                                        >
                                            <PlusIcon /> Add chain
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
                        chains
                    </p>
                    <div class="join">
                        <PageButton
                            form="chain-filter"
                            page={1}
                            edge
                            disabled={data.meta.page === 1}
                        >
                            First
                        </PageButton>
                        <PageButton
                            form="chain-filter"
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
                            form="chain-filter"
                            page={data.meta.page + 1}
                            disabled={!data.meta.hasNextPage}
                        >
                            Next
                        </PageButton>
                        <PageButton
                            form="chain-filter"
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
export const ChainList = (props: Resolved<ListChainInput>) => (
    <section id="chain-list" class="w-full">
        <div class="card w-full bg-base-100 shadow-sm">
            <div class="card-body gap-5 p-3 sm:p-6">
                <ChainFilter {...props} />
                <ChainResults {...props} />
            </div>
        </div>
    </section>
);

export const ChainPage = async (props: Resolved<ListChainInput>) => (
    <div class="flex flex-col gap-6">
        <AddChainModal />
        <ChainEditModal />
        <ChainList {...props} />
    </div>
);
