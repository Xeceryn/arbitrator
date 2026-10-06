# Reconcile worker subscriptions from desired state, not from change events

## Context

Exchange start/stop and metadata edits (market/chain-link changes) all move the
set of coins a worker should be subscribed to. The obvious implementation is to
diff the incoming change event and apply the corresponding subscription delta.

## Decision

The sender recomputes the full **desired subscription set** from lister on every
trigger and reconciles the workers to it, sending only the missing
subscribe/unsubscribe commands. It never applies an event's diff directly.

## Why

Change events are easy to lose, duplicate, or reorder; a desired-state
reconciler is idempotent, so replaying it converges regardless. It also makes
start/stop and metadata changes the same code path, and a periodic resync
self-heals anything missed. The cost is a lister query per trigger, which is
cheap and debounced.

## Consequences

- A lost `metadata.changed` event is a latency bug, not a correctness bug.
- The reconciler is a pure function of `(desired, current, configs)` and is
  testable without a broker, threads, or a database.
- Subscription churn is avoided by keeping existing assignments stable and only
  moving a symbol when capacity forces it.
