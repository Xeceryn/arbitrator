import { listerClient } from '@arbitrator/sdk';

type CoinAssignmentTableRowProps = {
	id: number;
	name: string;
	symbol: string;
	active: boolean | null;
	marketSymbol: string;
}

export const CoinAssignmentTableRow = (props: CoinAssignmentTableRowProps) => {
	// _="on click remove .bg-gray-600 from <tr.bg-gray-600/> then add .bg-gray-800 to <tr.border-b/> then add .bg-gray-600 then remove .bg-gray-800 "
	return (
		<tr
			class="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
			<td safe class="px-6 py-4">
				{props.name}
			</td>
			<td safe class="px-6 py-4">
				{props.symbol}
			</td>
			<td class="px-6 py-4">
				{props.active ? "Active" : "Inactive"}
			</td>
			<td class="px-6 py-4">
				{props.marketSymbol ? props.marketSymbol : "N/A"}
			</td>
		</tr>
	)
}

export const CoinAssignmentTable = async ({ id }: { id: number }) => {
	const [assignmentsError, assignmentsData] = await listerClient.exchangeCryptocurrency.list({
		exchangeId: id,
	})
	if (assignmentsError) {
		return <div>Failed to fetch coins</div>
	}

	return (
		<table id="coin-assignment-abble"
			_="on click remove .bg-gray-600 from <tr.bg-gray-600/> then add .bg-gray-800 to <tr.border-b/> then add .bg-gray-600 then remove .bg-gray-800 "
			class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
			<tbody>
				{
					data.map(x => {
						return (
							<CoinAssignmentTableRow {...x} />
						)
					})
				}
			</tbody>
		</table>
	)
}

