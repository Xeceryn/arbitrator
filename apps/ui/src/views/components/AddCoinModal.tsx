export const AddCoinModal = () => {
  return (
    <dialog id="add_coin_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Hello!</h3>
        <p class="py-4">Press ESC key or click the button below to close</p>
        <div class="py-4 flex justify-center">
          <label class="form-control w-full max-w-xs">
            <div class="label">
              <span class="label-text">
                Get <span class="badge badge-outline">slug</span> from
                CoinMarketCap url
              </span>
            </div>
            <input
              id="slug-add-coin-field"
              name="slug"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full max-w-xs"
            />
          </label>
        </div>
        <div class="modal-action">
          <button
            hx-post="/coins"
            hx-trigger="click"
            {...{
              "hx-on:add-coin-success": `
								add_coin_modal.close();
								console.log('closing modal')
								document.querySelector('[name=slug]').value='';
							`,
            }}
            hx-target="#coin-table-body"
            hx-include="[name=slug]"
            hx-swap="beforebegin"
            class="btn btn-primary"
          >
            Add
          </button>
          <form method="dialog">
            <button class="btn btn-error ml-5">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};
