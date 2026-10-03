import { CurrencyFormatter } from "../../helpers/currency-formatter.helper";

type SignalDetail = {
  exchange: string;
  price: number;
  amount: number;
  symbol: string;
  exchangeType: string;
  logo: string;
};

type Signal = {
  buy: SignalDetail;
  sell: SignalDetail;
  profitAmount: number;
  profitPercentage: number;
  info: string;
};

const sample: Signal[] = [
  // generate sample data
  {
    buy: {
      exchange: "Indodax",
      exchangeType: "Local",
      price: 0.0000001,
      amount: 1000,
      symbol: "PEPE",
      logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/68.png",
    },
    sell: {
      exchange: "Kucoin",
      exchangeType: "USDT",
      price: 0.0000002,
      amount: 1400,
      symbol: "PEPE",
      logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/2087.png",
    },
    profitAmount: 100,
    profitPercentage: 100,
    info: "This is a sample signal",
  },
];

export const SignalCard = (signal: Signal) => {
  return (
    <>
      {
        // copilot, please generate the card
      }
      <div class="card shadow-xl bg-base-100 m-5">
        <div class="card-body items-center text-center">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <img src={signal.buy.logo} class="w-10 h-10 rounded-full" />
              <div>
                <h2 class="text-xl font-semibold" safe>
                  {signal.buy.symbol}
                </h2>
                <p class="text-sm text-gray-600" safe>
                  {signal.buy.exchange}
                </p>
              </div>
            </div>
            <div>
              <p class="text-xl font-semibold" safe>
                {CurrencyFormatter.formatPrice(signal.buy.price)}
              </p>
              <p class="text-sm text-gray-600" safe>
                {CurrencyFormatter.formatAmount(signal.buy.amount)}
              </p>
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <div class="flex items center space-x-4">
              <img src={signal.sell.logo} class="w-10 h-10 rounded-full" />
              <div>
                <h2 class="text-xl font-semibold" safe>
                  {signal.sell.symbol}
                </h2>
                <p class="text-sm text-gray-600" safe>
                  {signal.sell.exchange}
                </p>
              </div>
            </div>
            <div>
              <p class="text-xl font-semibold">{signal.sell.price}</p>
              <p class="text-sm text-gray-600">{signal.sell.amount} </p>
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <div>
              <p class="text-lg font-semibold">
                Profit: ${signal.profitAmount}
              </p>
              <p class="text-sm text-gray-600">
                Profit: {signal.profitPercentage}%
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600" safe>
                {signal.info}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Signal = () => {
  return (
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {sample.map((signal) => (
        <SignalCard {...signal} />
      ))}
    </div>
  );
};
