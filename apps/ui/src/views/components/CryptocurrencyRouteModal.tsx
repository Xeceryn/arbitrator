import { XIcon } from "./icons";

/**
 * Transfer-route modal for a coin. The header is static until the panel is
 * requested; the body is swapped in by `GET /coins/:id/routes`.
 */
export const CryptocurrencyRouteModal = () => (
  <dialog id="coin_route_modal" class="modal modal-middle">
    <div class="modal-box flex max-w-3xl! flex-col overflow-hidden">
      <header class="flex items-center gap-3 border-b border-base-300 pb-4">
        <div
          id="coin_route_header"
          class="flex min-w-0 flex-1 items-center gap-3"
        >
          <h2 class="text-lg font-semibold">Transfer routes</h2>
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
      <div
        id="coin-route-modal-content"
        class="min-h-0 flex-1 overflow-y-auto pt-4"
      ></div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
);
