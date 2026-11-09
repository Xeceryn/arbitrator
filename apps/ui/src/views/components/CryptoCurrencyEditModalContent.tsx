import type { CryptocurrencyUpdate } from "@arbitrator/lister/types";

import { EditForm, TextField } from "./EditForm";

export const CryptocurrencyEditModalContent = (
    props: CryptocurrencyUpdate & { coinId: number; workspace?: boolean },
) => (
    <EditForm
        entity="coin"
        name={props.name}
        url={`/coins/${props.coinId}/edit${props.workspace ? "?view=workspace" : ""}`}
        target={
            props.workspace
                ? "#coin-workspace-identity"
                : `#coin-table-row-${props.coinId}`
        }
        dialog="cryptocurrency_edit_modal"
        event="coin"
    >
        <TextField entity="coin" name="name" label="Name" value={props.name} />
        <TextField
            entity="coin"
            name="symbol"
            label="Symbol"
            value={props.symbol}
        />
        <TextField
            entity="coin"
            name="slug"
            label="CoinMarketCap slug"
            value={props.slug}
        />
        <TextField
            entity="coin"
            name="cmcId"
            label="CMC ID"
            type="number"
            value={props.cmcId}
        />
    </EditForm>
);
