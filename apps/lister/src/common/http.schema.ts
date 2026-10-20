import { z } from "zod";

/**
 * Error body for routes that used to throw `ORPCError(code, { message })`.
 * The status code lives in the HTTP response, the message in the body.
 */
export const messageSchema = z.object({ message: z.string() });

export type Message = z.infer<typeof messageSchema>;
