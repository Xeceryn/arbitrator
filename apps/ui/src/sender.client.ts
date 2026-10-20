import { env } from "@arbitrator/env-loader";
import type { App } from "@arbitrator/sender/app";
import { treaty } from "@elysia/eden";

const senderUrl = () => env.SENDER_URL;

/** Typed HTTP client for the sender orchestrator (Elysia + Eden). */
export const senderClient = treaty<App>(senderUrl());
