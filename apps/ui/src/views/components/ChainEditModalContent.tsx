import type { ChainUpdate } from "@arbitrator/lister/types";

import { EditForm, TextField } from "./EditForm";

export const ChainEditModalContent = (
    props: ChainUpdate & { chainId: number },
) => (
    <EditForm
        entity="chain"
        name={props.name}
        url={`/chain/${props.chainId}/edit`}
        target={`#chain-table-row-${props.chainId}`}
        dialog="chain_edit_modal"
        event="chain"
    >
        <TextField entity="chain" name="name" label="Name" value={props.name} />
        <TextField entity="chain" name="code" label="Code" value={props.code} />
    </EditForm>
);
