import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect } from "elysia";
import z from "zod";

import { BaseLayout } from "../helpers/BaseLayout";
import { type AppClients, clientsPlugin } from "../plugins/clients";
import { PageHeading } from "../views/components/PageHeading";
import {
  type SenderStatus,
  type WorkersData,
  WorkersPage,
  WorkersResults,
} from "../views/pages/WorkersPage";

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

/** Tolerate a sender that is older/newer than this UI (missing fields). */
function normalizeStatus(input: unknown): SenderStatus {
  const record = (input ?? {}) as Partial<SenderStatus>;
  return {
    started: Array.isArray(record.started) ? record.started : [],
    workers: Array.isArray(record.workers) ? record.workers : [],
    supported: Array.isArray(record.supported) ? record.supported : [],
  };
}

async function loadWorkersData({
  lister,
  sender,
}: AppClients): Promise<WorkersData> {
  try {
    const { data, error } = await sender.exchanges.get();
    if (error || !data) {
      return { ok: false, message: describeError(error) };
    }

    const [listError, list] = await lister.exchange.list({ limit: -1 });
    if (listError || !list) {
      return { ok: false, message: "Unable to load exchanges." };
    }

    return { ok: true, status: normalizeStatus(data), exchanges: list.data };
  } catch (error) {
    return { ok: false, message: describeError(error) };
  }
}

export const WorkersController = new Elysia()
  .use(htmx())
  .use(clientsPlugin)

  .get("/workers", async ({ hx, lister, sender }) => {
    const data = await loadWorkersData({ lister, sender });

    if (!hx.isHTMX) {
      return (
        <BaseLayout title="arbitmage - Workers" heading="Workers">
          <WorkersPage data={data} />
        </BaseLayout>
      );
    }
    return (
      <>
        <PageHeading heading="Workers" oob />
        <title>Workers</title>
        <WorkersPage data={data} />
      </>
    );
  })

  .get("/workers/list", async ({ hx, lister, sender }) => {
    if (!hx.isHTMX) {
      return redirect("/workers");
    }
    return <WorkersResults data={await loadWorkersData({ lister, sender })} />;
  })

  .post(
    "/workers/:slug/start",
    async ({ params, hx, lister, sender }) => {
      const { error } = await sender
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

      return (
        <WorkersResults data={await loadWorkersData({ lister, sender })} />
      );
    },
    { params: slugParam },
  )

  .post(
    "/workers/:slug/stop",
    async ({ params, hx, lister, sender }) => {
      const { error } = await sender
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

      return (
        <WorkersResults data={await loadWorkersData({ lister, sender })} />
      );
    },
    { params: slugParam },
  );
