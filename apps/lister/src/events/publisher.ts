/**
 * Re-export of the shared RabbitMQ publisher. Events are best-effort: a lister
 * that cannot reach the broker must keep serving the API (the UI depends on it).
 */
export { publish } from "@arbitrator/messaging";
