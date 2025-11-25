import { Html } from "@elysiajs/html";
import { LolocoClient } from "@e9crypt/loloco";

type MarketAssignmentTableRowProps = {
  id: number;
  name: string;
  logoUrl: string;
};

export const MarketAssignmentTableRow = (
  props: MarketAssignmentTableRowProps,
) => {
  return (
    <tr
      hx-get={`assignments/market/${props.id}/coin`}
      hx-target="#coin-assignment-table"
      hx-swap="outerHTML transition:true"
      _="on click remove .bg-gray-600 from <tr.bg-gray-600/> then add .bg-gray-800 to <tr.border-b/> then add .bg-gray-600 then remove .bg-gray-800 "
      class="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
    >
      <td class="px-6 py-4">
        <img alt="logo" src={props.logoUrl} class="w-5 h-5 " />
      </td>
      <td safe class="px-6 py-4">
        {props.name}
      </td>
    </tr>
  );
};

export const MarketAssignmentTable = async () => {
  const { error, data } = await LolocoClient.markets.get({ query: {} });
  if (error) {
    return <div>Failed to fetch markets</div>;
  }
  return (
    <div
      class="relative overflow-x-auto shadow-md sm:rounded-lg"
      style={"width: 100%; height: 100%;"}
    >
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="px-6 py-3">
              Logo
            </th>
            <th scope="col" class="px-6 py-3">
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((market) => (
            <MarketAssignmentTableRow {...market} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
