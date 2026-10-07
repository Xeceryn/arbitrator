import { XIcon } from "./icons";

const defaultHeader = `<h2 id="coin-route-title" class="text-lg font-semibold">Transfer routes</h2>`;

/**
 * On close, drop the loaded routes and restore the default title so reopening
 * the modal for another coin never flashes stale data.
 */
const resetOnClose = `on close set #coin-route-modal-content.innerHTML to '' then set #coin_route_header.innerHTML to '${defaultHeader}'`;

/**
 * Transfer-route modal for a coin. The header is static until the panel is
 * requested; the body is swapped in by `GET /coins/:id/routes`. A skeleton is
 * shown (and the routes cleared) while a request is in flight.
 */
export const CryptocurrencyRouteModal = () => (
    <dialog
        id="coin_route_modal"
        class="modal modal-middle"
        aria-labelledby="coin-route-title"
        _={resetOnClose}
    >
        <div class="modal-box flex w-full max-w-6xl! flex-col overflow-hidden">
            <header class="flex items-center gap-3 border-b border-base-300 pb-4">
                <div
                    id="coin_route_header"
                    class="flex min-w-0 flex-1 items-center gap-3"
                >
                    <h2 id="coin-route-title" class="text-lg font-semibold">
                        Transfer routes
                    </h2>
                </div>
                <span
                    id="coin-route-indicator"
                    class="htmx-indicator loading loading-spinner loading-sm"
                ></span>
                <form method="dialog">
                    <button
                        type="submit"
                        class="btn btn-square btn-ghost btn-sm"
                        aria-label="Close transfer routes"
                    >
                        <XIcon />
                    </button>
                </form>
            </header>

            <div class="relative min-h-0 flex-1">
                {/* Shown while a route request is in flight; the content below is
            cleared whenever the dialog closes. */}
                <div
                    id="coin-route-loading"
                    class="htmx-indicator pointer-events-none absolute inset-0 flex flex-col gap-3 bg-base-100 pt-4"
                    aria-hidden="true"
                >
                    <div class="skeleton h-4 w-48"></div>
                    <div class="skeleton h-11 w-full"></div>
                    <div class="skeleton h-11 w-full"></div>
                    <div class="skeleton h-11 w-full"></div>
                </div>

                <div
                    id="coin-route-modal-content"
                    class="h-full overflow-y-auto pt-4"
                ></div>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
);
