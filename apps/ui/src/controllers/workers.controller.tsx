import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect } from "elysia";
import z from "zod";

import { BaseLayout } from "../helpers/BaseLayout";
import { senderClient } from "../sender.client";
import { PageHeading } from "../views/components/PageHeading";
import { WorkersPage, WorkersResults } from "../views/pages/WorkersPage";

const slugParam = z.object({ slug: z.string().min(1) });

/** Eden surfaces the error body; sender returns `{ message }` for 501s. */
function describeError(error: unknown): string {
  if (!error) return "request failed";
  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const value = record.value;
    if (value && typeof value === "object" && "message" in value) {
      return String((value as { message: unknown }).message);
    }
    if ("message" in record) return String(record.message);
  }
  return String(error);
}

export const WorkersController = new Elysia()
  .use(htmx())

  .get("/workers", ({ hx }) => {
    if (!hx.isHTMX) {
      return (
        <BaseLayout title="arbitmage - Workers" heading="Workers">
          <WorkersPage />
        </BaseLayout>
      );
    }
    return (
      <>
        <PageHeading heading="Workers" oob />
        <title>Workers</title>
        <WorkersPage />
      </>
    );
  })

  .get("/workers/list", ({ hx }) => {
    if (!hx.isHTMX) {
      return redirect("/workers");
    }
    return <WorkersResults />;
  })

  .post(
    "/workers/:slug/start",
    async ({ params, hx }) => {
      const { error } = await senderClient
        .exchanges({ slug: params.slug })
        .start.post();

      if (error) {
        hx.triggerEvent({
          "make-toast": { level: "error", message: describeError(error) },
        });
      } else {
        hx.triggerEvent({
          "make-toast": { level: "success", message: `Started ${params.slug}` },
        });
      }

      return <WorkersResults />;
    },
    { params: slugParam },
  )

  .post(
    "/workers/:slug/stop",
    async ({ params, hx }) => {
      const { error } = await senderClient
        .exchanges({ slug: params.slug })
        .stop.post();

      if (error) {
        hx.triggerEvent({
          "make-toast": { level: "error", message: describeError(error) },
        });
      } else {
        hx.triggerEvent({
          "make-toast": { level: "success", message: `Stopped ${params.slug}` },
        });
      }

      return <WorkersResults />;
    },
    { params: slugParam },
  );
