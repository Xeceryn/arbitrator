/**
 * Canonical chain resolution.
 *
 * Exchanges label the same chain differently: Binance says `BSC`, Gate says
 * `BSC`, KuCoin says `BEP20` (with `chainId` `bsc`), MEXC says `BEP20(BSC)`.
 * This module maps those labels onto one canonical code so a chain link is
 * created once instead of once per spelling.
 *
 * Anything not in the alias map is **kept, not dropped**: the raw label is
 * sanitized into a code and reported as `unmapped`, so the operator can see the
 * recall debt and merge/rename it later. The alias table is intentionally short
 * and editable — add entries as mismatches show up in a scrape.
 */

import { UNMAPPED_CHAIN } from "./config";

type CanonicalChain = { code: string; name: string };

const ETH: CanonicalChain = { code: "ETH", name: "Ethereum" };
const BSC: CanonicalChain = { code: "BSC", name: "BNB Smart Chain" };
const BNB: CanonicalChain = { code: "BNB", name: "BNB Beacon Chain" };
const TRX: CanonicalChain = { code: "TRX", name: "Tron" };
const SOL: CanonicalChain = { code: "SOL", name: "Solana" };
const MATIC: CanonicalChain = { code: "MATIC", name: "Polygon" };
const ARB: CanonicalChain = { code: "ARB", name: "Arbitrum" };
const OP: CanonicalChain = { code: "OP", name: "Optimism" };
const BASE: CanonicalChain = { code: "BASE", name: "Base" };
const AVAXC: CanonicalChain = { code: "AVAXC", name: "Avalanche C-Chain" };
const TON: CanonicalChain = { code: "TON", name: "Toncoin" };
const NEAR: CanonicalChain = { code: "NEAR", name: "NEAR Protocol" };
const ATOM: CanonicalChain = { code: "ATOM", name: "Cosmos" };
const DOT: CanonicalChain = { code: "DOT", name: "Polkadot" };
const KSM: CanonicalChain = { code: "KSM", name: "Kusama" };
const ADA: CanonicalChain = { code: "ADA", name: "Cardano" };
const XRP: CanonicalChain = { code: "XRP", name: "XRP Ledger" };
const XLM: CanonicalChain = { code: "XLM", name: "Stellar" };
const ALGO: CanonicalChain = { code: "ALGO", name: "Algorand" };
const EGLD: CanonicalChain = { code: "EGLD", name: "MultiversX" };
const KAVA: CanonicalChain = { code: "KAVA", name: "Kava" };
const KLAY: CanonicalChain = { code: "KLAY", name: "Kaia" };
const CELO: CanonicalChain = { code: "CELO", name: "Celo" };
const FTM: CanonicalChain = { code: "FTM", name: "Fantom" };
const ONE: CanonicalChain = { code: "ONE", name: "Harmony" };
const HECO: CanonicalChain = { code: "HECO", name: "Huobi ECO Chain" };
const OKT: CanonicalChain = { code: "OKT", name: "OKC" };
const KCC: CanonicalChain = { code: "KCC", name: "KuCoin Community Chain" };
const EOS: CanonicalChain = { code: "EOS", name: "EOS" };
const WAVES: CanonicalChain = { code: "WAVES", name: "Waves" };
const ZIL: CanonicalChain = { code: "ZIL", name: "Zilliqa" };
const ICX: CanonicalChain = { code: "ICX", name: "ICON" };
const IOST: CanonicalChain = { code: "IOST", name: "IOST" };
const FIL: CanonicalChain = { code: "FIL", name: "Filecoin" };
const LINEA: CanonicalChain = { code: "LINEA", name: "Linea" };
const SCROLL: CanonicalChain = { code: "SCROLL", name: "Scroll" };
const ZKSYNC: CanonicalChain = { code: "ZKSYNC", name: "zkSync Era" };
const STARKNET: CanonicalChain = { code: "STARKNET", name: "Starknet" };
const APT: CanonicalChain = { code: "APT", name: "Aptos" };
const SUI: CanonicalChain = { code: "SUI", name: "Sui" };
const SEI: CanonicalChain = { code: "SEI", name: "Sei" };
const INJ: CanonicalChain = { code: "INJ", name: "Injective" };
const CRO: CanonicalChain = { code: "CRO", name: "Cronos" };
const GNO: CanonicalChain = { code: "GNO", name: "Gnosis" };
const GLMR: CanonicalChain = { code: "GLMR", name: "Moonbeam" };
const MOVR: CanonicalChain = { code: "MOVR", name: "Moonriver" };
const ASTR: CanonicalChain = { code: "ASTR", name: "Astar" };
const OSMO: CanonicalChain = { code: "OSMO", name: "Osmosis" };
const TIA: CanonicalChain = { code: "TIA", name: "Celestia" };
const DYDX: CanonicalChain = { code: "DYDX", name: "dYdX" };
const RONIN: CanonicalChain = { code: "RONIN", name: "Ronin" };
const IMX: CanonicalChain = { code: "IMX", name: "Immutable zkEVM" };
const BLAST: CanonicalChain = { code: "BLAST", name: "Blast" };
const MNT: CanonicalChain = { code: "MNT", name: "Mantle" };
const BERA: CanonicalChain = { code: "BERA", name: "Berachain" };
const MONAD: CanonicalChain = { code: "MONAD", name: "Monad" };
const SONIC: CanonicalChain = { code: "SONIC", name: "Sonic" };
const KAS: CanonicalChain = { code: "KAS", name: "Kaspa" };
const LTC: CanonicalChain = { code: "LTC", name: "Litecoin" };
const BCH: CanonicalChain = { code: "BCH", name: "Bitcoin Cash" };
const BSV: CanonicalChain = { code: "BSV", name: "Bitcoin SV" };
const DOGE: CanonicalChain = { code: "DOGE", name: "Dogecoin" };
const XMR: CanonicalChain = { code: "XMR", name: "Monero" };
const ETC: CanonicalChain = { code: "ETC", name: "Ethereum Classic" };
const XTZ: CanonicalChain = { code: "XTZ", name: "Tezos" };
const VET: CanonicalChain = { code: "VET", name: "VeChain" };
const HBAR: CanonicalChain = { code: "HBAR", name: "Hedera" };
const XDC: CanonicalChain = { code: "XDC", name: "XDC Network" };
const CFX: CanonicalChain = { code: "CFX", name: "Conflux" };
const CFXEVM: CanonicalChain = { code: "CFXEVM", name: "Conflux eSpace" };
const CKB: CanonicalChain = { code: "CKB", name: "Nervos CKB" };
const ROSE: CanonicalChain = { code: "ROSE", name: "Oasis" };
const ZEC: CanonicalChain = { code: "ZEC", name: "Zcash" };
const DASH: CanonicalChain = { code: "DASH", name: "Dash" };
const DCR: CanonicalChain = { code: "DCR", name: "Decred" };
const RVN: CanonicalChain = { code: "RVN", name: "Ravencoin" };
const NEO: CanonicalChain = { code: "NEO", name: "NEO" };
const QTUM: CanonicalChain = { code: "QTUM", name: "Qtum" };
const WAN: CanonicalChain = { code: "WAN", name: "Wanchain" };
const LUNC: CanonicalChain = { code: "LUNC", name: "Terra Classic" };
const ONT: CanonicalChain = { code: "ONT", name: "Ontology" };
const THETA: CanonicalChain = { code: "THETA", name: "Theta" };
const CHZ: CanonicalChain = { code: "CHZ", name: "Chiliz Chain" };
const MANTA: CanonicalChain = { code: "MANTA", name: "Manta Pacific" };
const MODE: CanonicalChain = { code: "MODE", name: "Mode" };
const MTL: CanonicalChain = { code: "MTL", name: "Metal L2" };
const ZKL: CanonicalChain = { code: "ZKL", name: "zkLink" };
const TAIKO: CanonicalChain = { code: "TAIKO", name: "Taiko" };
const HYPE: CanonicalChain = { code: "HYPE", name: "HyperEVM" };
const IOTX: CanonicalChain = { code: "IOTX", name: "IoTeX" };
const DBC: CanonicalChain = { code: "DBC", name: "DeepBrain Chain" };
const ELA: CanonicalChain = { code: "ELA", name: "Elastos" };
const ETN: CanonicalChain = { code: "ETN", name: "Electroneum" };
const AURORA: CanonicalChain = { code: "AURORA", name: "Aurora" };
const BOBA: CanonicalChain = { code: "BOBA", name: "Boba Network" };
const TELOS: CanonicalChain = { code: "TELOS", name: "Telos" };
const PHAROS: CanonicalChain = { code: "PHAROS", name: "Pharos" };
const POKT: CanonicalChain = { code: "POKT", name: "Pocket Network" };
const XCH: CanonicalChain = { code: "XCH", name: "Chia" };
const DYM: CanonicalChain = { code: "DYM", name: "Dymension" };
const ERG: CanonicalChain = { code: "ERG", name: "Ergo" };
const ENJ: CanonicalChain = { code: "ENJ", name: "Enjin" };
const CHR: CanonicalChain = { code: "CHR", name: "Chromia" };
const CHEQ: CanonicalChain = { code: "CHEQ", name: "Cheqd" };
const ALLO: CanonicalChain = { code: "ALLO", name: "Allora" };
const LIGHTNING: CanonicalChain = {
    code: "LIGHTNING",
    name: "Lightning Network",
};
const ZETA: CanonicalChain = { code: "ZETA", name: "ZetaChain" };
const ABCORE: CanonicalChain = { code: "ABCORE", name: "AB Core" };
const BTC: CanonicalChain = { code: "BTC", name: "Bitcoin" };

/**
 * Sentinel labels venues use to mean "this coin is not on a chain" (KuCoin
 * `ITSNOTACHAIN`, Binance `FIAT_MONEY`). They are not real chains, so they
 * resolve straight to the placeholder.
 */
const NOT_A_CHAIN: CanonicalChain = {
    code: UNMAPPED_CHAIN.code,
    name: UNMAPPED_CHAIN.name,
};

/**
 * Alias keys are *squashed*: lowercased with every non-alphanumeric character
 * removed. So `"BEP20(BSC)"`, `"BEP-20 (BSC)"` and `"bep20 bsc"` all collapse
 * to `bep20bsc` and hit the same entry.
 */
const CHAIN_ALIASES: Record<string, CanonicalChain> = {
    // Ethereum / ERC-20
    eth: ETH,
    ether: ETH,
    ethereum: ETH,
    erc20: ETH,
    ethmainnet: ETH,
    ethereummainnet: ETH,
    ethereumerc20: ETH,
    erc20eth: ETH,
    // BNB Smart Chain (BEP-20)
    bsc: BSC,
    bnb: BNB,
    bep2: BNB,
    bep20: BSC,
    bep20bsc: BSC,
    bscbep20: BSC,
    bnbchain: BSC,
    bnbsmartchain: BSC,
    binancesmartchain: BSC,
    bnbbep2: BNB,
    // Tron / TRC-20
    trx: TRX,
    tron: TRX,
    trc20: TRX,
    trc20trx: TRX,
    trontrc20: TRX,
    trxerc20: ETH,
    // Solana
    sol: SOL,
    solana: SOL,
    solmainnet: SOL,
    // Polygon
    matic: MATIC,
    pol: MATIC,
    polygon: MATIC,
    polygonpos: MATIC,
    maticpolygon: MATIC,
    polygonmatic: MATIC,
    // L2 / EVM
    arb: ARB,
    arbitrum: ARB,
    arbitrumone: ARB,
    arbone: ARB,
    arb1: ARB,
    arbevm: ARB,
    op: OP,
    optimism: OP,
    opmainnet: OP,
    base: BASE,
    basemainnet: BASE,
    avaxc: AVAXC,
    avax: AVAXC,
    avaxcchain: AVAXC,
    avalanche: AVAXC,
    avalanchecchain: AVAXC,
    linea: LINEA,
    scroll: SCROLL,
    zksync: ZKSYNC,
    zksyncera: ZKSYNC,
    starknet: STARKNET,
    stark: STARKNET,
    mnt: MNT,
    mantle: MNT,
    blast: BLAST,
    bera: BERA,
    berachain: BERA,
    monad: MONAD,
    sonic: SONIC,
    imx: IMX,
    immutable: IMX,
    immutablex: IMX,
    // Other L1s / sovereign chains
    ton: TON,
    toncoin: TON,
    theopennetwork: TON,
    near: NEAR,
    nearprotocol: NEAR,
    atom: ATOM,
    cosmos: ATOM,
    cosmoshub: ATOM,
    dot: DOT,
    polkadot: DOT,
    ksm: KSM,
    kusama: KSM,
    ada: ADA,
    cardano: ADA,
    xrp: XRP,
    ripple: XRP,
    xrpledger: XRP,
    xlm: XLM,
    stellar: XLM,
    algo: ALGO,
    algorand: ALGO,
    egld: EGLD,
    elrond: EGLD,
    multiversx: EGLD,
    kava: KAVA,
    klay: KLAY,
    klaytn: KLAY,
    kaia: KLAY,
    celo: CELO,
    ftm: FTM,
    fantom: FTM,
    opera: FTM,
    one: ONE,
    harmony: ONE,
    heco: HECO,
    huobiecochain: HECO,
    okc: OKT,
    okt: OKT,
    okexchain: OKT,
    kcc: KCC,
    kucoincommunitychain: KCC,
    eos: EOS,
    waves: WAVES,
    zil: ZIL,
    zilliqa: ZIL,
    icx: ICX,
    icon: ICX,
    iost: IOST,
    fil: FIL,
    filecoin: FIL,
    apt: APT,
    aptos: APT,
    sui: SUI,
    sei: SEI,
    inj: INJ,
    injective: INJ,
    cro: CRO,
    cronos: CRO,
    gno: GNO,
    gnosis: GNO,
    glmr: GLMR,
    moonbeam: GLMR,
    movr: MOVR,
    moonriver: MOVR,
    astr: ASTR,
    astar: ASTR,
    osmo: OSMO,
    osmosis: OSMO,
    tia: TIA,
    celestia: TIA,
    dydx: DYDX,
    ronin: RONIN,
    kas: KAS,
    kaspa: KAS,
    ltc: LTC,
    litecoin: LTC,
    bch: BCH,
    bitcoincash: BCH,
    bchabc: BCH,
    bsv: BSV,
    bitcoinsv: BSV,
    bchsv: BSV,
    doge: DOGE,
    dogecoin: DOGE,
    xmr: XMR,
    monero: XMR,
    etc: ETC,
    ethereumclassic: ETC,
    xtz: XTZ,
    tezos: XTZ,
    vet: VET,
    vechain: VET,
    hbar: HBAR,
    hedera: HBAR,
    xdc: XDC,
    xdcnetwork: XDC,
    cfx: CFX,
    conflux: CFX,
    cfxevm: CFXEVM,
    ckb: CKB,
    nervosckb: CKB,
    rose: ROSE,
    oasis: ROSE,
    zec: ZEC,
    zcash: ZEC,
    dash: DASH,
    dcr: DCR,
    decred: DCR,
    rvn: RVN,
    ravencoin: RVN,
    neo: NEO,
    qtum: QTUM,
    wan: WAN,
    wanchain: WAN,
    // Terra / miscellaneous L1s
    lunc: LUNC,
    terraclassic: LUNC,
    ont: ONT,
    ontology: ONT,
    theta: THETA,
    chz: CHZ,
    chz2: CHZ,
    // Venue-specific EVM spellings
    baseevm: BASE,
    opeth: OP,
    suinew: SUI,
    seievm: SEI,
    zksera: ZKSYNC,
    ron: RONIN,
    // "not a chain" sentinels
    itsnotachain: NOT_A_CHAIN,
    fiatmoney: NOT_A_CHAIN,
    btc: BTC,
    bitcoin: BTC,
    // Same network under a variant spelling. Most of these are also reachable
    // generically via the qualifier rules below; listed for explicitness.
    manta: MANTA,
    mon: MONAD,
    bchn: BCH,
    xdb: XDC,
    xdbchain: XDC,
    strk: STARKNET,
    mode: MODE,
    mtl: MTL,
    zkl: ZKL,
    taiko: TAIKO,
    hype: HYPE,
    hyper: HYPE,
    iotx: IOTX,
    dbc: DBC,
    ela: ELA,
    etn: ETN,
    file: FIL,
    filevm: FIL,
    aurora: AURORA,
    boba: BOBA,
    tlos: TELOS,
    telos: TELOS,
    okb: OKT,
    cfxcore: CFX,
    pharos: PHAROS,
    poktshannon: POKT,
    xch: XCH,
    xchold: XCH,
    assethubkusama: KSM,
    assethubpolkadot: DOT,
    oasissapphire: ROSE,
    ksmsm: KSM,
    dotsm: DOT,
    dymension: DYM,
    ergo: ERG,
    enjin: ENJ,
    chromia: CHR,
    cheqd: CHEQ,
    allora: ALLO,
    brc: BTC,
    brc20: BTC,
    lightning: LIGHTNING,
    lightningnetwork: LIGHTNING,
    zeta: ZETA,
    zetachain: ZETA,
    abcore: ABCORE,
    // Cross-exchange findings from `--analyze` (contract-address evidence).
    // Review-worthy: `CAP20` -> CHZ, `S` -> SONIC, `SAAKURU` -> BSC.
    ab: ABCORE,
    cap20: CHZ,
    kai: BSC,
    metaldaol2: MTL,
    neon3: NEO,
    ong: ONT,
    s: SONIC,
    saakuru: BSC,
    vaulta: EOS,
    zrc: ETH,
    zircuit: ETH,
};

export type ResolvedChain = {
    code: string;
    name: string;
    canonical: boolean;
};

/** Tokens that describe the *kind* of a network, not a different chain. */
const CHAIN_QUALIFIERS = new Set([
    "eth",
    "evm",
    "mainnet",
    "network",
    "chain",
    "memo",
    "co",
    "vm",
]);

/** Qualifiers that, combined with `btc`, still mean the Bitcoin network. */
const BITCOIN_QUALIFIERS = new Set([
    "segwit",
    "segwitbtc",
    "brc",
    "brc20",
    "brc30",
    "runes",
    "rune",
    "tap",
    "taproot",
    "ordi",
    "ordinal",
    "ordinals",
]);

/** True for a Bitcoin spelling: SegWit, BRC-20, Runes, Taproot, Ordinals. */
function isBitcoinVariant(label: string): boolean {
    const squashed = squash(label);
    if (!squashed.includes("btc")) return false;
    const remainder = squashed.replace(/btc/g, "").replace(/\d+/g, "");
    if (remainder === "") return true;
    return BITCOIN_QUALIFIERS.has(remainder);
}

/** Candidate squashed spellings with network-qualifier tokens removed. */
function derivedCandidates(label: string): string[] {
    const candidates = new Set<string>();

    // Strip qualifier *suffixes* iteratively: LINEAETH -> linea, KAVA_EVM_CO_CHAIN -> kava.
    let current = squash(label);
    for (let i = 0; i < 6; i += 1) {
        let stripped = false;
        for (const qualifier of CHAIN_QUALIFIERS) {
            if (
                current.length > qualifier.length &&
                current.endsWith(qualifier)
            ) {
                current = current.slice(0, -qualifier.length);
                candidates.add(current);
                stripped = true;
                break;
            }
        }
        if (!stripped) break;
    }

    // Drop qualifier/version *tokens*: "Kava EVM Co-Chain" -> kava.
    const tokens = label
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter(
            (token) =>
                token.length > 0 &&
                !CHAIN_QUALIFIERS.has(token) &&
                !/^\d+$/.test(token),
        );
    if (tokens.length > 0) candidates.add(tokens.join(""));

    // Trailing version digits: ZILLIQA 2 -> zilliqa, ZKS20 -> zks.
    const withoutVersion = squash(label).replace(/\d+$/, "");
    if (withoutVersion.length > 0) candidates.add(withoutVersion);

    return [...candidates];
}

/** Resolve a label through qualifier-stripping and Bitcoin-family rules. */
function resolveByDerivation(
    label: string,
    hint?: string,
): CanonicalChain | undefined {
    if (isBitcoinVariant(label)) return CHAIN_ALIASES.btc;

    for (const candidate of [label, hint ?? ""]) {
        if (!candidate) continue;
        for (const derived of derivedCandidates(candidate)) {
            const match = CHAIN_ALIASES[derived];
            if (match && match.code !== UNMAPPED_CHAIN.code) return match;
        }
    }
    return undefined;
}

/** Squash a label for alias lookup. */
function squash(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** Turn an arbitrary label into an uppercase, lister-safe chain code. */
function sanitizeCode(value: string): string {
    return value
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * Resolve an exchange network label to the chain code/name to store in lister.
 *
 * Lookup order: the raw label, then the adapter's `hint` (KuCoin's `chainId`),
 * then a derivation pass that strips network qualifiers (`ETH`, `EVM`,
 * `MAINNET`, `CHAIN`, …) and folds Bitcoin spellings (SegWit, BRC-20, Runes,
 * Taproot, Ordinals) onto `BTC`. An empty label means "unknown" and resolves to
 * the `UNMPD` placeholder. `canonicalize: false` skips all of it, keeping each
 * venue's own naming untouched.
 */
export function resolveChain(
    network: string,
    hint?: string,
    canonicalize = true,
): ResolvedChain {
    const raw = network.trim();

    if (canonicalize) {
        const candidates = [raw, hint ?? ""];
        for (const candidate of candidates) {
            if (!candidate) continue;
            const match = CHAIN_ALIASES[squash(candidate)];
            if (match) {
                return { ...match, canonical: true };
            }
        }

        const derived = resolveByDerivation(raw, hint);
        if (derived) {
            return { ...derived, canonical: true };
        }
    }

    if (!raw) {
        return {
            code: UNMAPPED_CHAIN.code,
            name: UNMAPPED_CHAIN.name,
            canonical: false,
        };
    }

    const code = sanitizeCode(raw);
    if (!code) {
        return {
            code: UNMAPPED_CHAIN.code,
            name: UNMAPPED_CHAIN.name,
            canonical: false,
        };
    }

    return { code, name: raw, canonical: false };
}
