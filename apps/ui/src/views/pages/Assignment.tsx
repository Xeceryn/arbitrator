import { Html } from "@elysiajs/html"
import { MarketAssignmentTable } from "../components/MarketAssignmentTable"


export const Assignment = () => {
	return (
		<div id="table-container" class="flex justify-between" >
			<MarketAssignmentTable />

			<div class="relative overflow-x-auto shadow-md sm:rounded-lg" style={"width: 100%;"}>
				<table id="coin-assignment-table" class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
					<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
						<tr>
							<th scope="col" class="px-6 py-3">
								Name
							</th>
							<th scope="col" class="px-6 py-3">
								Symbol
							</th>
							<th scope="col" class="px-6 py-3">
								Status
							</th>
							<th scope="col" class="px-6 py-3">
								Alternate Symbol
							</th>
						</tr>
					</thead>
					<tbody >
					</tbody>
				</table>
			</div>

			<div class={"relative overflow-x-auto shadow-md sm:rounded-lg"} style={"width: 100%;"}>
				<table >
					<thead>
						<tr>
							<th>Header 3</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Row 7</td>
						</tr>
						<tr>
							<td>Row 8</td>
						</tr>
						<tr>
							<td>Row 9</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}
