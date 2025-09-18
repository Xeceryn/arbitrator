import { capitalizeFirstLetter } from "../../utils";
import { CoinTableRow } from "../components/CoinTableRow";
import { AddCoinModal } from "../components/AddCoinModal";
import { listerClient } from "@arbitrator/sdk";
import type { ListCryptocurrencyInput } from "@arbitrator/lister/schemas";

export const CoinPageFilterItem = (props: { option: string, value: string, active: boolean }) => {
	return (
		<option
			value={props.value}
			selected={props.active}
			safe>{capitalizeFirstLetter(props.option)}</option>
	);
}

export const CoinPage = async (props: ListCryptocurrencyInput) => {
	const [error, data] = await listerClient.cryptocurrency.list(props);
	if (!data || error) {
		return <div>Failed to fetch coins</div>;
	}

	const searchBy_options = [
		{ name: "Name", value: "name" },
		{ name: "Symbol", value: "symbol" },
		{ name: "Slug", value: "slug" },
	];
	const active = searchBy_options.find((option) => option.value === props.searchBy);
	const limit_options = [10, 20, 50, 100];
	const active_limit = limit_options.find((option) => option === props.limit);

	return (
		<>
			<main class="flex-1 overflow-y-auto md:pt-4 pt-4 px-12  bg-base-200">
				<AddCoinModal />
				<div
					class="card w-full p-6 bg-base-100 shadow-xl mt-2">

					<div class="flex w-full justify-end">
						<div class="divider divider-horizontal "></div>
						<div>
							Showing {data.meta.from} to {data.meta.to} of {data.meta.items} entries
							<select
								name="limit"
								hx-get={`/coins?limit=${props.limit}`}
								hx-trigger="change"
								hx-swap="outerHTML"
								hx-target="closest main"
								class="select select-bordered join-item"
							>
								<option disabled value="">Limit</option>
								{
									limit_options.map((option) => (
										<option
											value={option.toString()}
											{...(active_limit === option ? { selected: true } : {})}
										>{option}</option>
									))
								}
							</select>
						</div>

						<div class="divider divider-horizontal "></div>

						<div id="coin-page-filter">
							<div class="join"
								hx-trigger="click"
								hx-include="[name=searchBy], [name=search]"
								hx-target="closest main"
								hx-swap="outerHTML"
							>
								<button
									{...data.meta.currentPage === 1 ? { disabled: true } : {}}
									class="join-item btn btn-outline"
									hx-get={`/coins?page=${1}`}
								>First</button>
								<button
									{...data.meta.hasPreviousPage ? {} : { disabled: true }}
									class="join-item btn btn-outline"
									hx-get={`/coins?page=${data.meta.currentPage - 1}`}
								>Previous</button>
								<button name="page" class="join-item btn btn-outline">Page {data.meta.currentPage}</button>
								<button
									{...data.meta.hasNextPage ? {} : { disabled: true }}
									class="join-item btn btn-outline"
									hx-get={`/coins?page=${data.meta.currentPage + 1}`}
								>Next</button>
								<button
									{...data.meta.currentPage === data.meta.pages ? { disabled: true } : {}}
									hx-get={`/coins?page=${data.meta.pages}`}
									hx-trigger="click"
									hx-include="[name=searchBy], [name=search]"
									hx-target="closest main"
									hx-swap="outerHTML"
									class="join-item btn btn-outline"
								>Last</button>
							</div>
						</div>

						<div class="divider divider-horizontal"></div>

						<div class="join">
							<div>
								<div>
									<input
										name="search"
										class="input input-bordered join-item"
										placeholder={props.search ? props.search : "Search"}
										value={props.search ? props.search : ""}
										hx-get="/coins/list?page=1"
										hx-include="[name=searchBy]"
										hx-trigger="keyup changed delay:10ms"
										hx-swap="innerHTML"
										hx-target="#coin-table-body"
									/>
								</div>
							</div>

							<select
								name="searchBy"
								hx-get="/coins/list?page=1"
								hx-include="[name=search]"
								hx-trigger="change"
								hx-swap="innerHTML"
								hx-target="#coin-table-body"
								class="select select-bordered join-item"
							>
								<option disabled value="">Search By</option>
								{searchBy_options.map((option) => (
									<option
										safe
										value={option.value}
										{...(active?.value === option.value ? { selected: true } : {})}
									>{capitalizeFirstLetter(option.name)}</option>
								))}
							</select>
						</div>

						<div class="divider divider-horizontal "></div>

						<div class="join">
							<button
								class="btn btn-outline"
								onclick="add_coin_modal.showModal()">Add New</button>
						</div>
					</div>



					<div class="divider mt-4"></div>

					<div class="h-full w-full pb-6 bg-base-100">
						<div class="overflow-x-auto w-full">
							<table class="table w-full table-pin-rows table-pin-cols">
								<thead>
									<tr>
										<th class={"w-1/4"}>Name / Slug</th>
										<th class={"w-1/8"}>Symbol</th>
										<th class={"w-1/8"}>CMC ID</th>
										<th>Created At</th>
										<th>Updated At</th>
										<th></th>
									</tr>
								</thead>
								<tbody
									id="coin-table-body"
								// hx-target="this"
								// hx-trigger="load"
								// hx-get="/coins/list"
								// hx-params="*"
								// hx-swap="innerHTML transition:true"
								>
									{
										data.data.map((coin) => (
											<CoinTableRow
												{...coin}
											/>
										))
									}
								</tbody>
							</table>
						</div>
					</div>

				</div>

				<div class="h-20"></div>
			</main >
		</>
	);
}
