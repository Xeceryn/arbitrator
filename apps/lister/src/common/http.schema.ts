import { t } from "elysia";
import type { Static } from "typebox";

/**
 * Error body for routes that used to throw `ORPCError(code, { message })`.
 * The status code lives in the HTTP response, the message in the body.
 */
export const messageSchema = t.Object({ message: t.String() });

export type Message = Static<typeof messageSchema>;
