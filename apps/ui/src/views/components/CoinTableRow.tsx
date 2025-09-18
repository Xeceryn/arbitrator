import { dateFormatter } from "../../utils";
import { type Cryptocurrency } from "@arbitrator/lister/types";

export const CoinTableRow = (props: Cryptocurrency) => {
	const logoUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${props.cmcId}.png`;
	return (
		<tr id={`coin-table-row-${props.id}`} class="">
			<td>
				<div class="flex items-center space-x-3">
					<div class="avatar">
						<div class="mask mask-circle w-12 h-12">
							<img src={logoUrl} alt="coin logo" />
						</div>
					</div>
					<div>
						<div safe class="font-bold">{props.name}</div>
						<div safe class="text-sm opacity-50">{props.slug}</div>
					</div>
				</div>
			</td>
			<td safe>{props.symbol.toUpperCase()}</td>
			<td>{props.cmcId}</td>
			<td class="px-6 py-4" safe>
				{props.createdAt.toLocaleTimeString() + " " + props.createdAt.toLocaleDateString()}
			</td>
			<td class="px-6 py-4">
				{props.updatedAt ? dateFormatter.format(new Date(props.updatedAt)) : "Empty"}
			</td>
			<td class="px-6 py-4">
				<button class="btn btn-square btn-outline btn-error">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
				</button>
				<button
					hx-get={`/coins/${props.id}/edit`}
					hx-trigger="click"
					hx-target={`#coin-table-row-${props.id}`}
					hx-swap="outerHTML"
					class="btn btn-square btn-outline"
				>
					<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide w-5 lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
				</button>
			</td>
		</tr>
	)
}
