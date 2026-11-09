import type { ExchangeUpdate } from "@arbitrator/lister/types";

import { EditForm, TextField } from "./EditForm";

export const ExchangeEditModalContent = (
    props: ExchangeUpdate & { exchangeId: number },
) => (
    <EditForm
        entity="exchange"
        name={props.name}
        url={`/markets/${props.exchangeId}/edit`}
        target={`#market-table-row-${props.exchangeId}`}
        dialog="exchange_edit_modal"
        event="exchange"
    >
        <TextField
            entity="exchange"
            name="name"
            label="Name"
            value={props.name}
        />
        <TextField
            entity="exchange"
            name="slug"
            label="CoinMarketCap slug"
            value={props.slug}
        />
        <TextField
            entity="exchange"
            name="cmcId"
            label="CMC ID"
            type="number"
            value={props.cmcId}
        />
        <label class="flex min-w-0 flex-col gap-1.5">
            <span class="text-sm font-medium">Base currency</span>
            <select
                name="baseCurrency"
                class="select w-full"
                aria-describedby="edit-exchange-error"
            >
                <option value="usdt" selected={props.baseCurrency === "usdt"}>
                    USDT
                </option>
                <option value="idr" selected={props.baseCurrency === "idr"}>
                    IDR
                </option>
            </select>
        </label>
        <TextField
            entity="exchange"
            name="logo"
            label="Logo URL"
            type="url"
            value={props.logo}
            wide
        />
        <label class="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
            <span class="text-sm font-medium">Listed on CoinMarketCap</span>
            <select
                name="registeredOnCmc"
                class="select w-full"
                aria-describedby="edit-exchange-error"
            >
                <option value="true" selected={props.registeredOnCmc === true}>
                    Yes
                </option>
                <option value="false" selected={props.registeredOnCmc !== true}>
                    No
                </option>
            </select>
        </label>
    </EditForm>
);
