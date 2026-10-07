import type { ChainUpdate } from "@arbitrator/lister/types";

export const ChainEditModalContent = (
    props: ChainUpdate & { chainId: number },
) => {
    const chainId = props.chainId ?? 0;
    return (
        <form
            hx-patch={`/chain/${chainId}/edit`}
            hx-target={`#chain-table-row-${chainId}`}
            hx-swap="outerHTML"
            // htmx 4 swaps 4xx by default. Keep validation failures from nuking the row.
            {...{ "hx-status:422": "swap:none" }}
            hx-on:update_chain_success="chain_edit_modal.close()"
        >
            <h2 id="edit-chain-title" class="text-lg font-semibold">
                Edit chain
            </h2>

            <div class="mt-4 flex flex-col gap-3">
                <label class="input input-bordered">
                    <span class="label">Name</span>
                    <input
                        name="name"
                        type="text"
                        placeholder="Ethereum"
                        autocomplete="off"
                        value={props.name}
                    />
                </label>

                <label class="input input-bordered">
                    <span class="label">Code</span>
                    <input
                        name="code"
                        type="text"
                        placeholder="ETH"
                        autocomplete="off"
                        value={props.code}
                    />
                </label>
            </div>

            <div class="modal-action">
                <button
                    type="button"
                    class="btn btn-ghost"
                    onclick="chain_edit_modal.close()"
                >
                    Cancel
                </button>
                <button type="submit" class="btn btn-primary">
                    Save changes
                </button>
            </div>
        </form>
    );
};
