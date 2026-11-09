import type { CryptocurrencySelect } from "@arbitrator/lister/types";
import type { PropsWithChildren } from "@kitajs/html";

import { CryptocurrencyEditModal } from "./CryptocurrencyEditModal";
import { ArrowRightIcon, PencilIcon } from "./icons";

export const CoinWorkspaceIdentity = ({
    coin,
}: {
    coin: CryptocurrencySelect;
}) => (
    <header
        id="coin-workspace-identity"
        class="flex flex-wrap items-center justify-between gap-4"
    >
        <div class="flex min-w-0 items-center gap-3">
            <img
                src={coin.logo}
                alt=""
                class="size-10 shrink-0 rounded-full object-contain"
            />
            <div class="min-w-0">
                <h2 class="break-words text-xl font-semibold">{coin.name}</h2>
                <p class="text-sm text-base-content/70">
                    {coin.symbol.toUpperCase()}{" "}
                    <span class="mx-1" aria-hidden="true">
                        ·
                    </span>{" "}
                    CMC ID {coin.cmcId}
                </p>
            </div>
        </div>
        <button
            type="button"
            class="btn btn-sm"
            data-open-dialog="cryptocurrency_edit_modal"
            hx-get={`/coins/${coin.id}/edit-modal?view=workspace`}
            hx-target="#cryptocurrency_edit_modal_content"
            hx-swap="innerHTML"
        >
            <PencilIcon /> Edit coin
        </button>
    </header>
);

/** A durable URL and a full-width work area, not a second scrolling app inside a dialog. */
export const CoinWorkspace = ({
    coin,
    active,
    children,
}: PropsWithChildren<{
    coin: CryptocurrencySelect;
    active: "assignments" | "routes";
}>) => (
    <section class="mx-auto flex w-full max-w-6xl flex-col gap-5">
        <a href="/coins" class="btn btn-ghost btn-sm w-fit">
            <span class="rotate-180">
                <ArrowRightIcon />
            </span>{" "}
            All coins
        </a>
        <CoinWorkspaceIdentity coin={coin} />
        <nav class="tabs tabs-border" aria-label="Coin workspace">
            <a
                href={`/coins/${coin.id}/assignment`}
                class={`tab ${active === "assignments" ? "tab-active" : ""}`}
                aria-current={active === "assignments" ? "page" : undefined}
            >
                Exchange assignments
            </a>
            <a
                href={`/coins/${coin.id}/routes`}
                class={`tab ${active === "routes" ? "tab-active" : ""}`}
                aria-current={active === "routes" ? "page" : undefined}
            >
                Transfer routes
            </a>
        </nav>
        {children}
        <CryptocurrencyEditModal />
    </section>
);
