import type { CryptocurrencyUpdate } from "@arbitrator/lister/types";

export const CryptocurrencyEditModalContent = (
  props: CryptocurrencyUpdate & { coinId: number },
) => {
  return (
    <>
      <h3 class="text-lg font-bold">Edit Cryptocurrency</h3>
      <div>
        <label class="input">
          <span class="label">Name</span>
          <input
            name="name"
            autocomplete="off"
            type="text"
            placeholder="Name"
            value={props.name}
          />
        </label>

        <label class="input">
          <span class="label">Slug</span>
          <input
            name="slug"
            type="text"
            placeholder="Slug"
            value={props.slug}
          />
        </label>

        <label class="input">
          <span class="label">Symbol</span>
          <input
            name="symbol"
            type="text"
            placeholder="Symbol"
            value={props.symbol}
          />
        </label>

        <label class="input">
          <span class="label">CMC ID</span>
          <input
            name="cmcId"
            type="number"
            placeholder="CMC ID"
            value={props.cmcId?.toString() ?? ""}
          />
        </label>
      </div>

      <div class="modal-action">
        <form method="dialog">
          <button
            hx-patch={`/coins/${props.coinId ?? "0"}/edit`}
            hx-target={`#coin-table-row-${props.coinId ?? "0"}`}
            hx-swap="outerHTML"
            hx-trigger="click"
            // onclick="cryptocurrency_edit_modal.close()"
            _="on update_coin_success cryptocurrency_edit_modal.close()"
            hx-include="[name=slug], [name=symbol], [name=cmcId], [name=name]"
            class="btn btn-neutral"
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};
