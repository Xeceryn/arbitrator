import type { ExchangeSelect } from "@arbitrator/lister/types";

import { dateFormatter, getElapsedTime } from "../../utils";

export function MarketTableRow(props: ExchangeSelect) {
	return (
		<tr id={`market-table-row-${props.id}`} class="">
			<td>
				<div class="flex items-center space-x-3">
					<div class="avatar">
						<div class="mask mask-squircle w-12 h-12">
							<img src={props.logo} alt="market logo" />
						</div>
					</div>
					<div>
						<div safe class="font-bold">{props.name}</div>
						<div safe class="text-sm opacity-50">{props.slug}</div>
					</div>
				</div>
			</td>
			<td>{props.cmcId}</td>
			{
				// <td safe>{props.description}</td>
			}
			<td safe >
				{getElapsedTime(new Date(props.createdAt))}
			</td>
			<td >
				{props.updatedAt ? dateFormatter.format(new Date(props.updatedAt)) : "Empty"}
			</td>
			<td >
				<button class="btn btn-square btn-ghost">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
				</button>
				<button class="btn btn-primary">
					<i data-lucide="pencil" ></i>
					a
				</button>

				<button
					hx-get={`/markets/${props.id}/edit`}
					hx-trigger="click"
					hx-target={`#market-table-row-${props.id}`}
					hx-swap="outerHTML"
				>Edit</button>
			</td>
		</tr>
	)
}
