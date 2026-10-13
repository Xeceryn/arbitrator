# Arbitrator

Glossary for the exchange-arbitrage system. This file defines language only —
no implementation, no tasks. See [docs/transfer-orchestration.md](./docs/transfer-orchestration.md)
for the plan.

## Catalog (lister-owned)

**Exchange**:
A trading venue. Its canonical identity is its `slug` (e.g. `binance`, `gate`).
Worker file or thread names are not identity.
_Avoid_: venue, platform, using `gate-io` as the exchange identity.

**Cryptocurrency** (Coin):
A tradeable asset. Its cross-exchange identity is `cmcId`; the ticker is
per-exchange.
_Avoid_: token, asset, symbol (that is the per-exchange ticker).

**Market**:
The assignment of a cryptocurrency to an exchange, carrying `tradeEnabled` and
`exchangeSymbol`.
_Avoid_: pair, listing.

**Chain**:
A blockchain network a coin can move on.

**Chain link**:
The assignment of a market to a chain, carrying `withdrawEnabled` and
`depositEnabled`.

**Route**:
A directed transferability fact: on one chain, market A allows withdraw and
market B allows deposit.

**Transferable pair**:
Two started exchanges that share a coin with a route in at least one direction.
Both exchanges' legs are observed.

## Orchestration (sender/receiver)

**Started exchange**:
An exchange the user has activated in sender.

**Subscription**:
The pairing of an exchange with a coin that an orderbook worker streams.

**Desired subscriptions**:
The set computed from transferability for the current started exchanges.

**Current subscriptions**:
The set the running workers are actually streaming.

**Worker**:
One orderbook websocket connection thread for one exchange.

**Connection capacity**:
The maximum number of subscriptions one worker may hold
(`maxSubscriptionsPerConnection`).
