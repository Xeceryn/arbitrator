# Runtime flows

Sequence diagrams for the paths that are easy to get wrong. Static structure is
in [`model.c4`](./model.c4); the wire-level broker topology is in
[`topology.md`](./topology.md), which is generated.

Read the ADRs alongside these: [0001 — desired-state
reconciliation](../adr/0001-desired-state-reconciliation.md), [0002 — control vs
data plane](../adr/0002-worker-control-vs-data-plane.md).

## 1. Starting an exchange (control path)

The only way a worker exists is a reconcile. Start is not a special code path —
it flips `startedExchanges`, and the same reconciler does the rest.

```mermaid
sequenceDiagram
    autonumber
    actor Op as Operator
    participant N as "nginx"
    participant UI as "UI :3000"
    participant S as "Sender :3002"
    participant L as "Lister :3001"
    participant PG as "PostgreSQL"
    participant P as "Worker pool"
    participant W as "Worker thread"
    participant X as "Exchange WS"

    Op->>N: click "start binance"
    N->>UI: proxy
    UI->>S: POST /exchanges/binance/start
    S->>S: orchestrator.start("binance") then runReconcile()
    S->>L: GET desired subscriptions (Eden Treaty)
    L->>PG: select markets joined to exchange
    PG-->>L: rows
    L-->>S: desired subscriptions
    S->>S: reconcile(desired, current, configs)
    Note over S: fewer than two started exchanges<br/>means desired is empty (nothing is arbitrageable)
    S->>P: spawn workerId=binance:1, symbols
    P->>W: new Worker(workerData: { exchange, symbols })
    W->>X: websocket subscribe to books
    S-->>UI: WS /exchanges/ws "status" push
    UI-->>Op: htmx swaps the worker table
```

## 2. `metadata.changed` → reconcile (ADR 0001)

The event is a **hint**, never a diff. The sender re-reads everything and
converges. That is why a lost event is a latency bug, not a correctness bug.

```mermaid
sequenceDiagram
    autonumber
    participant L as "Lister"
    participant R as "RabbitMQ"
    participant S as "Sender orchestrator"
    participant C as "reconcile()"
    participant P as "Worker pool"

    Note over L: any committed mutation —<br/>exchange, cryptocurrency, chain,<br/>market, chain_link
    L->>R: publish metadata.changed (persistent, topic)
    R->>S: deliver to arbitrator.metadata.changed
    S->>S: notifyMetadataChanged() — debounced
    S->>L: GET full desired state
    L-->>S: desired subscriptions
    S->>C: (desired, currentWorkers, configs)
    C-->>S: minimum commands
    Note over C: spawn / subscribe /<br/>unsubscribe / terminate
    S->>P: apply only the deltas
    Note over S,R: broker down when the event fired?<br/>POST /reconcile forces the same path.
```

## 3. Orderbook hot path (data plane)

Worker `postMessage` never carries an orderbook — only control. The payload goes
to RabbitMQ, one durable queue per exchange, so a slow exchange cannot
head-of-line block the others.

```mermaid
sequenceDiagram
    autonumber
    participant X as "Exchange WS"
    participant W as "Worker thread"
    participant R as "RabbitMQ"
    participant RC as "Receiver (one per CPU)"
    participant RD as "Redis"
    participant PG as "PostgreSQL"

    X-->>W: orderbook diff
    W->>W: normalize to { exchange, cmcId, asks, bids }
    W->>R: sendToQueue arbitrator.orderbook.<exchange>
    Note over W,R: default exchange, no binding —<br/>the receiver declares the queue at boot
    R->>RC: deliver to exactly one competing consumer
    RC->>RC: cross-exchange opportunity
    RC->>RD: read usdt/idr (cached 5 min, last good value on error)
    RC->>PG: persist opportunity
    RC->>R: ack (prefetch 64)
```

## 4. Worker dies

Level-triggered recovery: the pool reports the death, the orchestrator reconciles
from desired state, and a new worker appears if the exchange is still started.

```mermaid
sequenceDiagram
    autonumber
    participant W as "Worker thread"
    participant P as "Worker pool"
    participant O as "Orchestrator"
    participant L as "Lister"
    participant W2 as "New worker thread"

    W--xP: exit / error
    P->>P: onWorkerFailure(id, exchange)
    P->>O: request reconcile
    O->>L: GET desired state
    L-->>O: still wanted
    O->>P: spawn (same desired set)
    P->>W2: new Worker
    Note over P,W2: converges whether or not the death<br/>event arrived — the diff is recomputed
```

## 5. Worker connection state

`workerStateSchema` has six values, but the adapters only emit three. Treat
`reconnected`, `disconnected` and `error` as legacy enum members until an adapter
starts posting them.

```mermaid
stateDiagram-v2
    [*] --> connected: spawn + subscribe
    connected --> reconnecting: socket drop
    reconnecting --> connected: resubscribed
    connected --> closed: unsubscribe all / stop
    closed --> [*]: thread terminate

    state "never emitted by adapters" as legacy {
        reconnected
        disconnected
        error
    }
```

## 6. Boot order

```mermaid
flowchart LR
    PG[(postgres)] --> M[lister-migrate<br/>one-shot]
    M --> L[lister]
    R[(rabbitmq)] --> L
    RD[(redis)] --> L
    L --> S[sender]
    R --> S
    L --> RC[receiver]
    R --> RC
    RD --> RC
```

Lister owns the migrations; `deploy.compose.yaml` gates everything on
`lister-migrate` completing and on the three stores being healthy.
