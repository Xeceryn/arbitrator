import type {
  CryptocurrencyRouteEndpoint,
  CryptocurrencyRoutes,
  CryptocurrencySelect,
} from "@arbitrator/lister/types";

import { CheckIcon, XIcon } from "./icons";

/** Small trade on/off dot, with a text alternative for screen readers. */
const TradeDot = ({ tradeEnabled }: { tradeEnabled: boolean }) => (
  <span
    class={`inline-block size-1.5 shrink-0 rounded-full ${
      tradeEnabled ? "bg-success" : "bg-base-content/30"
    }`}
    title={tradeEnabled ? "Trading enabled" : "Trading disabled"}
  >
    <span class="sr-only">
      {tradeEnabled ? "trading enabled" : "trading disabled"}
    </span>
  </span>
);

const ExchangeLabel = ({
  endpoint,
  center = false,
}: {
  endpoint: CryptocurrencyRouteEndpoint;
  center?: boolean;
}) => (
  <div class={`flex items-center gap-1.5 ${center ? "justify-center" : ""}`}>
    <div class="avatar">
      <div class="mask mask-circle size-5">
        <img src={endpoint.exchange.logo} alt="" loading="lazy" />
      </div>
    </div>
    <div class="flex min-w-0 items-center gap-1">
      <span
        class="max-w-20 truncate text-xs font-medium"
        title={endpoint.exchange.name}
        safe
      >
        {endpoint.exchange.name}
      </span>
      <TradeDot tradeEnabled={endpoint.tradeEnabled} />
    </div>
  </div>
);

const CornerLabel = () => (
  <span class="text-[10px] font-normal tracking-wide uppercase opacity-50">
    From \ To
  </span>
);

type CellProps = {
  chains?: string[];
  from: string;
  to: string;
};

/**
 * One matrix cell. The check/cross icon is the static cue; the chain list is
 * exposed on hover and to screen readers.
 */
const RouteCell = ({ chains, from, to }: CellProps) => {
  const hasRoute = chains !== undefined && chains.length > 0;

  return hasRoute ? (
    <span
      class="inline-flex items-center justify-center gap-1 text-success"
      title={`${from} → ${to} via ${chains.join(", ")}`}
    >
      <CheckIcon />
      {chains.length > 1 ? (
        <span class="text-[10px] tabular-nums opacity-70">{chains.length}</span>
      ) : null}
      <span class="sr-only">via {chains.join(", ")}</span>
    </span>
  ) : (
    <span
      class="inline-flex items-center justify-center text-base-content/25"
      title={`${from} → ${to}: no shared chain`}
    >
      <XIcon />
      <span class="sr-only">no route</span>
    </span>
  );
};

/** Shown when a matrix cannot say anything useful (< 2 exchanges). */
const PanelNotice = ({
  exchanges,
}: {
  exchanges: CryptocurrencyRouteEndpoint[];
}) =>
  exchanges.length === 0 ? (
    <div class="rounded-box bg-base-200 p-8 text-center">
      <p class="font-medium">No exchanges assigned</p>
      <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
        Assign this coin to exchanges and link chains before transfer routes can
        be shown.
      </p>
    </div>
  ) : (
    <div class="rounded-box bg-base-200 p-8 text-center">
      <p class="font-medium">Only one exchange assigned</p>
      <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
        A transfer route needs two exchanges. Assign this coin to another
        exchange to compare routes.
      </p>
    </div>
  );

type PanelProps = {
  data: CryptocurrencyRoutes;
};

/** The scrollable body of the transfer-route modal: an exchange matrix. */
export const CoinRoutePanel = ({ data }: PanelProps) => {
  const { exchanges, routes } = data;

  if (exchanges.length < 2) {
    return <PanelNotice exchanges={exchanges} />;
  }

  // from marketId -> to marketId -> the chains that connect them.
  const byFrom = new Map<number, Map<number, string[]>>();
  for (const route of routes) {
    let row = byFrom.get(route.from.marketId);
    if (!row) {
      row = new Map();
      byFrom.set(route.from.marketId, row);
    }
    const chains = row.get(route.to.marketId) ?? [];
    if (!chains.includes(route.chain.name)) {
      chains.push(route.chain.name);
    }
    row.set(route.to.marketId, chains);
  }

  return (
    <div class="flex flex-col gap-3">
      <p class="text-sm opacity-60">
        Rows withdraw, columns deposit.{" "}
        <span class="tabular-nums" safe>
          {routes.length}
        </span>{" "}
        route{routes.length === 1 ? "" : "s"} across{" "}
        <span class="tabular-nums" safe>
          {exchanges.length}
        </span>{" "}
        exchanges.
      </p>

      {/* Single scroll container so the sticky header and first column pin
          against the same axis, however many exchanges there are. */}
      <div class="max-h-[65vh] overflow-auto rounded-box border border-base-300">
        <table class="table table-sm table-pin-rows [&_td]:px-1.5 [&_th]:px-1.5 [&_thead]:z-30">
          <thead>
            <tr>
              <th class="sticky left-0 z-20 border-r border-base-300 bg-base-100">
                <CornerLabel />
              </th>
              {exchanges.map((to) => (
                <th class="bg-base-100 text-center">
                  <ExchangeLabel endpoint={to} center />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exchanges.map((from) => (
              <tr class="hover:bg-base-200/60">
                <th
                  scope="row"
                  class="sticky left-0 z-10 border-r border-base-300 bg-base-100"
                >
                  <ExchangeLabel endpoint={from} />
                </th>
                {exchanges.map((to) =>
                  from.marketId === to.marketId ? (
                    <td class="text-center">
                      <span aria-hidden="true" class="text-base-content/20">
                        –
                      </span>
                      <span class="sr-only">same exchange</span>
                    </td>
                  ) : (
                    <td class="text-center">
                      <RouteCell
                        chains={byFrom.get(from.marketId)?.get(to.marketId)}
                        from={from.exchange.name}
                        to={to.exchange.name}
                      />
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type HeaderProps = {
  coin: CryptocurrencySelect;
  /** Set on the panel response to swap the modal title out-of-band. */
  oob?: boolean;
};

/** The coin identity shown as the route modal title. */
export const CoinRouteHeader = ({ coin, oob }: HeaderProps) => (
  <div
    id="coin_route_header"
    class="flex min-w-0 flex-1 items-center gap-3"
    {...(oob ? { "hx-swap-oob": "true" } : {})}
  >
    <div class="avatar">
      <div class="mask mask-circle size-10">
        <img src={coin.logo} alt="" loading="lazy" />
      </div>
    </div>
    <div class="min-w-0 flex-1">
      <h2 id="coin-route-title" class="truncate text-lg font-semibold" safe>
        {coin.name}
      </h2>
      <p class="truncate text-sm opacity-60" safe>
        {coin.symbol.toUpperCase()} · Transfer routes
      </p>
    </div>
  </div>
);
