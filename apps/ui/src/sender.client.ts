import type { App } from "@arbitrator/sender/app";
import { treaty } from "@elysiajs/eden";

const senderUrl = () => process.env.SENDER_URL || "http://localhost:3002";

/** Typed HTTP client for the sender orchestrator (Elysia + Eden). */
export const senderClient = treaty<App>(senderUrl());
