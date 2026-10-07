var dD = Object.create;
var { getPrototypeOf: MD, defineProperty: O, getOwnPropertyNames: tD } = Object;
var UD = Object.prototype.hasOwnProperty;
var gD = (I, E, N) => {
    N = I != null ? dD(MD(I)) : {};
    let $ =
        E || !I || !I.__esModule
            ? O(N, "default", { value: I, enumerable: !0 })
            : N;
    for (let _ of tD(I))
        if (!UD.call($, _)) O($, _, { get: () => I[_], enumerable: !0 });
    return $;
};
var uD = (I, E) => () => (E || I((E = { exports: {} }).exports, E), E.exports);
var LD = (I, E) => {
    for (var N in E)
        O(I, N, {
            get: E[N],
            enumerable: !0,
            configurable: !0,
            set: ($) => (E[N] = () => $),
        });
};
var J = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
};
var x5 = ([I, E, N]) => {
        let $ = document.createElementNS("http://www.w3.org/2000/svg", I);
        if (
            (Object.keys(E).forEach((_) => {
                $.setAttribute(_, String(E[_]));
            }),
            N?.length)
        )
            N.forEach((_) => {
                let Z = x5(_);
                $.appendChild(Z);
            });
        return $;
    },
    H5 = (I, E = {}) => {
        let $ = { ...J, ...E };
        return x5(["svg", $, I]);
    };
var RD = (I) =>
        Array.from(I.attributes).reduce((E, N) => {
            return ((E[N.name] = N.value), E);
        }, {}),
    lD = (I) => {
        if (typeof I === "string") return I;
        if (!I || !I.class) return "";
        if (I.class && typeof I.class === "string") return I.class.split(" ");
        if (I.class && Array.isArray(I.class)) return I.class;
        return "";
    },
    jD = (I) => {
        return I.flatMap(lD)
            .map((N) => N.trim())
            .filter(Boolean)
            .filter((N, $, _) => _.indexOf(N) === $)
            .join(" ");
    },
    mD = (I) =>
        I.replace(
            /(\w)(\w*)(_|-|\s*)/g,
            (E, N, $) => N.toUpperCase() + $.toLowerCase(),
        ),
    T = (I, { nameAttr: E, icons: N, attrs: $ }) => {
        let _ = I.getAttribute(E);
        if (_ == null) return;
        let Z = mD(_),
            Q = N[Z];
        if (!Q)
            return console.warn(
                `${I.outerHTML} icon name was not found in the provided icons object.`,
            );
        let V5 = RD(I),
            G5 = { ...J, "data-lucide": _, ...$, ...V5 },
            W5 = jD(["lucide", `lucide-${_}`, V5, $]);
        if (W5) Object.assign(G5, { class: W5 });
        let fD = H5(Q, G5);
        return I.parentNode?.replaceChild(fD, I);
    };
var z = {};
LD(z, {
    ZoomOut: () => kD,
    ZoomIn: () => bD,
    ZapOff: () => CD,
    Zap: () => hD,
    Youtube: () => qD,
    XSquare: () => j2,
    XOctagon: () => F0,
    XCircle: () => y1,
    X: () => yD,
    Wrench: () => PD,
    WrapText: () => o2,
    Worm: () => vD,
    Workflow: () => SD,
    WineOff: () => AD,
    Wine: () => BD,
    WindArrowDown: () => DD,
    Wind: () => FD,
    WifiZero: () => OD,
    WifiSync: () => zD,
    WifiPen: () => HD,
    WifiOff: () => xD,
    WifiLow: () => WD,
    WifiHigh: () => GD,
    WifiCog: () => VD,
    Wifi: () => TD,
    WholeWord: () => XD,
    WheatOff: () => JD,
    Wheat: () => KD,
    Weight: () => QD,
    WebhookOff: () => ZD,
    Webhook: () => YD,
    Webcam: () => _D,
    Waypoints: () => $D,
    WavesLadder: () => ED,
    Waves: () => ND,
    Watch: () => ID,
    WashingMachine: () => aT,
    Warehouse: () => pT,
    WandSparkles: () => X5,
    Wand2: () => X5,
    Wand: () => sT,
    Wallpaper: () => eT,
    WalletMinimal: () => K5,
    WalletCards: () => oT,
    Wallet2: () => K5,
    Wallet: () => rT,
    Vote: () => iT,
    VolumeX: () => uT,
    VolumeOff: () => cT,
    Volume2: () => gT,
    Volume1: () => mT,
    Volume: () => nT,
    Volleyball: () => jT,
    Voicemail: () => lT,
    View: () => RT,
    Videotape: () => LT,
    VideoOff: () => tT,
    Video: () => UT,
    VibrateOff: () => dT,
    Vibrate: () => MT,
    Verified: () => h,
    VenusAndMars: () => wT,
    Venus: () => fT,
    VenetianMask: () => kT,
    Vegan: () => bT,
    VectorSquare: () => hT,
    Vault: () => CT,
    Variable: () => qT,
    UtilityPole: () => PT,
    UtensilsCrossed: () => Q5,
    Utensils: () => J5,
    UsersRound: () => Y5,
    Users2: () => Y5,
    Users: () => yT,
    UserX2: () => _5,
    UserX: () => ST,
    UserStar: () => BT,
    UserSquare2: () => l2,
    UserSquare: () => R2,
    UserSearch: () => AT,
    UserRoundX: () => _5,
    UserRoundSearch: () => FT,
    UserRoundPlus: () => $5,
    UserRoundPen: () => DT,
    UserRoundMinus: () => N5,
    UserRoundCog: () => E5,
    UserRoundCheck: () => I5,
    UserRound: () => Z5,
    UserPlus2: () => $5,
    UserPlus: () => TT,
    UserPen: () => OT,
    UserMinus2: () => N5,
    UserMinus: () => zT,
    UserLock: () => HT,
    UserCog2: () => E5,
    UserCog: () => xT,
    UserCircle2: () => S1,
    UserCircle: () => v1,
    UserCheck2: () => I5,
    UserCheck: () => WT,
    User2: () => Z5,
    User: () => vT,
    Usb: () => GT,
    UploadCloud: () => h1,
    Upload: () => VT,
    Unplug: () => XT,
    UnlockKeyhole: () => G0,
    Unlock: () => W0,
    Unlink2: () => JT,
    Unlink: () => KT,
    University: () => a2,
    Ungroup: () => QT,
    UnfoldVertical: () => YT,
    UnfoldHorizontal: () => ZT,
    UndoDot: () => $T,
    Undo2: () => NT,
    Undo: () => _T,
    Underline: () => ET,
    UmbrellaOff: () => aO,
    Umbrella: () => IT,
    TypeOutline: () => sO,
    Type: () => pO,
    Twitter: () => eO,
    Twitch: () => rO,
    TvMinimalPlay: () => iO,
    TvMinimal: () => p2,
    Tv2: () => p2,
    Tv: () => oO,
    Turtle: () => nO,
    Turntable: () => cO,
    TurkishLira: () => uO,
    TruckElectric: () => mO,
    Truck: () => gO,
    Trophy: () => lO,
    TriangleRight: () => RO,
    TriangleDashed: () => LO,
    TriangleAlert: () => s2,
    Triangle: () => jO,
    TrendingUpDown: () => tO,
    TrendingUp: () => UO,
    TrendingDown: () => MO,
    Trello: () => dO,
    Trees: () => fO,
    TreePine: () => wO,
    TreePalm: () => e2,
    TreeDeciduous: () => kO,
    Trash2: () => hO,
    Trash: () => bO,
    Transgender: () => CO,
    TramFront: () => r2,
    TrainTrack: () => qO,
    TrainFrontTunnel: () => yO,
    TrainFront: () => PO,
    Train: () => r2,
    TrafficCone: () => vO,
    Tractor: () => SO,
    ToyBrick: () => BO,
    TowerControl: () => AO,
    TouchpadOff: () => DO,
    Touchpad: () => FO,
    Torus: () => TO,
    Tornado: () => OO,
    ToolCase: () => zO,
    Toilet: () => HO,
    ToggleRight: () => xO,
    ToggleLeft: () => WO,
    TimerReset: () => VO,
    TimerOff: () => XO,
    Timer: () => GO,
    TicketsPlane: () => JO,
    Tickets: () => KO,
    TicketX: () => YO,
    TicketSlash: () => ZO,
    TicketPlus: () => _O,
    TicketPercent: () => $O,
    TicketMinus: () => NO,
    TicketCheck: () => EO,
    Ticket: () => QO,
    ThumbsUp: () => IO,
    ThumbsDown: () => az,
    ThermometerSun: () => sz,
    ThermometerSnowflake: () => ez,
    Thermometer: () => pz,
    Theater: () => rz,
    TextWrap: () => o2,
    TextSelection: () => i2,
    TextSelect: () => i2,
    TextSearch: () => oz,
    TextQuote: () => iz,
    TextInitial: () => n2,
    TextCursorInput: () => cz,
    TextCursor: () => nz,
    TextAlignStart: () => H,
    TextAlignJustify: () => c2,
    TextAlignEnd: () => u2,
    TextAlignCenter: () => g2,
    Text: () => H,
    TestTubes: () => uz,
    TestTubeDiagonal: () => m2,
    TestTube2: () => m2,
    TestTube: () => gz,
    TerminalSquare: () => L2,
    Terminal: () => mz,
    TentTree: () => jz,
    Tent: () => lz,
    Telescope: () => Lz,
    Target: () => Rz,
    Tangent: () => Uz,
    Tally5: () => tz,
    Tally4: () => Mz,
    Tally3: () => dz,
    Tally2: () => fz,
    Tally1: () => wz,
    Tags: () => kz,
    Tag: () => bz,
    Tablets: () => hz,
    TabletSmartphone: () => qz,
    Tablet: () => Cz,
    TableRowsSplit: () => yz,
    TableProperties: () => Sz,
    TableOfContents: () => vz,
    TableConfig: () => X,
    TableColumnsSplit: () => Bz,
    TableCellsSplit: () => Az,
    TableCellsMerge: () => Fz,
    Table2: () => Dz,
    Table: () => Pz,
    Syringe: () => Oz,
    Swords: () => Tz,
    Sword: () => zz,
    SwitchCamera: () => Hz,
    SwissFranc: () => xz,
    SwatchBook: () => Wz,
    Superscript: () => Vz,
    Sunset: () => Gz,
    Sunrise: () => Xz,
    SunSnow: () => Qz,
    SunMoon: () => Jz,
    SunMedium: () => Zz,
    SunDim: () => Yz,
    Sun: () => Kz,
    Subtitles: () => M,
    Subscript: () => _z,
    Strikethrough: () => $z,
    StretchVertical: () => Nz,
    StretchHorizontal: () => Ez,
    Store: () => aH,
    StopCircle: () => B1,
    StickyNote: () => Iz,
    Sticker: () => pH,
    Stethoscope: () => sH,
    StepForward: () => eH,
    StepBack: () => rH,
    Stars: () => g0,
    StarOff: () => iH,
    StarHalf: () => nH,
    Star: () => oH,
    Stamp: () => cH,
    Squirrel: () => uH,
    SquircleDashed: () => mH,
    Squircle: () => gH,
    SquaresUnite: () => jH,
    SquaresSubtract: () => lH,
    SquaresIntersect: () => RH,
    SquaresExclude: () => LH,
    SquareX: () => j2,
    SquareUserRound: () => l2,
    SquareUser: () => R2,
    SquareTerminal: () => L2,
    SquareStop: () => tH,
    SquareStar: () => dH,
    SquareStack: () => MH,
    SquareSquare: () => fH,
    SquareSplitVertical: () => U2,
    SquareSplitHorizontal: () => t2,
    SquareSlash: () => M2,
    SquareSigma: () => d2,
    SquareScissors: () => f2,
    SquareRoundCorner: () => wH,
    SquareRadical: () => kH,
    SquarePower: () => w2,
    SquarePlus: () => k2,
    SquarePlay: () => b2,
    SquarePilcrow: () => h2,
    SquarePi: () => C2,
    SquarePercent: () => q2,
    SquarePen: () => Y,
    SquarePause: () => bH,
    SquareParkingOff: () => y2,
    SquareParking: () => P2,
    SquareMousePointer: () => v2,
    SquareMinus: () => S2,
    SquareMenu: () => B2,
    SquareM: () => A2,
    SquareLibrary: () => F2,
    SquareKanban: () => D2,
    SquareGanttChart: () => x,
    SquareFunction: () => T2,
    SquareEqual: () => O2,
    SquareDot: () => H2,
    SquareDivide: () => z2,
    SquareDashedTopSolid: () => hH,
    SquareDashedMousePointer: () => W2,
    SquareDashedKanban: () => G2,
    SquareDashedBottomCode: () => qH,
    SquareDashedBottom: () => CH,
    SquareDashed: () => x2,
    SquareCode: () => V2,
    SquareChevronUp: () => X2,
    SquareChevronRight: () => K2,
    SquareChevronLeft: () => J2,
    SquareChevronDown: () => Q2,
    SquareCheckBig: () => Z2,
    SquareCheck: () => Y2,
    SquareChartGantt: () => x,
    SquareBottomDashedScissors: () => _2,
    SquareAsterisk: () => $2,
    SquareArrowUpRight: () => E2,
    SquareArrowUpLeft: () => I2,
    SquareArrowUp: () => N2,
    SquareArrowRight: () => a0,
    SquareArrowOutUpRight: () => p0,
    SquareArrowOutUpLeft: () => e0,
    SquareArrowOutDownRight: () => s0,
    SquareArrowOutDownLeft: () => r0,
    SquareArrowLeft: () => o0,
    SquareArrowDownRight: () => n0,
    SquareArrowDownLeft: () => c0,
    SquareArrowDown: () => i0,
    SquareActivity: () => u0,
    Square: () => UH,
    Sprout: () => PH,
    SprayCan: () => yH,
    Spotlight: () => vH,
    Spool: () => SH,
    SplitSquareVertical: () => U2,
    SplitSquareHorizontal: () => t2,
    Split: () => BH,
    SplinePointer: () => FH,
    Spline: () => AH,
    SpellCheck2: () => TH,
    SpellCheck: () => DH,
    Speech: () => OH,
    Speaker: () => zH,
    Sparkles: () => g0,
    Sparkle: () => xH,
    Spade: () => WH,
    Space: () => HH,
    Soup: () => GH,
    SortDesc: () => S,
    SortAsc: () => P,
    Sofa: () => VH,
    SoapDispenserDroplet: () => XH,
    Snowflake: () => KH,
    Snail: () => JH,
    SmilePlus: () => YH,
    Smile: () => QH,
    SmartphoneNfc: () => $H,
    SmartphoneCharging: () => _H,
    Smartphone: () => ZH,
    SlidersVertical: () => m0,
    SlidersHorizontal: () => NH,
    Sliders: () => m0,
    Slice: () => EH,
    SlashSquare: () => M2,
    Slash: () => IH,
    Slack: () => ax,
    Skull: () => px,
    SkipForward: () => sx,
    SkipBack: () => ex,
    Siren: () => rx,
    SignpostBig: () => ix,
    Signpost: () => ox,
    Signature: () => nx,
    SignalZero: () => ux,
    SignalMedium: () => gx,
    SignalLow: () => mx,
    SignalHigh: () => jx,
    Signal: () => cx,
    SigmaSquare: () => d2,
    Sigma: () => Lx,
    SidebarOpen: () => P0,
    SidebarClose: () => v0,
    Sidebar: () => q0,
    Shuffle: () => lx,
    Shrub: () => Rx,
    Shrink: () => Ux,
    Shrimp: () => tx,
    Shredder: () => Mx,
    ShowerHead: () => dx,
    Shovel: () => fx,
    ShoppingCart: () => wx,
    ShoppingBasket: () => kx,
    ShoppingBag: () => bx,
    Shirt: () => Cx,
    ShipWheel: () => hx,
    Ship: () => qx,
    ShieldX: () => j0,
    ShieldUser: () => yx,
    ShieldQuestionMark: () => l0,
    ShieldQuestion: () => l0,
    ShieldPlus: () => vx,
    ShieldOff: () => Sx,
    ShieldMinus: () => Bx,
    ShieldHalf: () => Ax,
    ShieldEllipsis: () => Fx,
    ShieldClose: () => j0,
    ShieldCheck: () => Dx,
    ShieldBan: () => Tx,
    ShieldAlert: () => Ox,
    Shield: () => Px,
    Shell: () => zx,
    Sheet: () => Hx,
    Share2: () => Wx,
    Share: () => xx,
    Shapes: () => Gx,
    Settings2: () => Xx,
    Settings: () => Vx,
    ServerOff: () => Kx,
    ServerCrash: () => Qx,
    ServerCog: () => Yx,
    Server: () => Jx,
    SeparatorVertical: () => Zx,
    SeparatorHorizontal: () => _x,
    SendToBack: () => Nx,
    SendHorizontal: () => R0,
    SendHorizonal: () => R0,
    Send: () => $x,
    Section: () => Ex,
    SearchX: () => aW,
    SearchSlash: () => pW,
    SearchCode: () => sW,
    SearchCheck: () => eW,
    Search: () => Ix,
    ScrollText: () => oW,
    Scroll: () => rW,
    ScreenShareOff: () => nW,
    ScreenShare: () => iW,
    ScissorsSquareDashedBottom: () => _2,
    ScissorsSquare: () => f2,
    ScissorsLineDashed: () => uW,
    Scissors: () => cW,
    School2: () => a2,
    School: () => gW,
    ScatterChart: () => o,
    ScanText: () => lW,
    ScanSearch: () => jW,
    ScanQrCode: () => RW,
    ScanLine: () => LW,
    ScanHeart: () => UW,
    ScanFace: () => tW,
    ScanEye: () => MW,
    ScanBarcode: () => dW,
    Scan: () => mW,
    Scaling: () => fW,
    Scale3d: () => L0,
    Scale3D: () => L0,
    Scale: () => wW,
    SaveOff: () => bW,
    SaveAll: () => hW,
    Save: () => kW,
    SaudiRiyal: () => CW,
    SatelliteDish: () => yW,
    Satellite: () => qW,
    Sandwich: () => PW,
    Salad: () => vW,
    Sailboat: () => SW,
    RussianRuble: () => AW,
    RulerDimensionLine: () => FW,
    Ruler: () => BW,
    Rss: () => DW,
    Rows4: () => TW,
    Rows3: () => U0,
    Rows2: () => t0,
    Rows: () => t0,
    Router: () => OW,
    RouteOff: () => HW,
    Route: () => zW,
    RotateCwSquare: () => WW,
    RotateCw: () => xW,
    RotateCcwSquare: () => VW,
    RotateCcwKey: () => XW,
    RotateCcw: () => GW,
    Rotate3d: () => M0,
    Rotate3D: () => M0,
    Rose: () => KW,
    RollerCoaster: () => JW,
    RockingChair: () => QW,
    Rocket: () => YW,
    Ribbon: () => ZW,
    Rewind: () => _W,
    ReplyAll: () => NW,
    Reply: () => $W,
    ReplaceAll: () => IW,
    Replace: () => EW,
    Repeat2: () => pG,
    Repeat1: () => sG,
    Repeat: () => aG,
    RemoveFormatting: () => eG,
    Regex: () => rG,
    Refrigerator: () => oG,
    RefreshCwOff: () => nG,
    RefreshCw: () => iG,
    RefreshCcwDot: () => cG,
    RefreshCcw: () => uG,
    RedoDot: () => mG,
    Redo2: () => jG,
    Redo: () => gG,
    Recycle: () => lG,
    RectangleVertical: () => RG,
    RectangleHorizontal: () => LG,
    RectangleGoggles: () => UG,
    RectangleEllipsis: () => d0,
    RectangleCircle: () => tG,
    ReceiptTurkishLira: () => dG,
    ReceiptText: () => fG,
    ReceiptSwissFranc: () => kG,
    ReceiptRussianRuble: () => wG,
    ReceiptPoundSterling: () => bG,
    ReceiptJapaneseYen: () => hG,
    ReceiptIndianRupee: () => CG,
    ReceiptEuro: () => qG,
    ReceiptCent: () => PG,
    Receipt: () => MG,
    Ratio: () => yG,
    Rat: () => vG,
    Rainbow: () => SG,
    RailSymbol: () => BG,
    Radius: () => AG,
    RadioTower: () => DG,
    RadioReceiver: () => OG,
    Radio: () => FG,
    Radical: () => TG,
    Radiation: () => zG,
    Radar: () => HG,
    Rabbit: () => xG,
    Quote: () => WG,
    QrCode: () => GG,
    Pyramid: () => XG,
    Puzzle: () => VG,
    Proportions: () => KG,
    Projector: () => JG,
    PrinterCheck: () => YG,
    Printer: () => QG,
    Presentation: () => _G,
    PowerSquare: () => w2,
    PowerOff: () => $G,
    PowerCircle: () => F1,
    Power: () => ZG,
    PoundSterling: () => NG,
    Popsicle: () => EG,
    Popcorn: () => IG,
    PointerOff: () => aV,
    Pointer: () => pV,
    Podcast: () => eV,
    PocketKnife: () => rV,
    Pocket: () => sV,
    PlusSquare: () => k2,
    PlusCircle: () => D1,
    Plus: () => oV,
    PlugZap2: () => f0,
    PlugZap: () => f0,
    Plug2: () => nV,
    Plug: () => iV,
    PlaySquare: () => b2,
    PlayCircle: () => T1,
    Play: () => cV,
    PlaneTakeoff: () => gV,
    PlaneLanding: () => mV,
    Plane: () => uV,
    Pizza: () => jV,
    Pipette: () => lV,
    PinOff: () => LV,
    Pin: () => RV,
    PillBottle: () => tV,
    Pill: () => UV,
    PilcrowSquare: () => h2,
    PilcrowRight: () => fV,
    PilcrowLeft: () => dV,
    Pilcrow: () => MV,
    PiggyBank: () => wV,
    PieChart: () => i,
    PictureInPicture2: () => bV,
    PictureInPicture: () => kV,
    Pickaxe: () => hV,
    Piano: () => CV,
    PiSquare: () => C2,
    Pi: () => qV,
    PhoneOutgoing: () => yV,
    PhoneOff: () => vV,
    PhoneMissed: () => SV,
    PhoneIncoming: () => BV,
    PhoneForwarded: () => AV,
    PhoneCall: () => FV,
    Phone: () => PV,
    PhilippinePeso: () => DV,
    PersonStanding: () => TV,
    PercentSquare: () => q2,
    PercentDiamond: () => d1,
    PercentCircle: () => O1,
    Percent: () => OV,
    Pentagon: () => zV,
    PencilRuler: () => xV,
    PencilOff: () => WV,
    PencilLine: () => GV,
    Pencil: () => HV,
    PenTool: () => VV,
    PenSquare: () => Y,
    PenOff: () => XV,
    PenLine: () => k0,
    PenBox: () => Y,
    Pen: () => w0,
    PcCase: () => KV,
    PawPrint: () => JV,
    PauseOctagon: () => A0,
    PauseCircle: () => z1,
    Pause: () => QV,
    PartyPopper: () => YV,
    ParkingSquareOff: () => y2,
    ParkingSquare: () => P2,
    ParkingMeter: () => ZV,
    ParkingCircleOff: () => x1,
    ParkingCircle: () => H1,
    Parentheses: () => _V,
    Paperclip: () => $V,
    PanelsTopLeft: () => b0,
    PanelsTopBottom: () => U0,
    PanelsRightBottom: () => NV,
    PanelsLeftRight: () => w1,
    PanelsLeftBottom: () => EV,
    PanelTopOpen: () => aX,
    PanelTopInactive: () => h0,
    PanelTopDashed: () => h0,
    PanelTopClose: () => pX,
    PanelTopBottomDashed: () => sX,
    PanelTop: () => IV,
    PanelRightOpen: () => rX,
    PanelRightInactive: () => C0,
    PanelRightDashed: () => C0,
    PanelRightClose: () => oX,
    PanelRight: () => eX,
    PanelLeftRightDashed: () => iX,
    PanelLeftOpen: () => P0,
    PanelLeftInactive: () => y0,
    PanelLeftDashed: () => y0,
    PanelLeftClose: () => v0,
    PanelLeft: () => q0,
    PanelBottomOpen: () => cX,
    PanelBottomInactive: () => S0,
    PanelBottomDashed: () => S0,
    PanelBottomClose: () => uX,
    PanelBottom: () => nX,
    Panda: () => gX,
    Palmtree: () => e2,
    Palette: () => mX,
    PaintbrushVertical: () => B0,
    Paintbrush2: () => B0,
    Paintbrush: () => jX,
    PaintRoller: () => lX,
    PaintBucket: () => RX,
    PackageX: () => tX,
    PackageSearch: () => UX,
    PackagePlus: () => MX,
    PackageOpen: () => dX,
    PackageMinus: () => fX,
    PackageCheck: () => kX,
    Package2: () => bX,
    Package: () => LX,
    Outdent: () => G,
    Origami: () => wX,
    Orbit: () => hX,
    Option: () => CX,
    Omega: () => qX,
    OctagonX: () => F0,
    OctagonPause: () => A0,
    OctagonMinus: () => yX,
    OctagonAlert: () => D0,
    Octagon: () => PX,
    NutOff: () => SX,
    Nut: () => vX,
    NotepadTextDashed: () => FX,
    NotepadText: () => BX,
    NotebookText: () => DX,
    NotebookTabs: () => TX,
    NotebookPen: () => OX,
    Notebook: () => AX,
    NonBinary: () => zX,
    Nfc: () => HX,
    Newspaper: () => xX,
    Network: () => WX,
    NavigationOff: () => VX,
    Navigation2Off: () => KX,
    Navigation2: () => XX,
    Navigation: () => GX,
    Music4: () => QX,
    Music3: () => YX,
    Music2: () => ZX,
    Music: () => JX,
    MoveVertical: () => $X,
    MoveUpRight: () => EX,
    MoveUpLeft: () => IX,
    MoveUp: () => NX,
    MoveRight: () => aK,
    MoveLeft: () => pK,
    MoveHorizontal: () => sK,
    MoveDownRight: () => rK,
    MoveDownLeft: () => oK,
    MoveDown: () => eK,
    MoveDiagonal2: () => nK,
    MoveDiagonal: () => iK,
    Move3d: () => T0,
    Move3D: () => T0,
    Move: () => _X,
    MousePointerSquareDashed: () => W2,
    MousePointerClick: () => gK,
    MousePointerBan: () => mK,
    MousePointer2: () => jK,
    MousePointer: () => uK,
    MouseOff: () => lK,
    Mouse: () => cK,
    MountainSnow: () => LK,
    Mountain: () => RK,
    MoreVertical: () => t1,
    MoreHorizontal: () => U1,
    MoonStar: () => tK,
    Moon: () => UK,
    MonitorX: () => dK,
    MonitorUp: () => fK,
    MonitorStop: () => wK,
    MonitorSpeaker: () => kK,
    MonitorSmartphone: () => bK,
    MonitorPlay: () => CK,
    MonitorPause: () => hK,
    MonitorOff: () => qK,
    MonitorDown: () => PK,
    MonitorDot: () => yK,
    MonitorCog: () => vK,
    MonitorCheck: () => SK,
    Monitor: () => MK,
    MinusSquare: () => S2,
    MinusCircle: () => W1,
    Minus: () => BK,
    Minimize2: () => DK,
    Minimize: () => FK,
    MilkOff: () => OK,
    Milk: () => AK,
    Milestone: () => zK,
    Microwave: () => TK,
    Microscope: () => HK,
    Microchip: () => xK,
    MicVocal: () => O0,
    MicOff: () => GK,
    Mic2: () => O0,
    Mic: () => WK,
    MessagesSquare: () => VK,
    MessageSquareX: () => XK,
    MessageSquareWarning: () => JK,
    MessageSquareText: () => YK,
    MessageSquareShare: () => QK,
    MessageSquareReply: () => ZK,
    MessageSquareQuote: () => _K,
    MessageSquarePlus: () => $K,
    MessageSquareOff: () => NK,
    MessageSquareMore: () => EK,
    MessageSquareLock: () => IK,
    MessageSquareHeart: () => aJ,
    MessageSquareDot: () => pJ,
    MessageSquareDiff: () => sJ,
    MessageSquareDashed: () => eJ,
    MessageSquareCode: () => oJ,
    MessageSquare: () => KK,
    MessageCircleX: () => iJ,
    MessageCircleWarning: () => nJ,
    MessageCircleReply: () => cJ,
    MessageCircleQuestionMark: () => z0,
    MessageCircleQuestion: () => z0,
    MessageCirclePlus: () => uJ,
    MessageCircleOff: () => gJ,
    MessageCircleMore: () => mJ,
    MessageCircleHeart: () => jJ,
    MessageCircleDashed: () => lJ,
    MessageCircleCode: () => RJ,
    MessageCircle: () => rJ,
    Merge: () => LJ,
    MenuSquare: () => B2,
    Menu: () => UJ,
    MemoryStick: () => tJ,
    Meh: () => MJ,
    MegaphoneOff: () => fJ,
    Megaphone: () => dJ,
    Medal: () => wJ,
    Maximize2: () => bJ,
    Maximize: () => kJ,
    Martini: () => hJ,
    MarsStroke: () => qJ,
    Mars: () => CJ,
    MapPlus: () => yJ,
    MapPinned: () => vJ,
    MapPinXInside: () => AJ,
    MapPinX: () => BJ,
    MapPinPlusInside: () => DJ,
    MapPinPlus: () => FJ,
    MapPinPen: () => H0,
    MapPinOff: () => TJ,
    MapPinMinusInside: () => zJ,
    MapPinMinus: () => OJ,
    MapPinHouse: () => HJ,
    MapPinCheckInside: () => WJ,
    MapPinCheck: () => xJ,
    MapPin: () => SJ,
    MapMinus: () => GJ,
    Map: () => PJ,
    Mails: () => VJ,
    Mailbox: () => XJ,
    MailX: () => JJ,
    MailWarning: () => QJ,
    MailSearch: () => YJ,
    MailQuestionMark: () => x0,
    MailQuestion: () => x0,
    MailPlus: () => ZJ,
    MailOpen: () => _J,
    MailMinus: () => $J,
    MailCheck: () => NJ,
    Mail: () => KJ,
    Magnet: () => EJ,
    MSquare: () => A2,
    Luggage: () => IJ,
    Lollipop: () => aQ,
    Logs: () => pQ,
    LogOut: () => sQ,
    LogIn: () => eQ,
    LockOpen: () => W0,
    LockKeyholeOpen: () => G0,
    LockKeyhole: () => oQ,
    Lock: () => rQ,
    LocationEdit: () => H0,
    LocateOff: () => nQ,
    LocateFixed: () => cQ,
    Locate: () => iQ,
    LoaderPinwheel: () => gQ,
    LoaderCircle: () => V0,
    Loader2: () => V0,
    Loader: () => uQ,
    ListX: () => jQ,
    ListVideo: () => lQ,
    ListTree: () => RQ,
    ListTodo: () => LQ,
    ListStart: () => UQ,
    ListRestart: () => tQ,
    ListPlus: () => MQ,
    ListOrdered: () => fQ,
    ListMusic: () => dQ,
    ListMinus: () => wQ,
    ListIndentIncrease: () => W,
    ListIndentDecrease: () => G,
    ListFilterPlus: () => kQ,
    ListFilter: () => bQ,
    ListEnd: () => hQ,
    ListCollapse: () => CQ,
    ListChevronsUpDown: () => qQ,
    ListChevronsDownUp: () => PQ,
    ListChecks: () => yQ,
    ListCheck: () => vQ,
    List: () => mQ,
    Linkedin: () => SQ,
    Link2Off: () => FQ,
    Link2: () => AQ,
    Link: () => BQ,
    LineSquiggle: () => DQ,
    LineChart: () => g,
    LightbulbOff: () => OQ,
    Lightbulb: () => TQ,
    Ligature: () => zQ,
    LifeBuoy: () => HQ,
    LibrarySquare: () => F2,
    LibraryBig: () => WQ,
    Library: () => xQ,
    LetterText: () => n2,
    Lectern: () => GQ,
    LeafyGreen: () => VQ,
    Leaf: () => XQ,
    LayoutTemplate: () => KQ,
    LayoutPanelTop: () => JQ,
    LayoutPanelLeft: () => QQ,
    LayoutList: () => YQ,
    LayoutGrid: () => ZQ,
    LayoutDashboard: () => _Q,
    Layout: () => b0,
    Layers3: () => X0,
    Layers2: () => $Q,
    Layers: () => X0,
    Laugh: () => NQ,
    LassoSelect: () => IQ,
    Lasso: () => EQ,
    LaptopMinimalCheck: () => pY,
    LaptopMinimal: () => K0,
    Laptop2: () => K0,
    Laptop: () => aY,
    Languages: () => sY,
    Landmark: () => eY,
    LandPlot: () => rY,
    LampWallUp: () => iY,
    LampWallDown: () => nY,
    LampFloor: () => cY,
    LampDesk: () => uY,
    LampCeiling: () => gY,
    Lamp: () => oY,
    KeyboardOff: () => jY,
    KeyboardMusic: () => lY,
    Keyboard: () => mY,
    KeySquare: () => LY,
    KeyRound: () => UY,
    Key: () => RY,
    Kayak: () => tY,
    KanbanSquareDashed: () => G2,
    KanbanSquare: () => D2,
    Kanban: () => MY,
    Joystick: () => dY,
    JapaneseYen: () => fY,
    IterationCw: () => wY,
    IterationCcw: () => kY,
    Italic: () => bY,
    Instagram: () => hY,
    InspectionPanel: () => CY,
    Inspect: () => v2,
    Info: () => qY,
    Infinity: () => PY,
    IndianRupee: () => yY,
    IndentIncrease: () => W,
    IndentDecrease: () => G,
    Indent: () => W,
    Inbox: () => vY,
    Import: () => SY,
    Images: () => BY,
    ImageUpscale: () => FY,
    ImageUp: () => DY,
    ImagePlus: () => TY,
    ImagePlay: () => OY,
    ImageOff: () => HY,
    ImageMinus: () => zY,
    ImageDown: () => xY,
    Image: () => AY,
    IdCardLanyard: () => GY,
    IdCard: () => WY,
    IceCreamCone: () => J0,
    IceCreamBowl: () => Q0,
    IceCream2: () => Q0,
    IceCream: () => J0,
    HouseWifi: () => VY,
    HousePlus: () => XY,
    HousePlug: () => KY,
    HouseHeart: () => JY,
    House: () => Y0,
    Hourglass: () => QY,
    Hotel: () => YY,
    Hospital: () => ZY,
    HopOff: () => $Y,
    Hop: () => _Y,
    Home: () => Y0,
    History: () => NY,
    Highlighter: () => EY,
    Hexagon: () => IY,
    HelpingHand: () => Z0,
    HelpCircle: () => K,
    Heater: () => aZ,
    HeartPulse: () => sZ,
    HeartPlus: () => eZ,
    HeartOff: () => rZ,
    HeartMinus: () => oZ,
    HeartHandshake: () => iZ,
    HeartCrack: () => nZ,
    Heart: () => pZ,
    Headset: () => cZ,
    Headphones: () => uZ,
    HeadphoneOff: () => gZ,
    Heading6: () => jZ,
    Heading5: () => lZ,
    Heading4: () => RZ,
    Heading3: () => LZ,
    Heading2: () => UZ,
    Heading1: () => tZ,
    Heading: () => mZ,
    HdmiPort: () => MZ,
    Haze: () => dZ,
    HatGlasses: () => fZ,
    Hash: () => wZ,
    HardHat: () => kZ,
    HardDriveUpload: () => hZ,
    HardDriveDownload: () => CZ,
    HardDrive: () => bZ,
    Handshake: () => PZ,
    Handbag: () => qZ,
    HandPlatter: () => vZ,
    HandMetal: () => SZ,
    HandHelping: () => Z0,
    HandHeart: () => BZ,
    HandGrab: () => _0,
    HandFist: () => AZ,
    HandCoins: () => FZ,
    Hand: () => yZ,
    Hammer: () => DZ,
    Hamburger: () => TZ,
    Ham: () => OZ,
    Guitar: () => zZ,
    Group: () => HZ,
    GripVertical: () => WZ,
    GripHorizontal: () => GZ,
    Grip: () => xZ,
    Grid3x3: () => V,
    Grid3x2: () => VZ,
    Grid3X3: () => V,
    Grid2x2X: () => N0,
    Grid2x2Plus: () => E0,
    Grid2x2Check: () => I0,
    Grid2x2: () => $0,
    Grid2X2X: () => N0,
    Grid2X2Plus: () => E0,
    Grid2X2Check: () => I0,
    Grid2X2: () => $0,
    Grid: () => V,
    Grape: () => XZ,
    GraduationCap: () => JZ,
    Grab: () => _0,
    Gpu: () => KZ,
    Goal: () => QZ,
    GlobeLock: () => ZZ,
    Globe2: () => M1,
    Globe: () => YZ,
    Glasses: () => _Z,
    GlassWater: () => $Z,
    Gitlab: () => NZ,
    Github: () => EZ,
    GitPullRequestDraft: () => a_,
    GitPullRequestCreateArrow: () => s_,
    GitPullRequestCreate: () => p_,
    GitPullRequestClosed: () => e_,
    GitPullRequestArrow: () => r_,
    GitPullRequest: () => IZ,
    GitMerge: () => o_,
    GitGraph: () => i_,
    GitFork: () => n_,
    GitCompareArrows: () => u_,
    GitCompare: () => c_,
    GitCommitVertical: () => g_,
    GitCommitHorizontal: () => a1,
    GitCommit: () => a1,
    GitBranchPlus: () => j_,
    GitBranch: () => m_,
    Gift: () => l_,
    Ghost: () => R_,
    GeorgianLari: () => L_,
    Gem: () => U_,
    Gavel: () => t_,
    GaugeCircle: () => G1,
    Gauge: () => M_,
    GanttChartSquare: () => x,
    GanttChart: () => n,
    Gamepad2: () => f_,
    Gamepad: () => d_,
    GalleryVerticalEnd: () => b_,
    GalleryVertical: () => w_,
    GalleryThumbnails: () => k_,
    GalleryHorizontalEnd: () => C_,
    GalleryHorizontal: () => h_,
    FunnelX: () => s1,
    FunnelPlus: () => q_,
    Funnel: () => p1,
    FunctionSquare: () => T2,
    Fullscreen: () => P_,
    Fuel: () => y_,
    Frown: () => v_,
    Framer: () => S_,
    Frame: () => A_,
    Forward: () => B_,
    FormInput: () => d0,
    Forklift: () => F_,
    ForkKnifeCrossed: () => Q5,
    ForkKnife: () => J5,
    Footprints: () => D_,
    Folders: () => T_,
    FolderX: () => H_,
    FolderUp: () => z_,
    FolderTree: () => x_,
    FolderSync: () => W_,
    FolderSymlink: () => G_,
    FolderSearch2: () => X_,
    FolderSearch: () => V_,
    FolderRoot: () => J_,
    FolderPlus: () => K_,
    FolderPen: () => e1,
    FolderOutput: () => Q_,
    FolderOpenDot: () => Z_,
    FolderOpen: () => Y_,
    FolderMinus: () => __,
    FolderLock: () => $_,
    FolderKey: () => N_,
    FolderKanban: () => I_,
    FolderInput: () => E_,
    FolderHeart: () => p$,
    FolderGit2: () => s$,
    FolderGit: () => a$,
    FolderEdit: () => e1,
    FolderDown: () => e$,
    FolderDot: () => r$,
    FolderCog2: () => r1,
    FolderCog: () => r1,
    FolderCode: () => o$,
    FolderClosed: () => i$,
    FolderClock: () => n$,
    FolderCheck: () => c$,
    FolderArchive: () => u$,
    Folder: () => O_,
    FoldVertical: () => g$,
    FoldHorizontal: () => m$,
    Focus: () => j$,
    Flower2: () => l$,
    Flower: () => R$,
    FlipVertical2: () => U$,
    FlipVertical: () => L$,
    FlipHorizontal2: () => M$,
    FlipHorizontal: () => t$,
    FlaskRound: () => d$,
    FlaskConicalOff: () => w$,
    FlaskConical: () => f$,
    FlashlightOff: () => b$,
    Flashlight: () => k$,
    FlameKindling: () => C$,
    Flame: () => h$,
    FlagTriangleRight: () => P$,
    FlagTriangleLeft: () => y$,
    FlagOff: () => v$,
    Flag: () => q$,
    FishSymbol: () => B$,
    FishOff: () => A$,
    Fish: () => S$,
    FireExtinguisher: () => F$,
    Fingerprint: () => D$,
    FilterX: () => s1,
    Filter: () => p1,
    Film: () => T$,
    Files: () => O$,
    FileX2: () => x$,
    FileX: () => H$,
    FileWarning: () => W$,
    FileVolume2: () => V$,
    FileVolume: () => G$,
    FileVideoCamera: () => o1,
    FileVideo2: () => o1,
    FileVideo: () => n1,
    FileUser: () => X$,
    FileUp: () => K$,
    FileType2: () => Q$,
    FileType: () => J$,
    FileText: () => Y$,
    FileTerminal: () => Z$,
    FileSymlink: () => _$,
    FileStack: () => $$,
    FileSpreadsheet: () => N$,
    FileSliders: () => E$,
    FileSignature: () => u1,
    FileSearch2: () => aN,
    FileSearch: () => I$,
    FileScan: () => pN,
    FileQuestionMark: () => i1,
    FileQuestion: () => i1,
    FilePlus2: () => eN,
    FilePlus: () => sN,
    FilePlay: () => n1,
    FilePieChart: () => m1,
    FilePenLine: () => u1,
    FilePen: () => c1,
    FileOutput: () => rN,
    FileMusic: () => oN,
    FileMinus2: () => nN,
    FileMinus: () => iN,
    FileLock2: () => cN,
    FileLock: () => uN,
    FileLineChart: () => j1,
    FileKey2: () => mN,
    FileKey: () => gN,
    FileJson2: () => lN,
    FileJson: () => jN,
    FileInput: () => RN,
    FileImage: () => UN,
    FileHeart: () => LN,
    FileEdit: () => c1,
    FileDown: () => tN,
    FileDigit: () => MN,
    FileDiff: () => dN,
    FileCog2: () => g1,
    FileCog: () => g1,
    FileCode2: () => wN,
    FileCode: () => fN,
    FileClock: () => kN,
    FileCheck2: () => bN,
    FileCheck: () => hN,
    FileChartPie: () => m1,
    FileChartLine: () => j1,
    FileChartColumnIncreasing: () => R1,
    FileChartColumn: () => l1,
    FileBox: () => CN,
    FileBarChart2: () => l1,
    FileBarChart: () => R1,
    FileBadge2: () => PN,
    FileBadge: () => qN,
    FileAxis3d: () => L1,
    FileAxis3D: () => L1,
    FileAudio2: () => SN,
    FileAudio: () => yN,
    FileArchive: () => vN,
    File: () => z$,
    Figma: () => BN,
    FerrisWheel: () => AN,
    Fence: () => FN,
    Feather: () => TN,
    FastForward: () => DN,
    Fan: () => ON,
    Factory: () => zN,
    Facebook: () => HN,
    EyeOff: () => WN,
    EyeClosed: () => GN,
    Eye: () => xN,
    ExternalLink: () => VN,
    Expand: () => XN,
    EvCharger: () => KN,
    Euro: () => JN,
    EthernetPort: () => QN,
    Eraser: () => YN,
    EqualSquare: () => O2,
    EqualNot: () => _N,
    EqualApproximately: () => $N,
    Equal: () => ZN,
    EllipsisVertical: () => t1,
    Ellipsis: () => U1,
    EggOff: () => EN,
    EggFried: () => IN,
    Egg: () => NN,
    Edit3: () => k0,
    Edit2: () => w0,
    Edit: () => Y,
    Eclipse: () => aE,
    EarthLock: () => pE,
    Earth: () => M1,
    EarOff: () => sE,
    Ear: () => eE,
    Dumbbell: () => rE,
    Drumstick: () => oE,
    Drum: () => iE,
    Droplets: () => nE,
    DropletOff: () => cE,
    Droplet: () => uE,
    Drone: () => gE,
    Drill: () => mE,
    Dribbble: () => jE,
    Drama: () => lE,
    DraftingCompass: () => RE,
    DownloadCloud: () => C1,
    Download: () => UE,
    DotSquare: () => H2,
    Dot: () => LE,
    DoorOpen: () => tE,
    DoorClosedLocked: () => dE,
    DoorClosed: () => ME,
    Donut: () => fE,
    DollarSign: () => wE,
    Dog: () => bE,
    Dock: () => kE,
    DnaOff: () => CE,
    Dna: () => hE,
    DivideSquare: () => z2,
    DivideCircle: () => V1,
    Divide: () => qE,
    DiscAlbum: () => yE,
    Disc3: () => vE,
    Disc2: () => SE,
    Disc: () => PE,
    Diff: () => BE,
    Dices: () => AE,
    Dice6: () => FE,
    Dice5: () => DE,
    Dice4: () => TE,
    Dice3: () => OE,
    Dice2: () => zE,
    Dice1: () => xE,
    DiamondPlus: () => WE,
    DiamondPercent: () => d1,
    DiamondMinus: () => GE,
    Diamond: () => HE,
    Diameter: () => VE,
    Dessert: () => XE,
    Delete: () => KE,
    DecimalsArrowRight: () => JE,
    DecimalsArrowLeft: () => QE,
    DatabaseZap: () => ZE,
    DatabaseBackup: () => _E,
    Database: () => YE,
    Dam: () => $E,
    Cylinder: () => NE,
    Currency: () => EE,
    CurlyBraces: () => d,
    CupSoda: () => IE,
    Cuboid: () => aI,
    Crown: () => pI,
    Crosshair: () => sI,
    Cross: () => eI,
    Crop: () => rI,
    Croissant: () => oI,
    CreditCard: () => iI,
    CreativeCommons: () => nI,
    Cpu: () => cI,
    CornerUpRight: () => uI,
    CornerUpLeft: () => gI,
    CornerRightUp: () => mI,
    CornerRightDown: () => jI,
    CornerLeftUp: () => lI,
    CornerLeftDown: () => RI,
    CornerDownRight: () => LI,
    CornerDownLeft: () => UI,
    Copyright: () => MI,
    Copyleft: () => tI,
    CopyX: () => fI,
    CopySlash: () => wI,
    CopyPlus: () => kI,
    CopyMinus: () => bI,
    CopyCheck: () => hI,
    Copy: () => dI,
    CookingPot: () => CI,
    Cookie: () => qI,
    Contrast: () => PI,
    Container: () => yI,
    ContactRound: () => f1,
    Contact2: () => f1,
    Contact: () => vI,
    Construction: () => SI,
    Cone: () => BI,
    ConciergeBell: () => AI,
    Computer: () => FI,
    Component: () => DI,
    Compass: () => OI,
    Command: () => TI,
    Combine: () => zI,
    ColumnsSettings: () => X,
    Columns4: () => HI,
    Columns3Cog: () => X,
    Columns3: () => w1,
    Columns2: () => k1,
    Columns: () => k1,
    Coins: () => xI,
    Cog: () => WI,
    Coffee: () => GI,
    Codesandbox: () => VI,
    Codepen: () => XI,
    CodeXml: () => b1,
    CodeSquare: () => V2,
    Code2: () => b1,
    Code: () => KI,
    Club: () => JI,
    Clover: () => QI,
    Cloudy: () => YI,
    CloudUpload: () => h1,
    CloudSunRain: () => $I,
    CloudSun: () => _I,
    CloudSnow: () => NI,
    CloudRainWind: () => II,
    CloudRain: () => EI,
    CloudOff: () => p3,
    CloudMoonRain: () => s3,
    CloudMoon: () => a3,
    CloudLightning: () => e3,
    CloudHail: () => r3,
    CloudFog: () => o3,
    CloudDrizzle: () => i3,
    CloudDownload: () => C1,
    CloudCog: () => n3,
    CloudCheck: () => c3,
    CloudAlert: () => u3,
    Cloud: () => ZI,
    ClosedCaption: () => g3,
    ClockPlus: () => j3,
    ClockFading: () => l3,
    ClockArrowUp: () => R3,
    ClockArrowDown: () => L3,
    ClockAlert: () => U3,
    Clock9: () => t3,
    Clock8: () => M3,
    Clock7: () => d3,
    Clock6: () => f3,
    Clock5: () => w3,
    Clock4: () => k3,
    Clock3: () => b3,
    Clock2: () => h3,
    Clock12: () => C3,
    Clock11: () => q3,
    Clock10: () => P3,
    Clock1: () => y3,
    Clock: () => m3,
    ClipboardX: () => S3,
    ClipboardType: () => B3,
    ClipboardSignature: () => P1,
    ClipboardPlus: () => A3,
    ClipboardPenLine: () => P1,
    ClipboardPen: () => q1,
    ClipboardPaste: () => F3,
    ClipboardMinus: () => D3,
    ClipboardList: () => T3,
    ClipboardEdit: () => q1,
    ClipboardCopy: () => O3,
    ClipboardClock: () => z3,
    ClipboardCheck: () => H3,
    Clipboard: () => v3,
    Clapperboard: () => x3,
    Citrus: () => W3,
    CircuitBoard: () => G3,
    CircleX: () => y1,
    CircleUserRound: () => S1,
    CircleUser: () => v1,
    CircleStop: () => B1,
    CircleStar: () => X3,
    CircleSmall: () => K3,
    CircleSlashed: () => A1,
    CircleSlash2: () => A1,
    CircleSlash: () => J3,
    CircleQuestionMark: () => K,
    CirclePower: () => F1,
    CirclePoundSterling: () => Q3,
    CirclePlus: () => D1,
    CirclePlay: () => T1,
    CirclePercent: () => O1,
    CirclePause: () => z1,
    CircleParkingOff: () => x1,
    CircleParking: () => H1,
    CircleOff: () => Y3,
    CircleMinus: () => W1,
    CircleHelp: () => K,
    CircleGauge: () => G1,
    CircleFadingPlus: () => Z3,
    CircleFadingArrowUp: () => _3,
    CircleEqual: () => $3,
    CircleEllipsis: () => E3,
    CircleDotDashed: () => I3,
    CircleDot: () => N3,
    CircleDollarSign: () => a9,
    CircleDivide: () => V1,
    CircleDashed: () => p9,
    CircleChevronUp: () => X1,
    CircleChevronRight: () => K1,
    CircleChevronLeft: () => J1,
    CircleChevronDown: () => Q1,
    CircleCheckBig: () => Z1,
    CircleCheck: () => Y1,
    CircleArrowUp: () => _1,
    CircleArrowRight: () => $1,
    CircleArrowOutUpRight: () => N1,
    CircleArrowOutUpLeft: () => E1,
    CircleArrowOutDownRight: () => I1,
    CircleArrowOutDownLeft: () => a,
    CircleArrowLeft: () => p,
    CircleArrowDown: () => s,
    CircleAlert: () => e,
    Circle: () => V3,
    CigaretteOff: () => e9,
    Cigarette: () => s9,
    Church: () => r9,
    Chromium: () => r,
    Chrome: () => r,
    ChevronsUpDown: () => i9,
    ChevronsUp: () => o9,
    ChevronsRightLeft: () => c9,
    ChevronsRight: () => n9,
    ChevronsLeftRightEllipsis: () => m9,
    ChevronsLeftRight: () => g9,
    ChevronsLeft: () => u9,
    ChevronsDownUp: () => l9,
    ChevronsDown: () => j9,
    ChevronUpSquare: () => X2,
    ChevronUpCircle: () => X1,
    ChevronUp: () => R9,
    ChevronRightSquare: () => K2,
    ChevronRightCircle: () => K1,
    ChevronRight: () => U9,
    ChevronLeftSquare: () => J2,
    ChevronLeftCircle: () => J1,
    ChevronLeft: () => t9,
    ChevronLast: () => L9,
    ChevronFirst: () => d9,
    ChevronDownSquare: () => Q2,
    ChevronDownCircle: () => Q1,
    ChevronDown: () => M9,
    Cherry: () => f9,
    ChefHat: () => w9,
    CheckSquare2: () => Y2,
    CheckSquare: () => Z2,
    CheckLine: () => b9,
    CheckCircle2: () => Y1,
    CheckCircle: () => Z1,
    CheckCheck: () => h9,
    Check: () => k9,
    ChartSpline: () => C9,
    ChartScatter: () => o,
    ChartPie: () => i,
    ChartNoAxesGantt: () => n,
    ChartNoAxesCombined: () => q9,
    ChartNoAxesColumnIncreasing: () => u,
    ChartNoAxesColumnDecreasing: () => P9,
    ChartNoAxesColumn: () => c,
    ChartNetwork: () => y9,
    ChartLine: () => g,
    ChartGantt: () => v9,
    ChartColumnStacked: () => S9,
    ChartColumnIncreasing: () => j,
    ChartColumnDecreasing: () => B9,
    ChartColumnBig: () => l,
    ChartColumn: () => m,
    ChartCandlestick: () => R,
    ChartBarStacked: () => A9,
    ChartBarIncreasing: () => F9,
    ChartBarDecreasing: () => D9,
    ChartBarBig: () => U,
    ChartBar: () => L,
    ChartArea: () => t,
    Cctv: () => T9,
    Cat: () => O9,
    Castle: () => z9,
    Cast: () => H9,
    CassetteTape: () => x9,
    CaseUpper: () => W9,
    CaseSensitive: () => G9,
    CaseLower: () => V9,
    Carrot: () => X9,
    CardSim: () => K9,
    Caravan: () => J9,
    CarTaxiFront: () => Y9,
    CarFront: () => Z9,
    Car: () => Q9,
    CaptionsOff: () => $9,
    Captions: () => M,
    Cannabis: () => _9,
    CandyOff: () => E9,
    CandyCane: () => I9,
    Candy: () => N9,
    CandlestickChart: () => R,
    CameraOff: () => p8,
    Camera: () => a8,
    CalendarX2: () => r8,
    CalendarX: () => e8,
    CalendarSync: () => i8,
    CalendarSearch: () => o8,
    CalendarRange: () => n8,
    CalendarPlus2: () => u8,
    CalendarPlus: () => c8,
    CalendarOff: () => g8,
    CalendarMinus2: () => j8,
    CalendarMinus: () => m8,
    CalendarHeart: () => l8,
    CalendarFold: () => R8,
    CalendarDays: () => L8,
    CalendarCog: () => U8,
    CalendarClock: () => t8,
    CalendarCheck2: () => d8,
    CalendarCheck: () => M8,
    CalendarArrowUp: () => f8,
    CalendarArrowDown: () => w8,
    Calendar1: () => b8,
    Calendar: () => s8,
    Calculator: () => h8,
    CakeSlice: () => C8,
    Cake: () => k8,
    CableCar: () => P8,
    Cable: () => q8,
    BusFront: () => S8,
    Bus: () => y8,
    Building2: () => B8,
    Building: () => v8,
    BugPlay: () => F8,
    BugOff: () => D8,
    Bug: () => A8,
    Bubbles: () => T8,
    BrushCleaning: () => z8,
    Brush: () => O8,
    BringToFront: () => H8,
    BriefcaseMedical: () => W8,
    BriefcaseConveyorBelt: () => G8,
    BriefcaseBusiness: () => V8,
    Briefcase: () => x8,
    BrickWallShield: () => K8,
    BrickWallFire: () => J8,
    BrickWall: () => X8,
    BrainCog: () => Y8,
    BrainCircuit: () => Z8,
    Brain: () => Q8,
    Brackets: () => _8,
    Braces: () => d,
    Boxes: () => $8,
    BoxSelect: () => x2,
    Box: () => N8,
    BowArrow: () => E8,
    BottleWine: () => I8,
    BotOff: () => p7,
    BotMessageSquare: () => s7,
    Bot: () => a7,
    BoomBox: () => e7,
    BookmarkX: () => o7,
    BookmarkPlus: () => i7,
    BookmarkMinus: () => n7,
    BookmarkCheck: () => c7,
    Bookmark: () => r7,
    BookX: () => g7,
    BookUser: () => m7,
    BookUp2: () => l7,
    BookUp: () => j7,
    BookType: () => R7,
    BookText: () => L7,
    BookTemplate: () => f,
    BookPlus: () => U7,
    BookOpenText: () => M7,
    BookOpenCheck: () => d7,
    BookOpen: () => t7,
    BookMinus: () => f7,
    BookMarked: () => w7,
    BookLock: () => k7,
    BookKey: () => b7,
    BookImage: () => h7,
    BookHeart: () => C7,
    BookHeadphones: () => q7,
    BookDown: () => P7,
    BookDashed: () => f,
    BookCopy: () => y7,
    BookCheck: () => v7,
    BookAudio: () => S7,
    BookAlert: () => B7,
    BookA: () => A7,
    Book: () => u7,
    Bone: () => F7,
    Bomb: () => D7,
    Bolt: () => T7,
    Bold: () => z7,
    BluetoothSearching: () => H7,
    BluetoothOff: () => x7,
    BluetoothConnected: () => W7,
    Bluetooth: () => O7,
    Blocks: () => G7,
    Blinds: () => V7,
    Blend: () => X7,
    Bitcoin: () => K7,
    Bird: () => J7,
    Biohazard: () => Q7,
    Binoculars: () => Y7,
    Binary: () => Z7,
    Bike: () => $7,
    BicepsFlexed: () => _7,
    BetweenVerticalStart: () => N7,
    BetweenVerticalEnd: () => E7,
    BetweenHorizontalStart: () => w,
    BetweenHorizontalEnd: () => k,
    BetweenHorizonalStart: () => w,
    BetweenHorizonalEnd: () => k,
    BellRing: () => a6,
    BellPlus: () => p6,
    BellOff: () => s6,
    BellMinus: () => e6,
    BellElectric: () => r6,
    BellDot: () => o6,
    Bell: () => I7,
    BeerOff: () => n6,
    Beer: () => i6,
    Beef: () => c6,
    BedSingle: () => g6,
    BedDouble: () => m6,
    Bed: () => u6,
    BeanOff: () => l6,
    Bean: () => j6,
    Beaker: () => R6,
    BatteryWarning: () => U6,
    BatteryPlus: () => t6,
    BatteryMedium: () => M6,
    BatteryLow: () => d6,
    BatteryFull: () => f6,
    BatteryCharging: () => w6,
    Battery: () => L6,
    Bath: () => k6,
    Baseline: () => b6,
    Barrel: () => h6,
    Barcode: () => C6,
    BarChartHorizontalBig: () => U,
    BarChartHorizontal: () => L,
    BarChartBig: () => l,
    BarChart4: () => j,
    BarChart3: () => m,
    BarChart2: () => c,
    BarChart: () => u,
    BanknoteX: () => P6,
    BanknoteArrowUp: () => y6,
    BanknoteArrowDown: () => v6,
    Banknote: () => q6,
    Bandage: () => S6,
    Banana: () => B6,
    Ban: () => A6,
    BaggageClaim: () => F6,
    BadgeX: () => T6,
    BadgeTurkishLira: () => O6,
    BadgeSwissFranc: () => z6,
    BadgeRussianRuble: () => H6,
    BadgeQuestionMark: () => b,
    BadgePoundSterling: () => x6,
    BadgePlus: () => W6,
    BadgePercent: () => G6,
    BadgeMinus: () => V6,
    BadgeJapaneseYen: () => X6,
    BadgeInfo: () => K6,
    BadgeIndianRupee: () => J6,
    BadgeHelp: () => b,
    BadgeEuro: () => Q6,
    BadgeDollarSign: () => Z6,
    BadgeCheck: () => h,
    BadgeCent: () => Y6,
    BadgeAlert: () => _6,
    Badge: () => D6,
    Backpack: () => $6,
    Baby: () => N6,
    Axis3d: () => C,
    Axis3D: () => C,
    Axe: () => E6,
    Award: () => a4,
    AudioWaveform: () => I6,
    AudioLines: () => p4,
    Atom: () => s4,
    AtSign: () => e4,
    AsteriskSquare: () => $2,
    Asterisk: () => r4,
    ArrowsUpFromLine: () => o4,
    ArrowUpZa: () => q,
    ArrowUpZA: () => q,
    ArrowUpWideNarrow: () => n4,
    ArrowUpToLine: () => c4,
    ArrowUpSquare: () => N2,
    ArrowUpRightSquare: () => E2,
    ArrowUpRightFromSquare: () => p0,
    ArrowUpRightFromCircle: () => N1,
    ArrowUpRight: () => u4,
    ArrowUpNarrowWide: () => P,
    ArrowUpLeftSquare: () => I2,
    ArrowUpLeftFromSquare: () => e0,
    ArrowUpLeftFromCircle: () => E1,
    ArrowUpLeft: () => g4,
    ArrowUpFromLine: () => m4,
    ArrowUpFromDot: () => j4,
    ArrowUpDown: () => l4,
    ArrowUpCircle: () => _1,
    ArrowUpAz: () => y,
    ArrowUpAZ: () => y,
    ArrowUp10: () => R4,
    ArrowUp01: () => L4,
    ArrowUp: () => i4,
    ArrowRightToLine: () => t4,
    ArrowRightSquare: () => a0,
    ArrowRightLeft: () => M4,
    ArrowRightFromLine: () => d4,
    ArrowRightCircle: () => $1,
    ArrowRight: () => U4,
    ArrowLeftToLine: () => w4,
    ArrowLeftSquare: () => o0,
    ArrowLeftRight: () => k4,
    ArrowLeftFromLine: () => b4,
    ArrowLeftCircle: () => p,
    ArrowLeft: () => f4,
    ArrowDownZa: () => v,
    ArrowDownZA: () => v,
    ArrowDownWideNarrow: () => S,
    ArrowDownUp: () => C4,
    ArrowDownToLine: () => q4,
    ArrowDownToDot: () => P4,
    ArrowDownSquare: () => i0,
    ArrowDownRightSquare: () => n0,
    ArrowDownRightFromSquare: () => s0,
    ArrowDownRightFromCircle: () => I1,
    ArrowDownRight: () => y4,
    ArrowDownNarrowWide: () => S4,
    ArrowDownLeftSquare: () => c0,
    ArrowDownLeftFromSquare: () => r0,
    ArrowDownLeftFromCircle: () => a,
    ArrowDownLeft: () => v4,
    ArrowDownFromLine: () => B4,
    ArrowDownCircle: () => s,
    ArrowDownAz: () => B,
    ArrowDownAZ: () => B,
    ArrowDown10: () => A4,
    ArrowDown01: () => F4,
    ArrowDown: () => h4,
    ArrowBigUpDash: () => T4,
    ArrowBigUp: () => D4,
    ArrowBigRightDash: () => z4,
    ArrowBigRight: () => O4,
    ArrowBigLeftDash: () => x4,
    ArrowBigLeft: () => H4,
    ArrowBigDownDash: () => G4,
    ArrowBigDown: () => W4,
    Armchair: () => X4,
    AreaChart: () => t,
    ArchiveX: () => K4,
    ArchiveRestore: () => J4,
    Archive: () => V4,
    Apple: () => Q4,
    AppWindowMac: () => Z4,
    AppWindow: () => Y4,
    Aperture: () => _4,
    Anvil: () => $4,
    Antenna: () => N4,
    Annoyed: () => E4,
    Angry: () => I4,
    Anchor: () => a5,
    Amphora: () => p5,
    Ampersands: () => s5,
    Ampersand: () => e5,
    Ambulance: () => r5,
    AlignVerticalSpaceBetween: () => o5,
    AlignVerticalSpaceAround: () => i5,
    AlignVerticalJustifyStart: () => n5,
    AlignVerticalJustifyEnd: () => c5,
    AlignVerticalJustifyCenter: () => u5,
    AlignVerticalDistributeStart: () => g5,
    AlignVerticalDistributeEnd: () => m5,
    AlignVerticalDistributeCenter: () => j5,
    AlignStartVertical: () => l5,
    AlignStartHorizontal: () => R5,
    AlignRight: () => u2,
    AlignLeft: () => H,
    AlignJustify: () => c2,
    AlignHorizontalSpaceBetween: () => L5,
    AlignHorizontalSpaceAround: () => U5,
    AlignHorizontalJustifyStart: () => t5,
    AlignHorizontalJustifyEnd: () => M5,
    AlignHorizontalJustifyCenter: () => d5,
    AlignHorizontalDistributeStart: () => f5,
    AlignHorizontalDistributeEnd: () => w5,
    AlignHorizontalDistributeCenter: () => k5,
    AlignEndVertical: () => b5,
    AlignEndHorizontal: () => h5,
    AlignCenterVertical: () => C5,
    AlignCenterHorizontal: () => q5,
    AlignCenter: () => g2,
    AlertTriangle: () => s2,
    AlertOctagon: () => D0,
    AlertCircle: () => e,
    Album: () => P5,
    AlarmSmoke: () => y5,
    AlarmPlus: () => A,
    AlarmMinus: () => F,
    AlarmClockPlus: () => A,
    AlarmClockOff: () => S5,
    AlarmClockMinus: () => F,
    AlarmClockCheck: () => D,
    AlarmClock: () => v5,
    AlarmCheck: () => D,
    Airplay: () => B5,
    AirVent: () => A5,
    ActivitySquare: () => u0,
    Activity: () => F5,
    Accessibility: () => D5,
    ALargeSmall: () => T5,
    AArrowUp: () => O5,
    AArrowDown: () => z5,
});
var z5 = [
    ["path", { d: "m14 12 4 4 4-4" }],
    ["path", { d: "M18 16V7" }],
    ["path", { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" }],
    ["path", { d: "M3.304 13h6.392" }],
];
var O5 = [
    ["path", { d: "m14 11 4-4 4 4" }],
    ["path", { d: "M18 16V7" }],
    ["path", { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" }],
    ["path", { d: "M3.304 13h6.392" }],
];
var T5 = [
    ["path", { d: "m15 16 2.536-7.328a1.02 1.02 1 0 1 1.928 0L22 16" }],
    ["path", { d: "M15.697 14h5.606" }],
    ["path", { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" }],
    ["path", { d: "M3.304 13h6.392" }],
];
var D5 = [
    ["circle", { cx: "16", cy: "4", r: "1" }],
    ["path", { d: "m18 19 1-7-6 1" }],
    ["path", { d: "m5 8 3-3 5.5 3-2.36 3.5" }],
    ["path", { d: "M4.24 14.5a5 5 0 0 0 6.88 6" }],
    ["path", { d: "M13.76 17.5a5 5 0 0 0-6.88-6" }],
];
var F5 = [
    [
        "path",
        {
            d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
        },
    ],
];
var A5 = [
    ["path", { d: "M18 17.5a2.5 2.5 0 1 1-4 2.03V12" }],
    [
        "path",
        {
            d: "M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
        },
    ],
    ["path", { d: "M6 8h12" }],
    ["path", { d: "M6.6 15.572A2 2 0 1 0 10 17v-5" }],
];
var B5 = [
    [
        "path",
        {
            d: "M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1",
        },
    ],
    ["path", { d: "m12 15 5 6H7Z" }],
];
var D = [
    ["circle", { cx: "12", cy: "13", r: "8" }],
    ["path", { d: "M5 3 2 6" }],
    ["path", { d: "m22 6-3-3" }],
    ["path", { d: "M6.38 18.7 4 21" }],
    ["path", { d: "M17.64 18.67 20 21" }],
    ["path", { d: "m9 13 2 2 4-4" }],
];
var F = [
    ["circle", { cx: "12", cy: "13", r: "8" }],
    ["path", { d: "M5 3 2 6" }],
    ["path", { d: "m22 6-3-3" }],
    ["path", { d: "M6.38 18.7 4 21" }],
    ["path", { d: "M17.64 18.67 20 21" }],
    ["path", { d: "M9 13h6" }],
];
var S5 = [
    ["path", { d: "M6.87 6.87a8 8 0 1 0 11.26 11.26" }],
    ["path", { d: "M19.9 14.25a8 8 0 0 0-9.15-9.15" }],
    ["path", { d: "m22 6-3-3" }],
    ["path", { d: "M6.26 18.67 4 21" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M4 4 2 6" }],
];
var A = [
    ["circle", { cx: "12", cy: "13", r: "8" }],
    ["path", { d: "M5 3 2 6" }],
    ["path", { d: "m22 6-3-3" }],
    ["path", { d: "M6.38 18.7 4 21" }],
    ["path", { d: "M17.64 18.67 20 21" }],
    ["path", { d: "M12 10v6" }],
    ["path", { d: "M9 13h6" }],
];
var v5 = [
    ["circle", { cx: "12", cy: "13", r: "8" }],
    ["path", { d: "M12 9v4l2 2" }],
    ["path", { d: "M5 3 2 6" }],
    ["path", { d: "m22 6-3-3" }],
    ["path", { d: "M6.38 18.7 4 21" }],
    ["path", { d: "M17.64 18.67 20 21" }],
];
var y5 = [
    ["path", { d: "M11 21c0-2.5 2-2.5 2-5" }],
    ["path", { d: "M16 21c0-2.5 2-2.5 2-5" }],
    [
        "path",
        { d: "m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8" },
    ],
    [
        "path",
        {
            d: "M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z",
        },
    ],
    ["path", { d: "M6 21c0-2.5 2-2.5 2-5" }],
];
var P5 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["polyline", { points: "11 3 11 11 14 8 17 11 17 3" }],
];
var q5 = [
    ["path", { d: "M2 12h20" }],
    ["path", { d: "M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1" }],
    ["path", { d: "M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1" }],
];
var C5 = [
    ["path", { d: "M12 2v20" }],
    ["path", { d: "M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4" }],
    ["path", { d: "M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4" }],
    ["path", { d: "M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1" }],
    ["path", { d: "M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" }],
];
var h5 = [
    ["rect", { width: "6", height: "16", x: "4", y: "2", rx: "2" }],
    ["rect", { width: "6", height: "9", x: "14", y: "9", rx: "2" }],
    ["path", { d: "M22 22H2" }],
];
var b5 = [
    ["rect", { width: "16", height: "6", x: "2", y: "4", rx: "2" }],
    ["rect", { width: "9", height: "6", x: "9", y: "14", rx: "2" }],
    ["path", { d: "M22 22V2" }],
];
var k5 = [
    ["rect", { width: "6", height: "14", x: "4", y: "5", rx: "2" }],
    ["rect", { width: "6", height: "10", x: "14", y: "7", rx: "2" }],
    ["path", { d: "M17 22v-5" }],
    ["path", { d: "M17 7V2" }],
    ["path", { d: "M7 22v-3" }],
    ["path", { d: "M7 5V2" }],
];
var w5 = [
    ["rect", { width: "6", height: "14", x: "4", y: "5", rx: "2" }],
    ["rect", { width: "6", height: "10", x: "14", y: "7", rx: "2" }],
    ["path", { d: "M10 2v20" }],
    ["path", { d: "M20 2v20" }],
];
var f5 = [
    ["rect", { width: "6", height: "14", x: "4", y: "5", rx: "2" }],
    ["rect", { width: "6", height: "10", x: "14", y: "7", rx: "2" }],
    ["path", { d: "M4 2v20" }],
    ["path", { d: "M14 2v20" }],
];
var d5 = [
    ["rect", { width: "6", height: "14", x: "2", y: "5", rx: "2" }],
    ["rect", { width: "6", height: "10", x: "16", y: "7", rx: "2" }],
    ["path", { d: "M12 2v20" }],
];
var M5 = [
    ["rect", { width: "6", height: "14", x: "2", y: "5", rx: "2" }],
    ["rect", { width: "6", height: "10", x: "12", y: "7", rx: "2" }],
    ["path", { d: "M22 2v20" }],
];
var t5 = [
    ["rect", { width: "6", height: "14", x: "6", y: "5", rx: "2" }],
    ["rect", { width: "6", height: "10", x: "16", y: "7", rx: "2" }],
    ["path", { d: "M2 2v20" }],
];
var U5 = [
    ["rect", { width: "6", height: "10", x: "9", y: "7", rx: "2" }],
    ["path", { d: "M4 22V2" }],
    ["path", { d: "M20 22V2" }],
];
var L5 = [
    ["rect", { width: "6", height: "14", x: "3", y: "5", rx: "2" }],
    ["rect", { width: "6", height: "10", x: "15", y: "7", rx: "2" }],
    ["path", { d: "M3 2v20" }],
    ["path", { d: "M21 2v20" }],
];
var R5 = [
    ["rect", { width: "6", height: "16", x: "4", y: "6", rx: "2" }],
    ["rect", { width: "6", height: "9", x: "14", y: "6", rx: "2" }],
    ["path", { d: "M22 2H2" }],
];
var l5 = [
    ["rect", { width: "9", height: "6", x: "6", y: "14", rx: "2" }],
    ["rect", { width: "16", height: "6", x: "6", y: "4", rx: "2" }],
    ["path", { d: "M2 2v20" }],
];
var j5 = [
    ["path", { d: "M22 17h-3" }],
    ["path", { d: "M22 7h-5" }],
    ["path", { d: "M5 17H2" }],
    ["path", { d: "M7 7H2" }],
    ["rect", { x: "5", y: "14", width: "14", height: "6", rx: "2" }],
    ["rect", { x: "7", y: "4", width: "10", height: "6", rx: "2" }],
];
var m5 = [
    ["rect", { width: "14", height: "6", x: "5", y: "14", rx: "2" }],
    ["rect", { width: "10", height: "6", x: "7", y: "4", rx: "2" }],
    ["path", { d: "M2 20h20" }],
    ["path", { d: "M2 10h20" }],
];
var g5 = [
    ["rect", { width: "14", height: "6", x: "5", y: "14", rx: "2" }],
    ["rect", { width: "10", height: "6", x: "7", y: "4", rx: "2" }],
    ["path", { d: "M2 14h20" }],
    ["path", { d: "M2 4h20" }],
];
var u5 = [
    ["rect", { width: "14", height: "6", x: "5", y: "16", rx: "2" }],
    ["rect", { width: "10", height: "6", x: "7", y: "2", rx: "2" }],
    ["path", { d: "M2 12h20" }],
];
var c5 = [
    ["rect", { width: "14", height: "6", x: "5", y: "12", rx: "2" }],
    ["rect", { width: "10", height: "6", x: "7", y: "2", rx: "2" }],
    ["path", { d: "M2 22h20" }],
];
var n5 = [
    ["rect", { width: "14", height: "6", x: "5", y: "16", rx: "2" }],
    ["rect", { width: "10", height: "6", x: "7", y: "6", rx: "2" }],
    ["path", { d: "M2 2h20" }],
];
var i5 = [
    ["rect", { width: "10", height: "6", x: "7", y: "9", rx: "2" }],
    ["path", { d: "M22 20H2" }],
    ["path", { d: "M22 4H2" }],
];
var o5 = [
    ["rect", { width: "14", height: "6", x: "5", y: "15", rx: "2" }],
    ["rect", { width: "10", height: "6", x: "7", y: "3", rx: "2" }],
    ["path", { d: "M2 21h20" }],
    ["path", { d: "M2 3h20" }],
];
var r5 = [
    ["path", { d: "M10 10H6" }],
    [
        "path",
        { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" },
    ],
    [
        "path",
        {
            d: "M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14",
        },
    ],
    ["path", { d: "M8 8v4" }],
    ["path", { d: "M9 18h6" }],
    ["circle", { cx: "17", cy: "18", r: "2" }],
    ["circle", { cx: "7", cy: "18", r: "2" }],
];
var e5 = [
    [
        "path",
        {
            d: "M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13",
        },
    ],
    ["path", { d: "M16 12h3" }],
];
var s5 = [
    [
        "path",
        {
            d: "M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",
        },
    ],
    [
        "path",
        {
            d: "M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5",
        },
    ],
];
var p5 = [
    [
        "path",
        {
            d: "M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8",
        },
    ],
    ["path", { d: "M10 5H8a2 2 0 0 0 0 4h.68" }],
    [
        "path",
        { d: "M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" },
    ],
    ["path", { d: "M14 5h2a2 2 0 0 1 0 4h-.68" }],
    ["path", { d: "M18 22H6" }],
    ["path", { d: "M9 2h6" }],
];
var a5 = [
    ["path", { d: "M12 22V8" }],
    ["path", { d: "M5 12H2a10 10 0 0 0 20 0h-3" }],
    ["circle", { cx: "12", cy: "5", r: "3" }],
];
var I4 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2" }],
    ["path", { d: "M7.5 8 10 9" }],
    ["path", { d: "m14 9 2.5-1" }],
    ["path", { d: "M9 10h.01" }],
    ["path", { d: "M15 10h.01" }],
];
var E4 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M8 15h8" }],
    ["path", { d: "M8 9h2" }],
    ["path", { d: "M14 9h2" }],
];
var N4 = [
    ["path", { d: "M2 12 7 2" }],
    ["path", { d: "m7 12 5-10" }],
    ["path", { d: "m12 12 5-10" }],
    ["path", { d: "m17 12 5-10" }],
    ["path", { d: "M4.5 7h15" }],
    ["path", { d: "M12 16v6" }],
];
var $4 = [
    ["path", { d: "M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4" }],
    [
        "path",
        {
            d: "M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z",
        },
    ],
    ["path", { d: "M9 12v5" }],
    ["path", { d: "M15 12v5" }],
    [
        "path",
        {
            d: "M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1",
        },
    ],
];
var _4 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m14.31 8 5.74 9.94" }],
    ["path", { d: "M9.69 8h11.48" }],
    ["path", { d: "m7.38 12 5.74-9.94" }],
    ["path", { d: "M9.69 16 3.95 6.06" }],
    ["path", { d: "M14.31 16H2.83" }],
    ["path", { d: "m16.62 12-5.74 9.94" }],
];
var Z4 = [
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["path", { d: "M6 8h.01" }],
    ["path", { d: "M10 8h.01" }],
    ["path", { d: "M14 8h.01" }],
];
var Y4 = [
    ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }],
    ["path", { d: "M10 4v4" }],
    ["path", { d: "M2 8h20" }],
    ["path", { d: "M6 4v4" }],
];
var Q4 = [
    ["path", { d: "M12 6.528V3a1 1 0 0 1 1-1h0" }],
    [
        "path",
        {
            d: "M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21",
        },
    ],
];
var J4 = [
    ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }],
    ["path", { d: "M4 8v11a2 2 0 0 0 2 2h2" }],
    ["path", { d: "M20 8v11a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "m9 15 3-3 3 3" }],
    ["path", { d: "M12 12v9" }],
];
var K4 = [
    ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }],
    ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
    ["path", { d: "m9.5 17 5-5" }],
    ["path", { d: "m9.5 12 5 5" }],
];
var X4 = [
    ["path", { d: "M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" }],
    [
        "path",
        {
            d: "M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z",
        },
    ],
    ["path", { d: "M5 18v2" }],
    ["path", { d: "M19 18v2" }],
];
var V4 = [
    ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }],
    ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
    ["path", { d: "M10 12h4" }],
];
var G4 = [
    [
        "path",
        {
            d: "M15 11a1 1 0 0 0 1 1h2.939a1 1 0 0 1 .75 1.811l-6.835 6.836a1.207 1.207 0 0 1-1.707 0L4.31 13.81a1 1 0 0 1 .75-1.811H8a1 1 0 0 0 1-1V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M9 4h6" }],
];
var W4 = [
    [
        "path",
        {
            d: "M15 11a1 1 0 0 0 1 1h2.939a1 1 0 0 1 .75 1.811l-6.835 6.836a1.207 1.207 0 0 1-1.707 0L4.31 13.81a1 1 0 0 1 .75-1.811H8a1 1 0 0 0 1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1z",
        },
    ],
];
var x4 = [
    [
        "path",
        {
            d: "M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h2a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z",
        },
    ],
    ["path", { d: "M20 9v6" }],
];
var H4 = [
    [
        "path",
        {
            d: "M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z",
        },
    ],
];
var z4 = [
    [
        "path",
        {
            d: "M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H9a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
        },
    ],
    ["path", { d: "M4 9v6" }],
];
var O4 = [
    [
        "path",
        {
            d: "M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
        },
    ],
];
var T4 = [
    [
        "path",
        {
            d: "M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z",
        },
    ],
    ["path", { d: "M9 20h6" }],
];
var D4 = [
    [
        "path",
        {
            d: "M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z",
        },
    ],
];
var F4 = [
    ["path", { d: "m3 16 4 4 4-4" }],
    ["path", { d: "M7 20V4" }],
    ["rect", { x: "15", y: "4", width: "4", height: "6", ry: "2" }],
    ["path", { d: "M17 20v-6h-2" }],
    ["path", { d: "M15 20h4" }],
];
var A4 = [
    ["path", { d: "m3 16 4 4 4-4" }],
    ["path", { d: "M7 20V4" }],
    ["path", { d: "M17 10V4h-2" }],
    ["path", { d: "M15 10h4" }],
    ["rect", { x: "15", y: "14", width: "4", height: "6", ry: "2" }],
];
var B = [
    ["path", { d: "m3 16 4 4 4-4" }],
    ["path", { d: "M7 20V4" }],
    ["path", { d: "M20 8h-5" }],
    ["path", { d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10" }],
    ["path", { d: "M15 14h5l-5 6h5" }],
];
var B4 = [
    ["path", { d: "M19 3H5" }],
    ["path", { d: "M12 21V7" }],
    ["path", { d: "m6 15 6 6 6-6" }],
];
var S4 = [
    ["path", { d: "m3 16 4 4 4-4" }],
    ["path", { d: "M7 20V4" }],
    ["path", { d: "M11 4h4" }],
    ["path", { d: "M11 8h7" }],
    ["path", { d: "M11 12h10" }],
];
var v4 = [
    ["path", { d: "M17 7 7 17" }],
    ["path", { d: "M17 17H7V7" }],
];
var y4 = [
    ["path", { d: "m7 7 10 10" }],
    ["path", { d: "M17 7v10H7" }],
];
var P4 = [
    ["path", { d: "M12 2v14" }],
    ["path", { d: "m19 9-7 7-7-7" }],
    ["circle", { cx: "12", cy: "21", r: "1" }],
];
var q4 = [
    ["path", { d: "M12 17V3" }],
    ["path", { d: "m6 11 6 6 6-6" }],
    ["path", { d: "M19 21H5" }],
];
var C4 = [
    ["path", { d: "m3 16 4 4 4-4" }],
    ["path", { d: "M7 20V4" }],
    ["path", { d: "m21 8-4-4-4 4" }],
    ["path", { d: "M17 4v16" }],
];
var S = [
    ["path", { d: "m3 16 4 4 4-4" }],
    ["path", { d: "M7 20V4" }],
    ["path", { d: "M11 4h10" }],
    ["path", { d: "M11 8h7" }],
    ["path", { d: "M11 12h4" }],
];
var h4 = [
    ["path", { d: "M12 5v14" }],
    ["path", { d: "m19 12-7 7-7-7" }],
];
var v = [
    ["path", { d: "m3 16 4 4 4-4" }],
    ["path", { d: "M7 4v16" }],
    ["path", { d: "M15 4h5l-5 6h5" }],
    ["path", { d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" }],
    ["path", { d: "M20 18h-5" }],
];
var b4 = [
    ["path", { d: "m9 6-6 6 6 6" }],
    ["path", { d: "M3 12h14" }],
    ["path", { d: "M21 19V5" }],
];
var k4 = [
    ["path", { d: "M8 3 4 7l4 4" }],
    ["path", { d: "M4 7h16" }],
    ["path", { d: "m16 21 4-4-4-4" }],
    ["path", { d: "M20 17H4" }],
];
var w4 = [
    ["path", { d: "M3 19V5" }],
    ["path", { d: "m13 6-6 6 6 6" }],
    ["path", { d: "M7 12h14" }],
];
var f4 = [
    ["path", { d: "m12 19-7-7 7-7" }],
    ["path", { d: "M19 12H5" }],
];
var d4 = [
    ["path", { d: "M3 5v14" }],
    ["path", { d: "M21 12H7" }],
    ["path", { d: "m15 18 6-6-6-6" }],
];
var M4 = [
    ["path", { d: "m16 3 4 4-4 4" }],
    ["path", { d: "M20 7H4" }],
    ["path", { d: "m8 21-4-4 4-4" }],
    ["path", { d: "M4 17h16" }],
];
var t4 = [
    ["path", { d: "M17 12H3" }],
    ["path", { d: "m11 18 6-6-6-6" }],
    ["path", { d: "M21 5v14" }],
];
var U4 = [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "m12 5 7 7-7 7" }],
];
var L4 = [
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }],
    ["rect", { x: "15", y: "4", width: "4", height: "6", ry: "2" }],
    ["path", { d: "M17 20v-6h-2" }],
    ["path", { d: "M15 20h4" }],
];
var R4 = [
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }],
    ["path", { d: "M17 10V4h-2" }],
    ["path", { d: "M15 10h4" }],
    ["rect", { x: "15", y: "14", width: "4", height: "6", ry: "2" }],
];
var y = [
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }],
    ["path", { d: "M20 8h-5" }],
    ["path", { d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10" }],
    ["path", { d: "M15 14h5l-5 6h5" }],
];
var l4 = [
    ["path", { d: "m21 16-4 4-4-4" }],
    ["path", { d: "M17 20V4" }],
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }],
];
var j4 = [
    ["path", { d: "m5 9 7-7 7 7" }],
    ["path", { d: "M12 16V2" }],
    ["circle", { cx: "12", cy: "21", r: "1" }],
];
var m4 = [
    ["path", { d: "m18 9-6-6-6 6" }],
    ["path", { d: "M12 3v14" }],
    ["path", { d: "M5 21h14" }],
];
var g4 = [
    ["path", { d: "M7 17V7h10" }],
    ["path", { d: "M17 17 7 7" }],
];
var P = [
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }],
    ["path", { d: "M11 12h4" }],
    ["path", { d: "M11 16h7" }],
    ["path", { d: "M11 20h10" }],
];
var u4 = [
    ["path", { d: "M7 7h10v10" }],
    ["path", { d: "M7 17 17 7" }],
];
var c4 = [
    ["path", { d: "M5 3h14" }],
    ["path", { d: "m18 13-6-6-6 6" }],
    ["path", { d: "M12 7v14" }],
];
var n4 = [
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }],
    ["path", { d: "M11 12h10" }],
    ["path", { d: "M11 16h7" }],
    ["path", { d: "M11 20h4" }],
];
var q = [
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }],
    ["path", { d: "M15 4h5l-5 6h5" }],
    ["path", { d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" }],
    ["path", { d: "M20 18h-5" }],
];
var i4 = [
    ["path", { d: "m5 12 7-7 7 7" }],
    ["path", { d: "M12 19V5" }],
];
var o4 = [
    ["path", { d: "m4 6 3-3 3 3" }],
    ["path", { d: "M7 17V3" }],
    ["path", { d: "m14 6 3-3 3 3" }],
    ["path", { d: "M17 17V3" }],
    ["path", { d: "M4 21h16" }],
];
var r4 = [
    ["path", { d: "M12 6v12" }],
    ["path", { d: "M17.196 9 6.804 15" }],
    ["path", { d: "m6.804 9 10.392 6" }],
];
var e4 = [
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" }],
];
var s4 = [
    ["circle", { cx: "12", cy: "12", r: "1" }],
    [
        "path",
        {
            d: "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z",
        },
    ],
    [
        "path",
        {
            d: "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z",
        },
    ],
];
var p4 = [
    ["path", { d: "M2 10v3" }],
    ["path", { d: "M6 6v11" }],
    ["path", { d: "M10 3v18" }],
    ["path", { d: "M14 8v7" }],
    ["path", { d: "M18 5v13" }],
    ["path", { d: "M22 10v3" }],
];
var a4 = [
    [
        "path",
        {
            d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",
        },
    ],
    ["circle", { cx: "12", cy: "8", r: "6" }],
];
var I6 = [
    [
        "path",
        {
            d: "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2",
        },
    ],
];
var E6 = [
    ["path", { d: "m14 12-8.381 8.38a1 1 0 0 1-3.001-3L11 9" }],
    [
        "path",
        {
            d: "M15 15.5a.5.5 0 0 0 .5.5A6.5 6.5 0 0 0 22 9.5a.5.5 0 0 0-.5-.5h-1.672a2 2 0 0 1-1.414-.586l-5.062-5.062a1.205 1.205 0 0 0-1.704 0L9.352 5.648a1.205 1.205 0 0 0 0 1.704l5.062 5.062A2 2 0 0 1 15 13.828z",
        },
    ],
];
var C = [
    ["path", { d: "M13.5 10.5 15 9" }],
    ["path", { d: "M4 4v15a1 1 0 0 0 1 1h15" }],
    ["path", { d: "M4.293 19.707 6 18" }],
    ["path", { d: "m9 15 1.5-1.5" }],
];
var N6 = [
    ["path", { d: "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" }],
    ["path", { d: "M15 12h.01" }],
    [
        "path",
        {
            d: "M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1",
        },
    ],
    ["path", { d: "M9 12h.01" }],
];
var $6 = [
    [
        "path",
        {
            d: "M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
        },
    ],
    ["path", { d: "M8 10h8" }],
    ["path", { d: "M8 18h8" }],
    ["path", { d: "M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" }],
    ["path", { d: "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" }],
];
var _6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }],
];
var h = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "m9 12 2 2 4-4" }],
];
var Z6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
    ["path", { d: "M12 18V6" }],
];
var Y6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M12 7v10" }],
    ["path", { d: "M15.4 10a4 4 0 1 0 0 4" }],
];
var Q6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M7 12h5" }],
    ["path", { d: "M15 9.4a4 4 0 1 0 0 5.2" }],
];
var J6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M8 8h8" }],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "m13 17-5-1h1a4 4 0 0 0 0-8" }],
];
var K6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["line", { x1: "12", x2: "12", y1: "16", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "8", y2: "8" }],
];
var X6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "m9 8 3 3v7" }],
    ["path", { d: "m12 11 3-3" }],
    ["path", { d: "M9 12h6" }],
    ["path", { d: "M9 16h6" }],
];
var V6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
];
var G6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "M9 9h.01" }],
    ["path", { d: "M15 15h.01" }],
];
var W6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "16" }],
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
];
var b = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
    ["line", { x1: "12", x2: "12.01", y1: "17", y2: "17" }],
];
var x6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M8 12h4" }],
    ["path", { d: "M10 16V9.5a2.5 2.5 0 0 1 5 0" }],
    ["path", { d: "M8 16h7" }],
];
var H6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M9 16h5" }],
    ["path", { d: "M9 12h5a2 2 0 1 0 0-4h-3v9" }],
];
var z6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["path", { d: "M11 17V8h4" }],
    ["path", { d: "M11 12h3" }],
    ["path", { d: "M9 16h4" }],
];
var O6 = [
    ["path", { d: "M11 7v10a5 5 0 0 0 5-5" }],
    ["path", { d: "m15 8-6 3" }],
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76",
        },
    ],
];
var T6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
    ["line", { x1: "15", x2: "9", y1: "9", y2: "15" }],
    ["line", { x1: "9", x2: "15", y1: "9", y2: "15" }],
];
var D6 = [
    [
        "path",
        {
            d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        },
    ],
];
var F6 = [
    ["path", { d: "M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2" }],
    ["path", { d: "M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10" }],
    ["rect", { width: "13", height: "8", x: "8", y: "6", rx: "1" }],
    ["circle", { cx: "18", cy: "20", r: "2" }],
    ["circle", { cx: "9", cy: "20", r: "2" }],
];
var A6 = [
    ["path", { d: "M4.929 4.929 19.07 19.071" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var B6 = [
    ["path", { d: "M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5" }],
    [
        "path",
        {
            d: "M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z",
        },
    ],
];
var S6 = [
    ["path", { d: "M10 10.01h.01" }],
    ["path", { d: "M10 14.01h.01" }],
    ["path", { d: "M14 10.01h.01" }],
    ["path", { d: "M14 14.01h.01" }],
    ["path", { d: "M18 6v11.5" }],
    ["path", { d: "M6 6v12" }],
    ["rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }],
];
var v6 = [
    [
        "path",
        { d: "M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" },
    ],
    ["path", { d: "m16 19 3 3 3-3" }],
    ["path", { d: "M18 12h.01" }],
    ["path", { d: "M19 16v6" }],
    ["path", { d: "M6 12h.01" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var y6 = [
    [
        "path",
        { d: "M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" },
    ],
    ["path", { d: "M18 12h.01" }],
    ["path", { d: "M19 22v-6" }],
    ["path", { d: "m22 19-3-3-3 3" }],
    ["path", { d: "M6 12h.01" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var P6 = [
    [
        "path",
        { d: "M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" },
    ],
    ["path", { d: "m17 17 5 5" }],
    ["path", { d: "M18 12h.01" }],
    ["path", { d: "m22 17-5 5" }],
    ["path", { d: "M6 12h.01" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var q6 = [
    ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
    ["path", { d: "M6 12h.01M18 12h.01" }],
];
var C6 = [
    ["path", { d: "M3 5v14" }],
    ["path", { d: "M8 5v14" }],
    ["path", { d: "M12 5v14" }],
    ["path", { d: "M17 5v14" }],
    ["path", { d: "M21 5v14" }],
];
var h6 = [
    ["path", { d: "M10 3a41 41 0 0 0 0 18" }],
    ["path", { d: "M14 3a41 41 0 0 1 0 18" }],
    [
        "path",
        {
            d: "M17 3a2 2 0 0 1 1.68.92 15.25 15.25 0 0 1 0 16.16A2 2 0 0 1 17 21H7a2 2 0 0 1-1.68-.92 15.25 15.25 0 0 1 0-16.16A2 2 0 0 1 7 3z",
        },
    ],
    ["path", { d: "M3.84 17h16.32" }],
    ["path", { d: "M3.84 7h16.32" }],
];
var b6 = [
    ["path", { d: "M4 20h16" }],
    ["path", { d: "m6 16 6-12 6 12" }],
    ["path", { d: "M8 12h8" }],
];
var k6 = [
    ["path", { d: "M10 4 8 6" }],
    ["path", { d: "M17 19v2" }],
    ["path", { d: "M2 12h20" }],
    ["path", { d: "M7 19v2" }],
    [
        "path",
        {
            d: "M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",
        },
    ],
];
var w6 = [
    ["path", { d: "m11 7-3 5h4l-3 5" }],
    ["path", { d: "M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935" }],
    ["path", { d: "M22 14v-4" }],
    ["path", { d: "M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936" }],
];
var f6 = [
    ["path", { d: "M10 10v4" }],
    ["path", { d: "M14 10v4" }],
    ["path", { d: "M22 14v-4" }],
    ["path", { d: "M6 10v4" }],
    ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
];
var d6 = [
    ["path", { d: "M22 14v-4" }],
    ["path", { d: "M6 14v-4" }],
    ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
];
var M6 = [
    ["path", { d: "M10 14v-4" }],
    ["path", { d: "M22 14v-4" }],
    ["path", { d: "M6 14v-4" }],
    ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
];
var t6 = [
    ["path", { d: "M10 9v6" }],
    ["path", { d: "M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605" }],
    ["path", { d: "M22 14v-4" }],
    ["path", { d: "M7 12h6" }],
    ["path", { d: "M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606" }],
];
var U6 = [
    ["path", { d: "M10 17h.01" }],
    ["path", { d: "M10 7v6" }],
    ["path", { d: "M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M22 14v-4" }],
    ["path", { d: "M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" }],
];
var L6 = [
    ["path", { d: "M 22 14 L 22 10" }],
    ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }],
];
var R6 = [
    ["path", { d: "M4.5 3h15" }],
    ["path", { d: "M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" }],
    ["path", { d: "M6 14h12" }],
];
var l6 = [
    [
        "path",
        {
            d: "M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1",
        },
    ],
    ["path", { d: "M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66" }],
    [
        "path",
        {
            d: "M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04",
        },
    ],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var j6 = [
    [
        "path",
        {
            d: "M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z",
        },
    ],
    ["path", { d: "M5.341 10.62a4 4 0 1 0 5.279-5.28" }],
];
var m6 = [
    ["path", { d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" }],
    ["path", { d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" }],
    ["path", { d: "M12 4v6" }],
    ["path", { d: "M2 18h20" }],
];
var g6 = [
    ["path", { d: "M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" }],
    ["path", { d: "M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" }],
    ["path", { d: "M3 18h18" }],
];
var u6 = [
    ["path", { d: "M2 4v16" }],
    ["path", { d: "M2 8h18a2 2 0 0 1 2 2v10" }],
    ["path", { d: "M2 17h20" }],
    ["path", { d: "M6 8v9" }],
];
var c6 = [
    [
        "path",
        {
            d: "M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3",
        },
    ],
    [
        "path",
        {
            d: "m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5",
        },
    ],
    ["circle", { cx: "12.5", cy: "8.5", r: "2.5" }],
];
var n6 = [
    ["path", { d: "M13 13v5" }],
    ["path", { d: "M17 11.47V8" }],
    ["path", { d: "M17 11h1a3 3 0 0 1 2.745 4.211" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" }],
    [
        "path",
        {
            d: "M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268",
        },
    ],
    [
        "path",
        {
            d: "M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12",
        },
    ],
    ["path", { d: "M9 14.6V18" }],
];
var i6 = [
    ["path", { d: "M17 11h1a3 3 0 0 1 0 6h-1" }],
    ["path", { d: "M9 12v6" }],
    ["path", { d: "M13 12v6" }],
    [
        "path",
        {
            d: "M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z",
        },
    ],
    ["path", { d: "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" }],
];
var o6 = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    [
        "path",
        {
            d: "M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665",
        },
    ],
    ["circle", { cx: "18", cy: "8", r: "3" }],
];
var r6 = [
    ["path", { d: "M18.518 17.347A7 7 0 0 1 14 19" }],
    ["path", { d: "M18.8 4A11 11 0 0 1 20 9" }],
    ["path", { d: "M9 9h.01" }],
    ["circle", { cx: "20", cy: "16", r: "2" }],
    ["circle", { cx: "9", cy: "9", r: "7" }],
    ["rect", { x: "4", y: "16", width: "10", height: "6", rx: "2" }],
];
var e6 = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    ["path", { d: "M15 8h6" }],
    [
        "path",
        {
            d: "M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12",
        },
    ],
];
var s6 = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    [
        "path",
        {
            d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05" }],
];
var p6 = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    ["path", { d: "M15 8h6" }],
    ["path", { d: "M18 5v6" }],
    [
        "path",
        {
            d: "M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332",
        },
    ],
];
var a6 = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    ["path", { d: "M22 8c0-2.3-.8-4.3-2-6" }],
    [
        "path",
        {
            d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        },
    ],
    ["path", { d: "M4 2C2.8 3.7 2 5.7 2 8" }],
];
var I7 = [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    [
        "path",
        {
            d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",
        },
    ],
];
var k = [
    ["rect", { width: "13", height: "7", x: "3", y: "3", rx: "1" }],
    ["path", { d: "m22 15-3-3 3-3" }],
    ["rect", { width: "13", height: "7", x: "3", y: "14", rx: "1" }],
];
var w = [
    ["rect", { width: "13", height: "7", x: "8", y: "3", rx: "1" }],
    ["path", { d: "m2 9 3 3-3 3" }],
    ["rect", { width: "13", height: "7", x: "8", y: "14", rx: "1" }],
];
var E7 = [
    ["rect", { width: "7", height: "13", x: "3", y: "3", rx: "1" }],
    ["path", { d: "m9 22 3-3 3 3" }],
    ["rect", { width: "7", height: "13", x: "14", y: "3", rx: "1" }],
];
var N7 = [
    ["rect", { width: "7", height: "13", x: "3", y: "8", rx: "1" }],
    ["path", { d: "m15 2-3 3-3-3" }],
    ["rect", { width: "7", height: "13", x: "14", y: "8", rx: "1" }],
];
var $7 = [
    ["circle", { cx: "18.5", cy: "17.5", r: "3.5" }],
    ["circle", { cx: "5.5", cy: "17.5", r: "3.5" }],
    ["circle", { cx: "15", cy: "5", r: "1" }],
    ["path", { d: "M12 17.5V14l-3-3 4-3 2 3h2" }],
];
var _7 = [
    [
        "path",
        {
            d: "M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1",
        },
    ],
    ["path", { d: "M15 14a5 5 0 0 0-7.584 2" }],
    ["path", { d: "M9.964 6.825C8.019 7.977 9.5 13 8 15" }],
];
var Z7 = [
    ["rect", { x: "14", y: "14", width: "4", height: "6", rx: "2" }],
    ["rect", { x: "6", y: "4", width: "4", height: "6", rx: "2" }],
    ["path", { d: "M6 20h4" }],
    ["path", { d: "M14 10h4" }],
    ["path", { d: "M6 14h2v6" }],
    ["path", { d: "M14 4h2v6" }],
];
var Y7 = [
    ["path", { d: "M10 10h4" }],
    ["path", { d: "M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" }],
    [
        "path",
        {
            d: "M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z",
        },
    ],
    ["path", { d: "M 22 16 L 2 16" }],
    [
        "path",
        {
            d: "M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z",
        },
    ],
    ["path", { d: "M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3" }],
];
var Q7 = [
    ["circle", { cx: "12", cy: "11.9", r: "2" }],
    ["path", { d: "M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6" }],
    ["path", { d: "m8.9 10.1 1.4.8" }],
    ["path", { d: "M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5" }],
    ["path", { d: "m15.1 10.1-1.4.8" }],
    [
        "path",
        { d: "M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2" },
    ],
    ["path", { d: "M12 13.9v1.6" }],
    ["path", { d: "M13.5 5.4c-1-.2-2-.2-3 0" }],
    ["path", { d: "M17 16.4c.7-.7 1.2-1.6 1.5-2.5" }],
    ["path", { d: "M5.5 13.9c.3.9.8 1.8 1.5 2.5" }],
];
var J7 = [
    ["path", { d: "M16 7h.01" }],
    ["path", { d: "M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" }],
    ["path", { d: "m20 7 2 .5-2 .5" }],
    ["path", { d: "M10 18v3" }],
    ["path", { d: "M14 17.75V21" }],
    ["path", { d: "M7 18a6 6 0 0 0 3.84-10.61" }],
];
var K7 = [
    [
        "path",
        {
            d: "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",
        },
    ],
];
var X7 = [
    ["circle", { cx: "9", cy: "9", r: "7" }],
    ["circle", { cx: "15", cy: "15", r: "7" }],
];
var V7 = [
    ["path", { d: "M3 3h18" }],
    ["path", { d: "M20 7H8" }],
    ["path", { d: "M20 11H8" }],
    ["path", { d: "M10 19h10" }],
    ["path", { d: "M8 15h12" }],
    ["path", { d: "M4 3v14" }],
    ["circle", { cx: "4", cy: "19", r: "2" }],
];
var G7 = [
    [
        "path",
        {
            d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
        },
    ],
    ["rect", { x: "14", y: "2", width: "8", height: "8", rx: "1" }],
];
var W7 = [
    ["path", { d: "m7 7 10 10-5 5V2l5 5L7 17" }],
    ["line", { x1: "18", x2: "21", y1: "12", y2: "12" }],
    ["line", { x1: "3", x2: "6", y1: "12", y2: "12" }],
];
var x7 = [
    ["path", { d: "m17 17-5 5V12l-5 5" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M14.5 9.5 17 7l-5-5v4.5" }],
];
var H7 = [
    ["path", { d: "m7 7 10 10-5 5V2l5 5L7 17" }],
    ["path", { d: "M20.83 14.83a4 4 0 0 0 0-5.66" }],
    ["path", { d: "M18 12h.01" }],
];
var z7 = [
    [
        "path",
        {
            d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",
        },
    ],
];
var O7 = [["path", { d: "m7 7 10 10-5 5V2l5 5L7 17" }]];
var T7 = [
    [
        "path",
        {
            d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "4" }],
];
var D7 = [
    ["circle", { cx: "11", cy: "13", r: "9" }],
    [
        "path",
        {
            d: "M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95",
        },
    ],
    ["path", { d: "m22 2-1.5 1.5" }],
];
var F7 = [
    [
        "path",
        {
            d: "M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z",
        },
    ],
];
var A7 = [
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "m8 13 4-7 4 7" }],
    ["path", { d: "M9.1 11h5.7" }],
];
var B7 = [
    ["path", { d: "M12 13h.01" }],
    ["path", { d: "M12 6v3" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
];
var S7 = [
    ["path", { d: "M12 6v7" }],
    ["path", { d: "M16 8v3" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "M8 8v3" }],
];
var v7 = [
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "m9 9.5 2 2 4-4" }],
];
var y7 = [
    ["path", { d: "M5 7a2 2 0 0 0-2 2v11" }],
    ["path", { d: "M5.803 18H5a2 2 0 0 0 0 4h9.5a.5.5 0 0 0 .5-.5V21" }],
    [
        "path",
        {
            d: "M9 15V4a2 2 0 0 1 2-2h9.5a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.5.5H11a2 2 0 0 1 0-4h10",
        },
    ],
];
var f = [
    ["path", { d: "M12 17h1.5" }],
    ["path", { d: "M12 22h1.5" }],
    ["path", { d: "M12 2h1.5" }],
    ["path", { d: "M17.5 22H19a1 1 0 0 0 1-1" }],
    ["path", { d: "M17.5 2H19a1 1 0 0 1 1 1v1.5" }],
    ["path", { d: "M20 14v3h-2.5" }],
    ["path", { d: "M20 8.5V10" }],
    ["path", { d: "M4 10V8.5" }],
    ["path", { d: "M4 19.5V14" }],
    ["path", { d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H8" }],
    ["path", { d: "M8 22H6.5a1 1 0 0 1 0-5H8" }],
];
var P7 = [
    ["path", { d: "M12 13V7" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "m9 10 3 3 3-3" }],
];
var q7 = [
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "M8 12v-2a4 4 0 0 1 8 0v2" }],
    ["circle", { cx: "15", cy: "12", r: "1" }],
    ["circle", { cx: "9", cy: "12", r: "1" }],
];
var C7 = [
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    [
        "path",
        {
            d: "M8.62 9.8A2.25 2.25 0 1 1 12 6.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z",
        },
    ],
];
var h7 = [
    ["path", { d: "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["circle", { cx: "10", cy: "8", r: "2" }],
];
var b7 = [
    ["path", { d: "m19 3 1 1" }],
    ["path", { d: "m20 2-4.5 4.5" }],
    ["path", { d: "M20 7.898V21a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }],
    ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2h7.844" }],
    ["circle", { cx: "14", cy: "8", r: "2" }],
];
var k7 = [
    ["path", { d: "M18 6V4a2 2 0 1 0-4 0v2" }],
    ["path", { d: "M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }],
    ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10" }],
    ["rect", { x: "12", y: "6", width: "8", height: "5", rx: "1" }],
];
var w7 = [
    ["path", { d: "M10 2v8l3-3 3 3V2" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
];
var f7 = [
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "M9 10h6" }],
];
var d7 = [
    ["path", { d: "M12 21V7" }],
    ["path", { d: "m16 12 2 2 4-4" }],
    [
        "path",
        {
            d: "M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",
        },
    ],
];
var M7 = [
    ["path", { d: "M12 7v14" }],
    ["path", { d: "M16 12h2" }],
    ["path", { d: "M16 8h2" }],
    [
        "path",
        {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
        },
    ],
    ["path", { d: "M6 12h2" }],
    ["path", { d: "M6 8h2" }],
];
var t7 = [
    ["path", { d: "M12 7v14" }],
    [
        "path",
        {
            d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
        },
    ],
];
var U7 = [
    ["path", { d: "M12 7v6" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "M9 10h6" }],
];
var L7 = [
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "M8 11h8" }],
    ["path", { d: "M8 7h6" }],
];
var R7 = [
    ["path", { d: "M10 13h4" }],
    ["path", { d: "M12 6v7" }],
    ["path", { d: "M16 8V6H8v2" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
];
var l7 = [
    ["path", { d: "M12 13V7" }],
    [
        "path",
        { d: "M18 2h1a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" },
    ],
    ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2" }],
    ["path", { d: "m9 10 3-3 3 3" }],
    ["path", { d: "m9 5 3-3 3 3" }],
];
var j7 = [
    ["path", { d: "M12 13V7" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "m9 10 3-3 3 3" }],
];
var m7 = [
    ["path", { d: "M15 13a3 3 0 1 0-6 0" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["circle", { cx: "12", cy: "8", r: "2" }],
];
var g7 = [
    ["path", { d: "m14.5 7-5 5" }],
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
    ["path", { d: "m9.5 7 5 5" }],
];
var u7 = [
    [
        "path",
        {
            d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
        },
    ],
];
var c7 = [
    ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" }],
    ["path", { d: "m9 10 2 2 4-4" }],
];
var n7 = [
    ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }],
    ["line", { x1: "15", x2: "9", y1: "10", y2: "10" }],
];
var i7 = [
    ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }],
    ["line", { x1: "12", x2: "12", y1: "7", y2: "13" }],
    ["line", { x1: "15", x2: "9", y1: "10", y2: "10" }],
];
var o7 = [
    ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" }],
    ["path", { d: "m14.5 7.5-5 5" }],
    ["path", { d: "m9.5 7.5 5 5" }],
];
var r7 = [
    ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }],
];
var e7 = [
    ["path", { d: "M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" }],
    ["path", { d: "M8 8v1" }],
    ["path", { d: "M12 8v1" }],
    ["path", { d: "M16 8v1" }],
    ["rect", { width: "20", height: "12", x: "2", y: "9", rx: "2" }],
    ["circle", { cx: "8", cy: "15", r: "2" }],
    ["circle", { cx: "16", cy: "15", r: "2" }],
];
var s7 = [
    ["path", { d: "M12 6V2H8" }],
    ["path", { d: "M15 11v2" }],
    ["path", { d: "M2 12h2" }],
    ["path", { d: "M20 12h2" }],
    [
        "path",
        {
            d: "M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "M9 11v2" }],
];
var p7 = [
    ["path", { d: "M13.67 8H18a2 2 0 0 1 2 2v4.33" }],
    ["path", { d: "M2 14h2" }],
    ["path", { d: "M20 14h2" }],
    ["path", { d: "M22 22 2 2" }],
    [
        "path",
        { d: "M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586" },
    ],
    ["path", { d: "M9 13v2" }],
    ["path", { d: "M9.67 4H12v2.33" }],
];
var a7 = [
    ["path", { d: "M12 8V4H8" }],
    ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }],
    ["path", { d: "M2 14h2" }],
    ["path", { d: "M20 14h2" }],
    ["path", { d: "M15 13v2" }],
    ["path", { d: "M9 13v2" }],
];
var I8 = [
    [
        "path",
        {
            d: "M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a6 6 0 0 0 1.2 3.6l.6.8A6 6 0 0 1 17 13v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a6 6 0 0 1 1.2-3.6l.6-.8A6 6 0 0 0 10 5z",
        },
    ],
    ["path", { d: "M17 13h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4" }],
];
var E8 = [
    ["path", { d: "M17 3h4v4" }],
    [
        "path",
        {
            d: "M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17",
        },
    ],
    [
        "path",
        { d: "M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05" },
    ],
    [
        "path",
        {
            d: "M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z",
        },
    ],
    ["path", { d: "M9.707 14.293 21 3" }],
];
var N8 = [
    [
        "path",
        {
            d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",
        },
    ],
    ["path", { d: "m3.3 7 8.7 5 8.7-5" }],
    ["path", { d: "M12 22V12" }],
];
var $8 = [
    [
        "path",
        {
            d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
        },
    ],
    ["path", { d: "m7 16.5-4.74-2.85" }],
    ["path", { d: "m7 16.5 5-3" }],
    ["path", { d: "M7 16.5v5.17" }],
    [
        "path",
        {
            d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
        },
    ],
    ["path", { d: "m17 16.5-5-3" }],
    ["path", { d: "m17 16.5 4.74-2.85" }],
    ["path", { d: "M17 16.5v5.17" }],
    [
        "path",
        {
            d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
        },
    ],
    ["path", { d: "M12 8 7.26 5.15" }],
    ["path", { d: "m12 8 4.74-2.85" }],
    ["path", { d: "M12 13.5V8" }],
];
var d = [
    [
        "path",
        {
            d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
        },
    ],
    [
        "path",
        {
            d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
        },
    ],
];
var _8 = [
    ["path", { d: "M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3" }],
    ["path", { d: "M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3" }],
];
var Z8 = [
    [
        "path",
        {
            d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",
        },
    ],
    ["path", { d: "M9 13a4.5 4.5 0 0 0 3-4" }],
    ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }],
    ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }],
    ["path", { d: "M6 18a4 4 0 0 1-1.967-.516" }],
    ["path", { d: "M12 13h4" }],
    ["path", { d: "M12 18h6a2 2 0 0 1 2 2v1" }],
    ["path", { d: "M12 8h8" }],
    ["path", { d: "M16 8V5a2 2 0 0 1 2-2" }],
    ["circle", { cx: "16", cy: "13", r: ".5" }],
    ["circle", { cx: "18", cy: "3", r: ".5" }],
    ["circle", { cx: "20", cy: "21", r: ".5" }],
    ["circle", { cx: "20", cy: "8", r: ".5" }],
];
var Y8 = [
    ["path", { d: "m10.852 14.772-.383.923" }],
    ["path", { d: "m10.852 9.228-.383-.923" }],
    ["path", { d: "m13.148 14.772.382.924" }],
    ["path", { d: "m13.531 8.305-.383.923" }],
    ["path", { d: "m14.772 10.852.923-.383" }],
    ["path", { d: "m14.772 13.148.923.383" }],
    [
        "path",
        {
            d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771",
        },
    ],
    ["path", { d: "M17.998 5.125a4 4 0 0 1 2.525 5.771" }],
    ["path", { d: "M19.505 10.294a4 4 0 0 1-1.5 7.706" }],
    [
        "path",
        {
            d: "M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516",
        },
    ],
    ["path", { d: "M4.5 10.291A4 4 0 0 0 6 18" }],
    ["path", { d: "M6.002 5.125a3 3 0 0 0 .4 1.375" }],
    ["path", { d: "m9.228 10.852-.923-.383" }],
    ["path", { d: "m9.228 13.148-.923.383" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
];
var Q8 = [
    ["path", { d: "M12 18V5" }],
    ["path", { d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" }],
    ["path", { d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" }],
    ["path", { d: "M17.997 5.125a4 4 0 0 1 2.526 5.77" }],
    ["path", { d: "M18 18a4 4 0 0 0 2-7.464" }],
    ["path", { d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" }],
    ["path", { d: "M6 18a4 4 0 0 1-2-7.464" }],
    ["path", { d: "M6.003 5.125a4 4 0 0 0-2.526 5.77" }],
];
var J8 = [
    ["path", { d: "M16 3v2.107" }],
    [
        "path",
        {
            d: "M17 9c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 22 17a5 5 0 0 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C13 11.5 16 9 17 9",
        },
    ],
    [
        "path",
        {
            d: "M21 8.274V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.938",
        },
    ],
    ["path", { d: "M3 15h5.253" }],
    ["path", { d: "M3 9h8.228" }],
    ["path", { d: "M8 15v6" }],
    ["path", { d: "M8 3v6" }],
];
var K8 = [
    ["path", { d: "M12 9v1.258" }],
    ["path", { d: "M16 3v5.46" }],
    [
        "path",
        {
            d: "M21 9.118V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5.75",
        },
    ],
    [
        "path",
        {
            d: "M22 17.5c0 2.499-1.75 3.749-3.83 4.474a.5.5 0 0 1-.335-.005c-2.085-.72-3.835-1.97-3.835-4.47V14a.5.5 0 0 1 .5-.499c1 0 2.25-.6 3.12-1.36a.6.6 0 0 1 .76-.001c.875.765 2.12 1.36 3.12 1.36a.5.5 0 0 1 .5.5z",
        },
    ],
    ["path", { d: "M3 15h7" }],
    ["path", { d: "M3 9h12.142" }],
    ["path", { d: "M8 15v6" }],
    ["path", { d: "M8 3v6" }],
];
var X8 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M12 9v6" }],
    ["path", { d: "M16 15v6" }],
    ["path", { d: "M16 3v6" }],
    ["path", { d: "M3 15h18" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "M8 15v6" }],
    ["path", { d: "M8 3v6" }],
];
var V8 = [
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" }],
    ["path", { d: "M22 13a18.15 18.15 0 0 1-20 0" }],
    ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2" }],
];
var G8 = [
    ["path", { d: "M10 20v2" }],
    ["path", { d: "M14 20v2" }],
    ["path", { d: "M18 20v2" }],
    ["path", { d: "M21 20H3" }],
    ["path", { d: "M6 20v2" }],
    ["path", { d: "M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12" }],
    ["rect", { x: "4", y: "6", width: "16", height: "10", rx: "2" }],
];
var W8 = [
    ["path", { d: "M12 11v4" }],
    ["path", { d: "M14 13h-4" }],
    ["path", { d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" }],
    ["path", { d: "M18 6v14" }],
    ["path", { d: "M6 6v14" }],
    ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2" }],
];
var x8 = [
    ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }],
    ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2" }],
];
var H8 = [
    ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "2" }],
    ["path", { d: "M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" }],
    ["path", { d: "M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" }],
];
var z8 = [
    ["path", { d: "m16 22-1-4" }],
    [
        "path",
        {
            d: "M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1",
        },
    ],
    [
        "path",
        { d: "M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z" },
    ],
    ["path", { d: "m8 22 1-4" }],
];
var O8 = [
    ["path", { d: "m11 10 3 3" }],
    [
        "path",
        {
            d: "M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z",
        },
    ],
    [
        "path",
        { d: "M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" },
    ],
];
var T8 = [
    ["path", { d: "M7.2 14.8a2 2 0 0 1 2 2" }],
    ["circle", { cx: "18.5", cy: "8.5", r: "3.5" }],
    ["circle", { cx: "7.5", cy: "16.5", r: "5.5" }],
    ["circle", { cx: "7.5", cy: "4.5", r: "2.5" }],
];
var D8 = [
    ["path", { d: "M12 20v-8" }],
    ["path", { d: "M14.12 3.88 16 2" }],
    ["path", { d: "M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2" }],
    ["path", { d: "M18 12.34V11a4 4 0 0 0-4-4h-1.3" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M21 5a4 4 0 0 1-3.55 3.97" }],
    ["path", { d: "M22 13h-3.34" }],
    ["path", { d: "M3 21a4 4 0 0 1 3.81-4" }],
    ["path", { d: "M6 13H2" }],
    ["path", { d: "M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13" }],
];
var F8 = [
    [
        "path",
        { d: "M10 19.655A6 6 0 0 1 6 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 3.97" },
    ],
    [
        "path",
        {
            d: "M14 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z",
        },
    ],
    ["path", { d: "M14.12 3.88 16 2" }],
    ["path", { d: "M21 5a4 4 0 0 1-3.55 3.97" }],
    ["path", { d: "M3 21a4 4 0 0 1 3.81-4" }],
    ["path", { d: "M3 5a4 4 0 0 0 3.55 3.97" }],
    ["path", { d: "M6 13H2" }],
    ["path", { d: "m8 2 1.88 1.88" }],
    ["path", { d: "M9 7.13V6a3 3 0 1 1 6 0v1.13" }],
];
var A8 = [
    ["path", { d: "M12 20v-9" }],
    ["path", { d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" }],
    ["path", { d: "M14.12 3.88 16 2" }],
    ["path", { d: "M21 21a4 4 0 0 0-3.81-4" }],
    ["path", { d: "M21 5a4 4 0 0 1-3.55 3.97" }],
    ["path", { d: "M22 13h-4" }],
    ["path", { d: "M3 21a4 4 0 0 1 3.81-4" }],
    ["path", { d: "M3 5a4 4 0 0 0 3.55 3.97" }],
    ["path", { d: "M6 13H2" }],
    ["path", { d: "m8 2 1.88 1.88" }],
    ["path", { d: "M9 7.13V6a3 3 0 1 1 6 0v1.13" }],
];
var B8 = [
    ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" }],
    ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" }],
    ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M10 6h4" }],
    ["path", { d: "M10 10h4" }],
    ["path", { d: "M10 14h4" }],
    ["path", { d: "M10 18h4" }],
];
var S8 = [
    ["path", { d: "M4 6 2 7" }],
    ["path", { d: "M10 6h4" }],
    ["path", { d: "m22 7-2-1" }],
    ["rect", { width: "16", height: "16", x: "4", y: "3", rx: "2" }],
    ["path", { d: "M4 11h16" }],
    ["path", { d: "M8 15h.01" }],
    ["path", { d: "M16 15h.01" }],
    ["path", { d: "M6 19v2" }],
    ["path", { d: "M18 21v-2" }],
];
var v8 = [
    ["path", { d: "M12 10h.01" }],
    ["path", { d: "M12 14h.01" }],
    ["path", { d: "M12 6h.01" }],
    ["path", { d: "M16 10h.01" }],
    ["path", { d: "M16 14h.01" }],
    ["path", { d: "M16 6h.01" }],
    ["path", { d: "M8 10h.01" }],
    ["path", { d: "M8 14h.01" }],
    ["path", { d: "M8 6h.01" }],
    ["path", { d: "M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" }],
    ["rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }],
];
var y8 = [
    ["path", { d: "M8 6v6" }],
    ["path", { d: "M15 6v6" }],
    ["path", { d: "M2 12h19.6" }],
    [
        "path",
        {
            d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3",
        },
    ],
    ["circle", { cx: "7", cy: "18", r: "2" }],
    ["path", { d: "M9 18h5" }],
    ["circle", { cx: "16", cy: "18", r: "2" }],
];
var P8 = [
    ["path", { d: "M10 3h.01" }],
    ["path", { d: "M14 2h.01" }],
    ["path", { d: "m2 9 20-5" }],
    ["path", { d: "M12 12V6.5" }],
    ["rect", { width: "16", height: "10", x: "4", y: "12", rx: "3" }],
    ["path", { d: "M9 12v5" }],
    ["path", { d: "M15 12v5" }],
    ["path", { d: "M4 17h16" }],
];
var q8 = [
    [
        "path",
        {
            d: "M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z",
        },
    ],
    ["path", { d: "M17 21v-2" }],
    ["path", { d: "M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10" }],
    ["path", { d: "M21 21v-2" }],
    ["path", { d: "M3 5V3" }],
    [
        "path",
        {
            d: "M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z",
        },
    ],
    ["path", { d: "M7 5V3" }],
];
var C8 = [
    ["path", { d: "M16 13H3" }],
    ["path", { d: "M16 17H3" }],
    [
        "path",
        {
            d: "m7.2 7.9-3.388 2.5A2 2 0 0 0 3 12.01V20a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-8.654c0-2-2.44-6.026-6.44-8.026a1 1 0 0 0-1.082.057L10.4 5.6",
        },
    ],
    ["circle", { cx: "9", cy: "7", r: "2" }],
];
var h8 = [
    ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
    ["line", { x1: "8", x2: "16", y1: "6", y2: "6" }],
    ["line", { x1: "16", x2: "16", y1: "14", y2: "18" }],
    ["path", { d: "M16 10h.01" }],
    ["path", { d: "M12 10h.01" }],
    ["path", { d: "M8 10h.01" }],
    ["path", { d: "M12 14h.01" }],
    ["path", { d: "M8 14h.01" }],
    ["path", { d: "M12 18h.01" }],
    ["path", { d: "M8 18h.01" }],
];
var b8 = [
    ["path", { d: "M11 14h1v4" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
    ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }],
];
var k8 = [
    ["path", { d: "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" }],
    ["path", { d: "M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" }],
    ["path", { d: "M2 21h20" }],
    ["path", { d: "M7 8v3" }],
    ["path", { d: "M12 8v3" }],
    ["path", { d: "M17 8v3" }],
    ["path", { d: "M7 4h.01" }],
    ["path", { d: "M12 4h.01" }],
    ["path", { d: "M17 4h.01" }],
];
var w8 = [
    ["path", { d: "m14 18 4 4 4-4" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M18 14v8" }],
    [
        "path",
        {
            d: "M21 11.354V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.343",
        },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
];
var f8 = [
    ["path", { d: "m14 18 4-4 4 4" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M18 22v-8" }],
    [
        "path",
        { d: "M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
];
var d8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    [
        "path",
        { d: "M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "m16 20 2 2 4-4" }],
];
var M8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "m9 16 2 2 4-4" }],
];
var t8 = [
    ["path", { d: "M16 14v2.2l1.6 1" }],
    ["path", { d: "M16 2v4" }],
    [
        "path",
        { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" },
    ],
    ["path", { d: "M3 10h5" }],
    ["path", { d: "M8 2v4" }],
    ["circle", { cx: "16", cy: "16", r: "6" }],
];
var U8 = [
    ["path", { d: "m15.228 16.852-.923-.383" }],
    ["path", { d: "m15.228 19.148-.923.383" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "m16.47 14.305.382.923" }],
    ["path", { d: "m16.852 20.772-.383.924" }],
    ["path", { d: "m19.148 15.228.383-.923" }],
    ["path", { d: "m19.53 21.696-.382-.924" }],
    ["path", { d: "m20.772 16.852.924-.383" }],
    ["path", { d: "m20.772 19.148.924.383" }],
    [
        "path",
        { d: "M21 10.592V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
];
var L8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 14h.01" }],
    ["path", { d: "M12 14h.01" }],
    ["path", { d: "M16 14h.01" }],
    ["path", { d: "M8 18h.01" }],
    ["path", { d: "M12 18h.01" }],
    ["path", { d: "M16 18h.01" }],
];
var R8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    [
        "path",
        { d: "M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z" },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M15 22v-4a2 2 0 0 1 2-2h4" }],
];
var l8 = [
    [
        "path",
        {
            d: "M12.127 22H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.125",
        },
    ],
    [
        "path",
        {
            d: "M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z",
        },
    ],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
];
var j8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M10 16h4" }],
];
var m8 = [
    ["path", { d: "M16 19h6" }],
    ["path", { d: "M16 2v4" }],
    [
        "path",
        { d: "M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
];
var g8 = [
    [
        "path",
        { d: "M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18" },
    ],
    ["path", { d: "M21 15.5V6a2 2 0 0 0-2-2H9.5" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M3 10h7" }],
    ["path", { d: "M21 10h-5.5" }],
    ["path", { d: "m2 2 20 20" }],
];
var u8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M10 16h4" }],
    ["path", { d: "M12 14v4" }],
];
var c8 = [
    ["path", { d: "M16 19h6" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M19 16v6" }],
    [
        "path",
        {
            d: "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5",
        },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
];
var n8 = [
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M17 14h-6" }],
    ["path", { d: "M13 18H7" }],
    ["path", { d: "M7 14h.01" }],
    ["path", { d: "M17 18h.01" }],
];
var i8 = [
    ["path", { d: "M11 10v4h4" }],
    ["path", { d: "m11 14 1.535-1.605a5 5 0 0 1 8 1.5" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "m21 18-1.535 1.605a5 5 0 0 1-8-1.5" }],
    ["path", { d: "M21 22v-4h-4" }],
    [
        "path",
        { d: "M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" },
    ],
    ["path", { d: "M3 10h4" }],
    ["path", { d: "M8 2v4" }],
];
var o8 = [
    ["path", { d: "M16 2v4" }],
    [
        "path",
        {
            d: "M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25",
        },
    ],
    ["path", { d: "m22 22-1.875-1.875" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "M8 2v4" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
];
var r8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    [
        "path",
        { d: "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" },
    ],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "m17 22 5-5" }],
    ["path", { d: "m17 17 5 5" }],
];
var e8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }],
    ["path", { d: "m14 14-4 4" }],
    ["path", { d: "m10 14 4 4" }],
];
var s8 = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
    ["path", { d: "M3 10h18" }],
];
var p8 = [
    ["path", { d: "M14.564 14.558a3 3 0 1 1-4.122-4.121" }],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "M20 20H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 .819-.175",
        },
    ],
    [
        "path",
        {
            d: "M9.695 4.024A2 2 0 0 1 10.004 4h3.993a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v7.344",
        },
    ],
];
var a8 = [
    [
        "path",
        {
            d: "M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",
        },
    ],
    ["circle", { cx: "12", cy: "13", r: "3" }],
];
var I9 = [
    [
        "path",
        {
            d: "M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2Z",
        },
    ],
    ["path", { d: "M17.75 7 15 2.1" }],
    ["path", { d: "M10.9 4.8 13 9" }],
    ["path", { d: "m7.9 9.7 2 4.4" }],
    ["path", { d: "M4.9 14.7 7 18.9" }],
];
var E9 = [
    ["path", { d: "M10 10v7.9" }],
    ["path", { d: "M11.802 6.145a5 5 0 0 1 6.053 6.053" }],
    ["path", { d: "M14 6.1v2.243" }],
    [
        "path",
        {
            d: "m15.5 15.571-.964.964a5 5 0 0 1-7.071 0 5 5 0 0 1 0-7.07l.964-.965",
        },
    ],
    [
        "path",
        {
            d: "M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4",
        },
    ],
];
var N9 = [
    ["path", { d: "M10 7v10.9" }],
    ["path", { d: "M14 6.1V17" }],
    [
        "path",
        {
            d: "M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4",
        },
    ],
    [
        "path",
        {
            d: "M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07 5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07",
        },
    ],
    [
        "path",
        {
            d: "M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4",
        },
    ],
];
var $9 = [
    ["path", { d: "M10.5 5H19a2 2 0 0 1 2 2v8.5" }],
    ["path", { d: "M17 11h-.5" }],
    ["path", { d: "M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M7 11h4" }],
    ["path", { d: "M7 15h2.5" }],
];
var M = [
    ["rect", { width: "18", height: "14", x: "3", y: "5", rx: "2", ry: "2" }],
    ["path", { d: "M7 15h4M15 15h2M7 11h2M13 11h4" }],
];
var _9 = [
    ["path", { d: "M12 22v-4" }],
    [
        "path",
        {
            d: "M7 12c-1.5 0-4.5 1.5-5 3 3.5 1.5 6 1 6 1-1.5 1.5-2 3.5-2 5 2.5 0 4.5-1.5 6-3 1.5 1.5 3.5 3 6 3 0-1.5-.5-3.5-2-5 0 0 2.5.5 6-1-.5-1.5-3.5-3-5-3 1.5-1 4-4 4-6-2.5 0-5.5 1.5-7 3 0-2.5-.5-5-2-7-1.5 2-2 4.5-2 7-1.5-1.5-4.5-3-7-3 0 2 2.5 5 4 6",
        },
    ],
];
var Z9 = [
    [
        "path",
        {
            d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",
        },
    ],
    ["path", { d: "M7 14h.01" }],
    ["path", { d: "M17 14h.01" }],
    ["rect", { width: "18", height: "8", x: "3", y: "10", rx: "2" }],
    ["path", { d: "M5 18v2" }],
    ["path", { d: "M19 18v2" }],
];
var Y9 = [
    ["path", { d: "M10 2h4" }],
    [
        "path",
        {
            d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8",
        },
    ],
    ["path", { d: "M7 14h.01" }],
    ["path", { d: "M17 14h.01" }],
    ["rect", { width: "18", height: "8", x: "3", y: "10", rx: "2" }],
    ["path", { d: "M5 18v2" }],
    ["path", { d: "M19 18v2" }],
];
var Q9 = [
    [
        "path",
        {
            d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2",
        },
    ],
    ["circle", { cx: "7", cy: "17", r: "2" }],
    ["path", { d: "M9 17h6" }],
    ["circle", { cx: "17", cy: "17", r: "2" }],
];
var J9 = [
    ["path", { d: "M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2" }],
    ["path", { d: "M2 9h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2" }],
    [
        "path",
        { d: "M22 17v1a1 1 0 0 1-1 1H10v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9" },
    ],
    ["circle", { cx: "8", cy: "19", r: "2" }],
];
var K9 = [
    ["path", { d: "M12 14v4" }],
    [
        "path",
        {
            d: "M14.172 2a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 20 7.828V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
        },
    ],
    ["path", { d: "M8 14h8" }],
    ["rect", { x: "8", y: "10", width: "8", height: "8", rx: "1" }],
];
var X9 = [
    [
        "path",
        {
            d: "M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46",
        },
    ],
    [
        "path",
        { d: "M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z" },
    ],
    [
        "path",
        { d: "M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z" },
    ],
];
var V9 = [
    ["path", { d: "M10 9v7" }],
    ["path", { d: "M14 6v10" }],
    ["circle", { cx: "17.5", cy: "12.5", r: "3.5" }],
    ["circle", { cx: "6.5", cy: "12.5", r: "3.5" }],
];
var G9 = [
    ["path", { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" }],
    ["path", { d: "M22 9v7" }],
    ["path", { d: "M3.304 13h6.392" }],
    ["circle", { cx: "18.5", cy: "12.5", r: "3.5" }],
];
var W9 = [
    [
        "path",
        {
            d: "M15 11h4.5a1 1 0 0 1 0 5h-4a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h3a1 1 0 0 1 0 5",
        },
    ],
    ["path", { d: "m2 16 4.039-9.69a.5.5 0 0 1 .923 0L11 16" }],
    ["path", { d: "M3.304 13h6.392" }],
];
var x9 = [
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["circle", { cx: "8", cy: "10", r: "2" }],
    ["path", { d: "M8 12h8" }],
    ["circle", { cx: "16", cy: "10", r: "2" }],
    [
        "path",
        { d: "m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3" },
    ],
];
var H9 = [
    [
        "path",
        { d: "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" },
    ],
    ["path", { d: "M2 12a9 9 0 0 1 8 8" }],
    ["path", { d: "M2 16a5 5 0 0 1 4 4" }],
    ["line", { x1: "2", x2: "2.01", y1: "20", y2: "20" }],
];
var z9 = [
    ["path", { d: "M10 5V3" }],
    ["path", { d: "M14 5V3" }],
    ["path", { d: "M15 21v-3a3 3 0 0 0-6 0v3" }],
    ["path", { d: "M18 3v8" }],
    ["path", { d: "M18 5H6" }],
    ["path", { d: "M22 11H2" }],
    ["path", { d: "M22 9v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9" }],
    ["path", { d: "M6 3v8" }],
];
var O9 = [
    [
        "path",
        {
            d: "M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z",
        },
    ],
    ["path", { d: "M8 14v.5" }],
    ["path", { d: "M16 14v.5" }],
    ["path", { d: "M11.25 16.25h1.5L12 17l-.75-.75Z" }],
];
var T9 = [
    [
        "path",
        {
            d: "M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97",
        },
    ],
    [
        "path",
        {
            d: "M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z",
        },
    ],
    ["path", { d: "M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" }],
    ["path", { d: "M2 21v-4" }],
    ["path", { d: "M7 9h.01" }],
];
var t = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    [
        "path",
        {
            d: "M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z",
        },
    ],
];
var U = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["rect", { x: "7", y: "13", width: "9", height: "4", rx: "1" }],
    ["rect", { x: "7", y: "5", width: "12", height: "4", rx: "1" }],
];
var D9 = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M7 11h8" }],
    ["path", { d: "M7 16h3" }],
    ["path", { d: "M7 6h12" }],
];
var F9 = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M7 11h8" }],
    ["path", { d: "M7 16h12" }],
    ["path", { d: "M7 6h3" }],
];
var A9 = [
    ["path", { d: "M11 13v4" }],
    ["path", { d: "M15 5v4" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["rect", { x: "7", y: "13", width: "9", height: "4", rx: "1" }],
    ["rect", { x: "7", y: "5", width: "12", height: "4", rx: "1" }],
];
var L = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M7 16h8" }],
    ["path", { d: "M7 11h12" }],
    ["path", { d: "M7 6h3" }],
];
var R = [
    ["path", { d: "M9 5v4" }],
    ["rect", { width: "4", height: "6", x: "7", y: "9", rx: "1" }],
    ["path", { d: "M9 15v2" }],
    ["path", { d: "M17 3v2" }],
    ["rect", { width: "4", height: "8", x: "15", y: "5", rx: "1" }],
    ["path", { d: "M17 13v3" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
];
var l = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["rect", { x: "15", y: "5", width: "4", height: "12", rx: "1" }],
    ["rect", { x: "7", y: "8", width: "4", height: "9", rx: "1" }],
];
var B9 = [
    ["path", { d: "M13 17V9" }],
    ["path", { d: "M18 17v-3" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M8 17V5" }],
];
var j = [
    ["path", { d: "M13 17V9" }],
    ["path", { d: "M18 17V5" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M8 17v-3" }],
];
var S9 = [
    ["path", { d: "M11 13H7" }],
    ["path", { d: "M19 9h-4" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["rect", { x: "15", y: "5", width: "4", height: "12", rx: "1" }],
    ["rect", { x: "7", y: "8", width: "4", height: "9", rx: "1" }],
];
var m = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M18 17V9" }],
    ["path", { d: "M13 17V5" }],
    ["path", { d: "M8 17v-3" }],
];
var v9 = [
    ["path", { d: "M10 6h8" }],
    ["path", { d: "M12 16h6" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M8 11h7" }],
];
var g = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "m19 9-5 5-4-4-3 3" }],
];
var y9 = [
    ["path", { d: "m13.11 7.664 1.78 2.672" }],
    ["path", { d: "m14.162 12.788-3.324 1.424" }],
    ["path", { d: "m20 4-6.06 1.515" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["circle", { cx: "12", cy: "6", r: "2" }],
    ["circle", { cx: "16", cy: "12", r: "2" }],
    ["circle", { cx: "9", cy: "15", r: "2" }],
];
var P9 = [
    ["path", { d: "M5 21V3" }],
    ["path", { d: "M12 21V9" }],
    ["path", { d: "M19 21v-6" }],
];
var u = [
    ["path", { d: "M5 21v-6" }],
    ["path", { d: "M12 21V9" }],
    ["path", { d: "M19 21V3" }],
];
var c = [
    ["path", { d: "M5 21v-6" }],
    ["path", { d: "M12 21V3" }],
    ["path", { d: "M19 21V9" }],
];
var q9 = [
    ["path", { d: "M12 16v5" }],
    ["path", { d: "M16 14v7" }],
    ["path", { d: "M20 10v11" }],
    [
        "path",
        {
            d: "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15",
        },
    ],
    ["path", { d: "M4 18v3" }],
    ["path", { d: "M8 14v7" }],
];
var n = [
    ["path", { d: "M6 5h12" }],
    ["path", { d: "M4 12h10" }],
    ["path", { d: "M12 19h8" }],
];
var i = [
    [
        "path",
        {
            d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
        },
    ],
    ["path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83" }],
];
var o = [
    ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }],
    ["circle", { cx: "18.5", cy: "5.5", r: ".5", fill: "currentColor" }],
    ["circle", { cx: "11.5", cy: "11.5", r: ".5", fill: "currentColor" }],
    ["circle", { cx: "7.5", cy: "16.5", r: ".5", fill: "currentColor" }],
    ["circle", { cx: "17.5", cy: "14.5", r: ".5", fill: "currentColor" }],
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
];
var C9 = [
    ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
    ["path", { d: "M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" }],
];
var h9 = [
    ["path", { d: "M18 6 7 17l-5-5" }],
    ["path", { d: "m22 10-7.5 7.5L13 16" }],
];
var b9 = [
    ["path", { d: "M20 4L9 15" }],
    ["path", { d: "M21 19L3 19" }],
    ["path", { d: "M9 15L4 10" }],
];
var k9 = [["path", { d: "M20 6 9 17l-5-5" }]];
var w9 = [
    [
        "path",
        {
            d: "M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z",
        },
    ],
    ["path", { d: "M6 17h12" }],
];
var f9 = [
    ["path", { d: "M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" }],
    ["path", { d: "M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" }],
    ["path", { d: "M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" }],
    ["path", { d: "M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" }],
];
var d9 = [
    ["path", { d: "m17 18-6-6 6-6" }],
    ["path", { d: "M7 6v12" }],
];
var M9 = [["path", { d: "m6 9 6 6 6-6" }]];
var t9 = [["path", { d: "m15 18-6-6 6-6" }]];
var U9 = [["path", { d: "m9 18 6-6-6-6" }]];
var L9 = [
    ["path", { d: "m7 18 6-6-6-6" }],
    ["path", { d: "M17 6v12" }],
];
var R9 = [["path", { d: "m18 15-6-6-6 6" }]];
var l9 = [
    ["path", { d: "m7 20 5-5 5 5" }],
    ["path", { d: "m7 4 5 5 5-5" }],
];
var j9 = [
    ["path", { d: "m7 6 5 5 5-5" }],
    ["path", { d: "m7 13 5 5 5-5" }],
];
var m9 = [
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M16 12h.01" }],
    ["path", { d: "m17 7 5 5-5 5" }],
    ["path", { d: "m7 7-5 5 5 5" }],
    ["path", { d: "M8 12h.01" }],
];
var g9 = [
    ["path", { d: "m9 7-5 5 5 5" }],
    ["path", { d: "m15 7 5 5-5 5" }],
];
var u9 = [
    ["path", { d: "m11 17-5-5 5-5" }],
    ["path", { d: "m18 17-5-5 5-5" }],
];
var c9 = [
    ["path", { d: "m20 17-5-5 5-5" }],
    ["path", { d: "m4 17 5-5-5-5" }],
];
var n9 = [
    ["path", { d: "m6 17 5-5-5-5" }],
    ["path", { d: "m13 17 5-5-5-5" }],
];
var i9 = [
    ["path", { d: "m7 15 5 5 5-5" }],
    ["path", { d: "m7 9 5-5 5 5" }],
];
var o9 = [
    ["path", { d: "m17 11-5-5-5 5" }],
    ["path", { d: "m17 18-5-5-5 5" }],
];
var r = [
    ["path", { d: "M10.88 21.94 15.46 14" }],
    ["path", { d: "M21.17 8H12" }],
    ["path", { d: "M3.95 6.06 8.54 14" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["circle", { cx: "12", cy: "12", r: "4" }],
];
var r9 = [
    ["path", { d: "M10 9h4" }],
    ["path", { d: "M12 7v5" }],
    ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }],
    [
        "path",
        {
            d: "m18 9 3.52 2.147a1 1 0 0 1 .48.854V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6.999a1 1 0 0 1 .48-.854L6 9",
        },
    ],
    [
        "path",
        {
            d: "M6 21V7a1 1 0 0 1 .376-.782l5-3.999a1 1 0 0 1 1.249.001l5 4A1 1 0 0 1 18 7v14",
        },
    ],
];
var e9 = [
    ["path", { d: "M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13" }],
    ["path", { d: "M18 8c0-2.5-2-2.5-2-5" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866" }],
    ["path", { d: "M22 8c0-2.5-2-2.5-2-5" }],
    ["path", { d: "M7 12v4" }],
];
var s9 = [
    ["path", { d: "M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14" }],
    ["path", { d: "M18 8c0-2.5-2-2.5-2-5" }],
    ["path", { d: "M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }],
    ["path", { d: "M22 8c0-2.5-2-2.5-2-5" }],
    ["path", { d: "M7 12v4" }],
];
var e = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }],
];
var s = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 8v8" }],
    ["path", { d: "m8 12 4 4 4-4" }],
];
var p = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m12 8-4 4 4 4" }],
    ["path", { d: "M16 12H8" }],
];
var a = [
    ["path", { d: "M2 12a10 10 0 1 1 10 10" }],
    ["path", { d: "m2 22 10-10" }],
    ["path", { d: "M8 22H2v-6" }],
];
var I1 = [
    ["path", { d: "M12 22a10 10 0 1 1 10-10" }],
    ["path", { d: "M22 22 12 12" }],
    ["path", { d: "M22 16v6h-6" }],
];
var E1 = [
    ["path", { d: "M2 8V2h6" }],
    ["path", { d: "m2 2 10 10" }],
    ["path", { d: "M12 2A10 10 0 1 1 2 12" }],
];
var N1 = [
    ["path", { d: "M22 12A10 10 0 1 1 12 2" }],
    ["path", { d: "M22 2 12 12" }],
    ["path", { d: "M16 2h6v6" }],
];
var $1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m12 16 4-4-4-4" }],
    ["path", { d: "M8 12h8" }],
];
var _1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m16 12-4-4-4 4" }],
    ["path", { d: "M12 16V8" }],
];
var Z1 = [
    ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335" }],
    ["path", { d: "m9 11 3 3L22 4" }],
];
var Y1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m9 12 2 2 4-4" }],
];
var Q1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m16 10-4 4-4-4" }],
];
var J1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m14 16-4-4 4-4" }],
];
var K1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m10 8 4 4-4 4" }],
];
var X1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m8 14 4-4 4 4" }],
];
var p9 = [
    ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0" }],
    ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0" }],
    ["path", { d: "M17.609 3.721a10 10 0 0 1 2.69 2.7" }],
    ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8" }],
    ["path", { d: "M20.279 17.609a10 10 0 0 1-2.7 2.69" }],
    ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8" }],
    ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69" }],
    ["path", { d: "M6.391 20.279a10 10 0 0 1-2.69-2.7" }],
];
var V1 = [
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
    ["line", { x1: "12", x2: "12", y1: "16", y2: "16" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "8" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var a9 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
    ["path", { d: "M12 18V6" }],
];
var I3 = [
    ["path", { d: "M10.1 2.18a9.93 9.93 0 0 1 3.8 0" }],
    ["path", { d: "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" }],
    ["path", { d: "M21.82 10.1a9.93 9.93 0 0 1 0 3.8" }],
    ["path", { d: "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" }],
    ["path", { d: "M13.9 21.82a9.94 9.94 0 0 1-3.8 0" }],
    ["path", { d: "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" }],
    ["path", { d: "M2.18 13.9a9.93 9.93 0 0 1 0-3.8" }],
    ["path", { d: "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" }],
    ["circle", { cx: "12", cy: "12", r: "1" }],
];
var E3 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M17 12h.01" }],
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M7 12h.01" }],
];
var N3 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["circle", { cx: "12", cy: "12", r: "1" }],
];
var $3 = [
    ["path", { d: "M7 10h10" }],
    ["path", { d: "M7 14h10" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var _3 = [
    ["path", { d: "M12 2a10 10 0 0 1 7.38 16.75" }],
    ["path", { d: "m16 12-4-4-4 4" }],
    ["path", { d: "M12 16V8" }],
    ["path", { d: "M2.5 8.875a10 10 0 0 0-.5 3" }],
    ["path", { d: "M2.83 16a10 10 0 0 0 2.43 3.4" }],
    ["path", { d: "M4.636 5.235a10 10 0 0 1 .891-.857" }],
    ["path", { d: "M8.644 21.42a10 10 0 0 0 7.631-.38" }],
];
var Z3 = [
    ["path", { d: "M12 2a10 10 0 0 1 7.38 16.75" }],
    ["path", { d: "M12 8v8" }],
    ["path", { d: "M16 12H8" }],
    ["path", { d: "M2.5 8.875a10 10 0 0 0-.5 3" }],
    ["path", { d: "M2.83 16a10 10 0 0 0 2.43 3.4" }],
    ["path", { d: "M4.636 5.235a10 10 0 0 1 .891-.857" }],
    ["path", { d: "M8.644 21.42a10 10 0 0 0 7.631-.38" }],
];
var G1 = [
    ["path", { d: "M15.6 2.7a10 10 0 1 0 5.7 5.7" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
    ["path", { d: "M13.4 10.6 19 5" }],
];
var W1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M8 12h8" }],
];
var Y3 = [
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M8.35 2.69A10 10 0 0 1 21.3 15.65" }],
    ["path", { d: "M19.08 19.08A10 10 0 1 1 4.92 4.92" }],
];
var x1 = [
    ["path", { d: "M12.656 7H13a3 3 0 0 1 2.984 3.307" }],
    ["path", { d: "M13 13H9" }],
    ["path", { d: "M19.071 19.071A1 1 0 0 1 4.93 4.93" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M8.357 2.687a10 10 0 0 1 12.956 12.956" }],
    ["path", { d: "M9 17V9" }],
];
var H1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M9 17V7h4a3 3 0 0 1 0 6H9" }],
];
var z1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "10", x2: "10", y1: "15", y2: "9" }],
    ["line", { x1: "14", x2: "14", y1: "15", y2: "9" }],
];
var O1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "M9 9h.01" }],
    ["path", { d: "M15 15h.01" }],
];
var T1 = [
    [
        "path",
        {
            d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var Q3 = [
    ["path", { d: "M10 16V9.5a1 1 0 0 1 5 0" }],
    ["path", { d: "M8 12h4" }],
    ["path", { d: "M8 16h7" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var D1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "M12 8v8" }],
];
var F1 = [
    ["path", { d: "M12 7v4" }],
    ["path", { d: "M7.998 9.003a5 5 0 1 0 8-.005" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var K = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
    ["path", { d: "M12 17h.01" }],
];
var A1 = [
    ["path", { d: "M22 2 2 22" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var J3 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "9", x2: "15", y1: "15", y2: "9" }],
];
var K3 = [["circle", { cx: "12", cy: "12", r: "6" }]];
var X3 = [
    [
        "path",
        {
            d: "M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var B1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" }],
];
var S1 = [
    ["path", { d: "M18 20a6 6 0 0 0-12 0" }],
    ["circle", { cx: "12", cy: "10", r: "4" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var v1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["circle", { cx: "12", cy: "10", r: "3" }],
    ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" }],
];
var y1 = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "m9 9 6 6" }],
];
var V3 = [["circle", { cx: "12", cy: "12", r: "10" }]];
var G3 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M11 9h4a2 2 0 0 0 2-2V3" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
    ["path", { d: "M7 21v-4a2 2 0 0 1 2-2h4" }],
    ["circle", { cx: "15", cy: "15", r: "2" }],
];
var W3 = [
    [
        "path",
        {
            d: "M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z",
        },
    ],
    ["path", { d: "M19.65 15.66A8 8 0 0 1 8.35 4.34" }],
    ["path", { d: "m14 10-5.5 5.5" }],
    ["path", { d: "M14 17.85V10H6.15" }],
];
var x3 = [
    [
        "path",
        {
            d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z",
        },
    ],
    ["path", { d: "m6.2 5.3 3.1 3.9" }],
    ["path", { d: "m12.4 3.4 3.1 4" }],
    ["path", { d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" }],
];
var H3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
    ],
    ["path", { d: "m9 14 2 2 4-4" }],
];
var z3 = [
    ["path", { d: "M16 14v2.2l1.6 1" }],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v.832" }],
    ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" }],
    ["circle", { cx: "16", cy: "16", r: "6" }],
    ["rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" }],
];
var O3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" },
    ],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4" }],
    ["path", { d: "M21 14H11" }],
    ["path", { d: "m15 10-4 4 4 4" }],
];
var T3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
    ],
    ["path", { d: "M12 11h4" }],
    ["path", { d: "M12 16h4" }],
    ["path", { d: "M8 11h.01" }],
    ["path", { d: "M8 16h.01" }],
];
var D3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
    ],
    ["path", { d: "M9 14h6" }],
];
var F3 = [
    ["path", { d: "M11 14h10" }],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v1.344" }],
    ["path", { d: "m17 18 4-4-4-4" }],
    [
        "path",
        { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113" },
    ],
    ["rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" }],
];
var P1 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1" }],
    [
        "path",
        { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" },
    ],
    ["path", { d: "M16 4h2a2 2 0 0 1 1.73 1" }],
    ["path", { d: "M8 18h1" }],
    [
        "path",
        {
            d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
];
var q1 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1" }],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5" }],
    ["path", { d: "M4 13.5V6a2 2 0 0 1 2-2h2" }],
    [
        "path",
        {
            d: "M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
];
var A3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
    ],
    ["path", { d: "M9 14h6" }],
    ["path", { d: "M12 17v-6" }],
];
var B3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
    ],
    ["path", { d: "M9 12v-1h6v1" }],
    ["path", { d: "M11 17h2" }],
    ["path", { d: "M12 11v6" }],
];
var S3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
    ],
    ["path", { d: "m15 11-6 6" }],
    ["path", { d: "m9 11 6 6" }],
];
var v3 = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        },
    ],
];
var y3 = [
    ["path", { d: "M12 6v6l2-4" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var P3 = [
    ["path", { d: "M12 6v6l-4-2" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var q3 = [
    ["path", { d: "M12 6v6l-2-4" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var C3 = [
    ["path", { d: "M12 6v6" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var h3 = [
    ["path", { d: "M12 6v6l4-2" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var b3 = [
    ["path", { d: "M12 6v6h4" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var k3 = [
    ["path", { d: "M12 6v6l4 2" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var w3 = [
    ["path", { d: "M12 6v6l2 4" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var f3 = [
    ["path", { d: "M12 6v10" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var d3 = [
    ["path", { d: "M12 6v6l-2 4" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var M3 = [
    ["path", { d: "M12 6v6l-4 2" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var t3 = [
    ["path", { d: "M12 6v6H8" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var U3 = [
    ["path", { d: "M12 6v6l4 2" }],
    ["path", { d: "M20 12v5" }],
    ["path", { d: "M20 21h.01" }],
    ["path", { d: "M21.25 8.2A10 10 0 1 0 16 21.16" }],
];
var L3 = [
    ["path", { d: "M12 6v6l2 1" }],
    ["path", { d: "M12.337 21.994a10 10 0 1 1 9.588-8.767" }],
    ["path", { d: "m14 18 4 4 4-4" }],
    ["path", { d: "M18 14v8" }],
];
var R3 = [
    ["path", { d: "M12 6v6l1.56.78" }],
    ["path", { d: "M13.227 21.925a10 10 0 1 1 8.767-9.588" }],
    ["path", { d: "m14 18 4-4 4 4" }],
    ["path", { d: "M18 22v-8" }],
];
var l3 = [
    ["path", { d: "M12 2a10 10 0 0 1 7.38 16.75" }],
    ["path", { d: "M12 6v6l4 2" }],
    ["path", { d: "M2.5 8.875a10 10 0 0 0-.5 3" }],
    ["path", { d: "M2.83 16a10 10 0 0 0 2.43 3.4" }],
    ["path", { d: "M4.636 5.235a10 10 0 0 1 .891-.857" }],
    ["path", { d: "M8.644 21.42a10 10 0 0 0 7.631-.38" }],
];
var j3 = [
    ["path", { d: "M12 6v6l3.644 1.822" }],
    ["path", { d: "M16 19h6" }],
    ["path", { d: "M19 16v6" }],
    ["path", { d: "M21.92 13.267a10 10 0 1 0-8.653 8.653" }],
];
var m3 = [
    ["path", { d: "M12 6v6l4 2" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var g3 = [
    ["path", { d: "M10 9.17a3 3 0 1 0 0 5.66" }],
    ["path", { d: "M17 9.17a3 3 0 1 0 0 5.66" }],
    ["rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }],
];
var u3 = [
    ["path", { d: "M12 12v4" }],
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708" }],
];
var c3 = [
    ["path", { d: "m17 15-5.5 5.5L9 18" }],
    [
        "path",
        { d: "M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742" },
    ],
];
var n3 = [
    ["path", { d: "m10.852 19.772-.383.924" }],
    ["path", { d: "m13.148 14.228.383-.923" }],
    ["path", { d: "M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923" }],
    ["path", { d: "m13.53 20.696-.382-.924a3 3 0 1 1-2.296-5.544" }],
    ["path", { d: "m14.772 15.852.923-.383" }],
    ["path", { d: "m14.772 18.148.923.383" }],
    [
        "path",
        {
            d: "M4.2 15.1a7 7 0 1 1 9.93-9.858A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2",
        },
    ],
    ["path", { d: "m9.228 15.852-.923-.383" }],
    ["path", { d: "m9.228 18.148-.923.383" }],
];
var C1 = [
    ["path", { d: "M12 13v8l-4-4" }],
    ["path", { d: "m12 21 4-4" }],
    [
        "path",
        { d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" },
    ],
];
var i3 = [
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "M8 19v1" }],
    ["path", { d: "M8 14v1" }],
    ["path", { d: "M16 19v1" }],
    ["path", { d: "M16 14v1" }],
    ["path", { d: "M12 21v1" }],
    ["path", { d: "M12 16v1" }],
];
var o3 = [
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "M16 17H7" }],
    ["path", { d: "M17 21H9" }],
];
var r3 = [
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "M16 14v2" }],
    ["path", { d: "M8 14v2" }],
    ["path", { d: "M16 20h.01" }],
    ["path", { d: "M8 20h.01" }],
    ["path", { d: "M12 16v2" }],
    ["path", { d: "M12 22h.01" }],
];
var e3 = [
    ["path", { d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" }],
    ["path", { d: "m13 12-3 5h4l-3 5" }],
];
var s3 = [
    ["path", { d: "M11 20v2" }],
    [
        "path",
        {
            d: "M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36",
        },
    ],
    ["path", { d: "M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" }],
    ["path", { d: "M7 19v2" }],
];
var p3 = [
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" }],
    [
        "path",
        {
            d: "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07",
        },
    ],
];
var a3 = [
    ["path", { d: "M13 16a3 3 0 0 1 0 6H7a5 5 0 1 1 4.9-6z" }],
    [
        "path",
        {
            d: "M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36",
        },
    ],
];
var II = [
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "m9.2 22 3-7" }],
    ["path", { d: "m9 13-3 7" }],
    ["path", { d: "m17 13-3 7" }],
];
var EI = [
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "M16 14v6" }],
    ["path", { d: "M8 14v6" }],
    ["path", { d: "M12 16v6" }],
];
var NI = [
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "M8 15h.01" }],
    ["path", { d: "M8 19h.01" }],
    ["path", { d: "M12 17h.01" }],
    ["path", { d: "M12 21h.01" }],
    ["path", { d: "M16 15h.01" }],
    ["path", { d: "M16 19h.01" }],
];
var $I = [
    ["path", { d: "M12 2v2" }],
    ["path", { d: "m4.93 4.93 1.41 1.41" }],
    ["path", { d: "M20 12h2" }],
    ["path", { d: "m19.07 4.93-1.41 1.41" }],
    ["path", { d: "M15.947 12.65a4 4 0 0 0-5.925-4.128" }],
    ["path", { d: "M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" }],
    ["path", { d: "M11 20v2" }],
    ["path", { d: "M7 19v2" }],
];
var _I = [
    ["path", { d: "M12 2v2" }],
    ["path", { d: "m4.93 4.93 1.41 1.41" }],
    ["path", { d: "M20 12h2" }],
    ["path", { d: "m19.07 4.93-1.41 1.41" }],
    ["path", { d: "M15.947 12.65a4 4 0 0 0-5.925-4.128" }],
    ["path", { d: "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" }],
];
var h1 = [
    ["path", { d: "M12 13v8" }],
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "m8 17 4-4 4 4" }],
];
var ZI = [
    ["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" }],
];
var YI = [
    ["path", { d: "M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" }],
    ["path", { d: "M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" }],
];
var QI = [
    ["path", { d: "M16.17 7.83 2 22" }],
    [
        "path",
        {
            d: "M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12",
        },
    ],
    ["path", { d: "m7.83 7.83 8.34 8.34" }],
];
var JI = [
    [
        "path",
        {
            d: "M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z",
        },
    ],
    ["path", { d: "M12 17.66L12 22" }],
];
var b1 = [
    ["path", { d: "m18 16 4-4-4-4" }],
    ["path", { d: "m6 8-4 4 4 4" }],
    ["path", { d: "m14.5 4-5 16" }],
];
var KI = [
    ["path", { d: "m16 18 6-6-6-6" }],
    ["path", { d: "m8 6-6 6 6 6" }],
];
var XI = [
    ["polygon", { points: "12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "15.5" }],
    ["polyline", { points: "22 8.5 12 15.5 2 8.5" }],
    ["polyline", { points: "2 15.5 12 8.5 22 15.5" }],
    ["line", { x1: "12", x2: "12", y1: "2", y2: "8.5" }],
];
var VI = [
    [
        "path",
        {
            d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        },
    ],
    ["polyline", { points: "7.5 4.21 12 6.81 16.5 4.21" }],
    ["polyline", { points: "7.5 19.79 7.5 14.6 3 12" }],
    ["polyline", { points: "21 12 16.5 14.6 16.5 19.79" }],
    ["polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }],
    ["line", { x1: "12", x2: "12", y1: "22.08", y2: "12" }],
];
var GI = [
    ["path", { d: "M10 2v2" }],
    ["path", { d: "M14 2v2" }],
    [
        "path",
        {
            d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
        },
    ],
    ["path", { d: "M6 2v2" }],
];
var WI = [
    ["path", { d: "M11 10.27 7 3.34" }],
    ["path", { d: "m11 13.73-4 6.93" }],
    ["path", { d: "M12 22v-2" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M14 12h8" }],
    ["path", { d: "m17 20.66-1-1.73" }],
    ["path", { d: "m17 3.34-1 1.73" }],
    ["path", { d: "M2 12h2" }],
    ["path", { d: "m20.66 17-1.73-1" }],
    ["path", { d: "m20.66 7-1.73 1" }],
    ["path", { d: "m3.34 17 1.73-1" }],
    ["path", { d: "m3.34 7 1.73 1" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
    ["circle", { cx: "12", cy: "12", r: "8" }],
];
var xI = [
    ["circle", { cx: "8", cy: "8", r: "6" }],
    ["path", { d: "M18.09 10.37A6 6 0 1 1 10.34 18" }],
    ["path", { d: "M7 6h1v4" }],
    ["path", { d: "m16.71 13.88.7.71-2.82 2.82" }],
];
var k1 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M12 3v18" }],
];
var X = [
    [
        "path",
        { d: "M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" },
    ],
    ["path", { d: "m14.3 19.6 1-.4" }],
    ["path", { d: "M15 3v7.5" }],
    ["path", { d: "m15.2 16.9-.9-.3" }],
    ["path", { d: "m16.6 21.7.3-.9" }],
    ["path", { d: "m16.8 15.3-.4-1" }],
    ["path", { d: "m19.1 15.2.3-.9" }],
    ["path", { d: "m19.6 21.7-.4-1" }],
    ["path", { d: "m20.7 16.8 1-.4" }],
    ["path", { d: "m21.7 19.4-.9-.3" }],
    ["path", { d: "M9 3v18" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
];
var w1 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "M15 3v18" }],
];
var HI = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7.5 3v18" }],
    ["path", { d: "M12 3v18" }],
    ["path", { d: "M16.5 3v18" }],
];
var zI = [
    ["path", { d: "M10 18H5a3 3 0 0 1-3-3v-1" }],
    ["path", { d: "M14 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
    ["path", { d: "M20 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
    ["path", { d: "m7 21 3-3-3-3" }],
    ["rect", { x: "14", y: "14", width: "8", height: "8", rx: "2" }],
    ["rect", { x: "2", y: "2", width: "8", height: "8", rx: "2" }],
];
var OI = [
    [
        "path",
        {
            d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var TI = [
    [
        "path",
        {
            d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3",
        },
    ],
];
var DI = [
    [
        "path",
        {
            d: "M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",
        },
    ],
    [
        "path",
        {
            d: "M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z",
        },
    ],
    [
        "path",
        {
            d: "M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z",
        },
    ],
    [
        "path",
        {
            d: "M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z",
        },
    ],
];
var FI = [
    ["rect", { width: "14", height: "8", x: "5", y: "2", rx: "2" }],
    ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
    ["path", { d: "M6 18h2" }],
    ["path", { d: "M12 18h6" }],
];
var AI = [
    [
        "path",
        {
            d: "M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z",
        },
    ],
    ["path", { d: "M20 16a8 8 0 1 0-16 0" }],
    ["path", { d: "M12 4v4" }],
    ["path", { d: "M10 4h4" }],
];
var BI = [
    ["path", { d: "m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98" }],
    ["ellipse", { cx: "12", cy: "19", rx: "9", ry: "3" }],
];
var SI = [
    ["rect", { x: "2", y: "6", width: "20", height: "8", rx: "1" }],
    ["path", { d: "M17 14v7" }],
    ["path", { d: "M7 14v7" }],
    ["path", { d: "M17 3v3" }],
    ["path", { d: "M7 3v3" }],
    ["path", { d: "M10 14 2.3 6.3" }],
    ["path", { d: "m14 6 7.7 7.7" }],
    ["path", { d: "m8 6 8 8" }],
];
var f1 = [
    ["path", { d: "M16 2v2" }],
    ["path", { d: "M17.915 22a6 6 0 0 0-12 0" }],
    ["path", { d: "M8 2v2" }],
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }],
];
var vI = [
    ["path", { d: "M16 2v2" }],
    ["path", { d: "M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M8 2v2" }],
    ["circle", { cx: "12", cy: "11", r: "3" }],
    ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }],
];
var yI = [
    [
        "path",
        {
            d: "M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z",
        },
    ],
    ["path", { d: "M10 21.9V14L2.1 9.1" }],
    ["path", { d: "m10 14 11.9-6.9" }],
    ["path", { d: "M14 19.8v-8.1" }],
    ["path", { d: "M18 17.5V9.4" }],
];
var PI = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 18a6 6 0 0 0 0-12v12z" }],
];
var qI = [
    ["path", { d: "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" }],
    ["path", { d: "M8.5 8.5v.01" }],
    ["path", { d: "M16 15.5v.01" }],
    ["path", { d: "M12 12v.01" }],
    ["path", { d: "M11 17v.01" }],
    ["path", { d: "M7 14v.01" }],
];
var CI = [
    ["path", { d: "M2 12h20" }],
    ["path", { d: "M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" }],
    ["path", { d: "m4 8 16-4" }],
    [
        "path",
        {
            d: "m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8",
        },
    ],
];
var hI = [
    ["path", { d: "m12 15 2 2 4-4" }],
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
];
var bI = [
    ["line", { x1: "12", x2: "18", y1: "15", y2: "15" }],
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
];
var kI = [
    ["line", { x1: "15", x2: "15", y1: "12", y2: "18" }],
    ["line", { x1: "12", x2: "18", y1: "15", y2: "15" }],
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
];
var wI = [
    ["line", { x1: "12", x2: "18", y1: "18", y2: "12" }],
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
];
var fI = [
    ["line", { x1: "12", x2: "18", y1: "12", y2: "18" }],
    ["line", { x1: "12", x2: "18", y1: "18", y2: "12" }],
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
];
var dI = [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
];
var MI = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M14.83 14.83a4 4 0 1 1 0-5.66" }],
];
var tI = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M9.17 14.83a4 4 0 1 0 0-5.66" }],
];
var UI = [
    ["path", { d: "M20 4v7a4 4 0 0 1-4 4H4" }],
    ["path", { d: "m9 10-5 5 5 5" }],
];
var LI = [
    ["path", { d: "m15 10 5 5-5 5" }],
    ["path", { d: "M4 4v7a4 4 0 0 0 4 4h12" }],
];
var RI = [
    ["path", { d: "m14 15-5 5-5-5" }],
    ["path", { d: "M20 4h-7a4 4 0 0 0-4 4v12" }],
];
var lI = [
    ["path", { d: "M14 9 9 4 4 9" }],
    ["path", { d: "M20 20h-7a4 4 0 0 1-4-4V4" }],
];
var jI = [
    ["path", { d: "m10 15 5 5 5-5" }],
    ["path", { d: "M4 4h7a4 4 0 0 1 4 4v12" }],
];
var mI = [
    ["path", { d: "m10 9 5-5 5 5" }],
    ["path", { d: "M4 20h7a4 4 0 0 0 4-4V4" }],
];
var gI = [
    ["path", { d: "M20 20v-7a4 4 0 0 0-4-4H4" }],
    ["path", { d: "M9 14 4 9l5-5" }],
];
var uI = [
    ["path", { d: "m15 14 5-5-5-5" }],
    ["path", { d: "M4 20v-7a4 4 0 0 1 4-4h12" }],
];
var cI = [
    ["path", { d: "M12 20v2" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M17 20v2" }],
    ["path", { d: "M17 2v2" }],
    ["path", { d: "M2 12h2" }],
    ["path", { d: "M2 17h2" }],
    ["path", { d: "M2 7h2" }],
    ["path", { d: "M20 12h2" }],
    ["path", { d: "M20 17h2" }],
    ["path", { d: "M20 7h2" }],
    ["path", { d: "M7 20v2" }],
    ["path", { d: "M7 2v2" }],
    ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }],
    ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1" }],
];
var nI = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    [
        "path",
        {
            d: "M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",
        },
    ],
    [
        "path",
        {
            d: "M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1",
        },
    ],
];
var iI = [
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2" }],
    ["line", { x1: "2", x2: "22", y1: "10", y2: "10" }],
];
var oI = [
    [
        "path",
        { d: "M10.2 18H4.774a1.5 1.5 0 0 1-1.352-.97 11 11 0 0 1 .132-6.487" },
    ],
    [
        "path",
        { d: "M18 10.2V4.774a1.5 1.5 0 0 0-.97-1.352 11 11 0 0 0-6.486.132" },
    ],
    ["path", { d: "M18 5a4 3 0 0 1 4 3 2 2 0 0 1-2 2 10 10 0 0 0-5.139 1.42" }],
    ["path", { d: "M5 18a3 4 0 0 0 3 4 2 2 0 0 0 2-2 10 10 0 0 1 1.42-5.14" }],
    [
        "path",
        {
            d: "M8.709 2.554a10 10 0 0 0-6.155 6.155 1.5 1.5 0 0 0 .676 1.626l9.807 5.42a2 2 0 0 0 2.718-2.718l-5.42-9.807a1.5 1.5 0 0 0-1.626-.676",
        },
    ],
];
var rI = [
    ["path", { d: "M6 2v14a2 2 0 0 0 2 2h14" }],
    ["path", { d: "M18 22V8a2 2 0 0 0-2-2H2" }],
];
var eI = [
    [
        "path",
        {
            d: "M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z",
        },
    ],
];
var sI = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "22", x2: "18", y1: "12", y2: "12" }],
    ["line", { x1: "6", x2: "2", y1: "12", y2: "12" }],
    ["line", { x1: "12", x2: "12", y1: "6", y2: "2" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "18" }],
];
var pI = [
    [
        "path",
        {
            d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
        },
    ],
    ["path", { d: "M5 21h14" }],
];
var aI = [
    [
        "path",
        {
            d: "m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z",
        },
    ],
    ["path", { d: "M10 22v-8L2.25 9.15" }],
    ["path", { d: "m10 14 11.77-6.87" }],
];
var IE = [
    [
        "path",
        { d: "m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" },
    ],
    ["path", { d: "M5 8h14" }],
    ["path", { d: "M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" }],
    ["path", { d: "m12 8 1-6h2" }],
];
var EE = [
    ["circle", { cx: "12", cy: "12", r: "8" }],
    ["line", { x1: "3", x2: "6", y1: "3", y2: "6" }],
    ["line", { x1: "21", x2: "18", y1: "3", y2: "6" }],
    ["line", { x1: "3", x2: "6", y1: "21", y2: "18" }],
    ["line", { x1: "21", x2: "18", y1: "21", y2: "18" }],
];
var NE = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
    ["path", { d: "M3 5v14a9 3 0 0 0 18 0V5" }],
];
var $E = [
    [
        "path",
        {
            d: "M11 11.31c1.17.56 1.54 1.69 3.5 1.69 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
    ],
    [
        "path",
        {
            d: "M11.75 18c.35.5 1.45 1 2.75 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
    ],
    ["path", { d: "M2 10h4" }],
    ["path", { d: "M2 14h4" }],
    ["path", { d: "M2 18h4" }],
    ["path", { d: "M2 6h4" }],
    [
        "path",
        {
            d: "M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L10 4a1 1 0 0 0-1-1z",
        },
    ],
];
var _E = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
    ["path", { d: "M3 12a9 3 0 0 0 5 2.69" }],
    ["path", { d: "M21 9.3V5" }],
    ["path", { d: "M3 5v14a9 3 0 0 0 6.47 2.88" }],
    ["path", { d: "M12 12v4h4" }],
    [
        "path",
        {
            d: "M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16",
        },
    ],
];
var ZE = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 15 21.84" }],
    ["path", { d: "M21 5V8" }],
    ["path", { d: "M21 12L18 17H22L19 22" }],
    ["path", { d: "M3 12A9 3 0 0 0 14.59 14.87" }],
];
var YE = [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12" }],
];
var QE = [
    ["path", { d: "m13 21-3-3 3-3" }],
    ["path", { d: "M20 18H10" }],
    ["path", { d: "M3 11h.01" }],
    ["rect", { x: "6", y: "3", width: "5", height: "8", rx: "2.5" }],
];
var JE = [
    ["path", { d: "M10 18h10" }],
    ["path", { d: "m17 21 3-3-3-3" }],
    ["path", { d: "M3 11h.01" }],
    ["rect", { x: "15", y: "3", width: "5", height: "8", rx: "2.5" }],
    ["rect", { x: "6", y: "3", width: "5", height: "8", rx: "2.5" }],
];
var KE = [
    [
        "path",
        {
            d: "M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z",
        },
    ],
    ["path", { d: "m12 9 6 6" }],
    ["path", { d: "m18 9-6 6" }],
];
var XE = [
    [
        "path",
        {
            d: "M10.162 3.167A10 10 0 0 0 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4-.006 10 10 0 0 0-8.161-9.826",
        },
    ],
    ["path", { d: "M20.804 14.869a9 9 0 0 1-17.608 0" }],
    ["circle", { cx: "12", cy: "4", r: "2" }],
];
var VE = [
    ["circle", { cx: "19", cy: "19", r: "2" }],
    ["circle", { cx: "5", cy: "5", r: "2" }],
    ["path", { d: "M6.48 3.66a10 10 0 0 1 13.86 13.86" }],
    ["path", { d: "m6.41 6.41 11.18 11.18" }],
    ["path", { d: "M3.66 6.48a10 10 0 0 0 13.86 13.86" }],
];
var GE = [
    [
        "path",
        {
            d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z",
        },
    ],
    ["path", { d: "M8 12h8" }],
];
var d1 = [
    [
        "path",
        {
            d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z",
        },
    ],
    ["path", { d: "M9.2 9.2h.01" }],
    ["path", { d: "m14.5 9.5-5 5" }],
    ["path", { d: "M14.7 14.8h.01" }],
];
var WE = [
    ["path", { d: "M12 8v8" }],
    [
        "path",
        {
            d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z",
        },
    ],
    ["path", { d: "M8 12h8" }],
];
var xE = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "M12 12h.01" }],
];
var HE = [
    [
        "path",
        {
            d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
        },
    ],
];
var zE = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "M15 9h.01" }],
    ["path", { d: "M9 15h.01" }],
];
var OE = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "M16 8h.01" }],
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M8 16h.01" }],
];
var TE = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "M16 8h.01" }],
    ["path", { d: "M8 8h.01" }],
    ["path", { d: "M8 16h.01" }],
    ["path", { d: "M16 16h.01" }],
];
var DE = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "M16 8h.01" }],
    ["path", { d: "M8 8h.01" }],
    ["path", { d: "M8 16h.01" }],
    ["path", { d: "M16 16h.01" }],
    ["path", { d: "M12 12h.01" }],
];
var FE = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "M16 8h.01" }],
    ["path", { d: "M16 12h.01" }],
    ["path", { d: "M16 16h.01" }],
    ["path", { d: "M8 8h.01" }],
    ["path", { d: "M8 12h.01" }],
    ["path", { d: "M8 16h.01" }],
];
var AE = [
    ["rect", { width: "12", height: "12", x: "2", y: "10", rx: "2", ry: "2" }],
    [
        "path",
        {
            d: "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6",
        },
    ],
    ["path", { d: "M6 18h.01" }],
    ["path", { d: "M10 14h.01" }],
    ["path", { d: "M15 6h.01" }],
    ["path", { d: "M18 9h.01" }],
];
var BE = [
    ["path", { d: "M12 3v14" }],
    ["path", { d: "M5 10h14" }],
    ["path", { d: "M5 21h14" }],
];
var SE = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["path", { d: "M12 12h.01" }],
];
var vE = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M6 12c0-1.7.7-3.2 1.8-4.2" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
    ["path", { d: "M18 12c0 1.7-.7 3.2-1.8 4.2" }],
];
var yE = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["circle", { cx: "12", cy: "12", r: "5" }],
    ["path", { d: "M12 12h.01" }],
];
var PE = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var qE = [
    ["circle", { cx: "12", cy: "6", r: "1" }],
    ["line", { x1: "5", x2: "19", y1: "12", y2: "12" }],
    ["circle", { cx: "12", cy: "18", r: "1" }],
];
var CE = [
    ["path", { d: "M15 2c-1.35 1.5-2.092 3-2.5 4.5L14 8" }],
    ["path", { d: "m17 6-2.891-2.891" }],
    ["path", { d: "M2 15c3.333-3 6.667-3 10-3" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "m20 9 .891.891" }],
    ["path", { d: "M22 9c-1.5 1.35-3 2.092-4.5 2.5l-1-1" }],
    ["path", { d: "M3.109 14.109 4 15" }],
    ["path", { d: "m6.5 12.5 1 1" }],
    ["path", { d: "m7 18 2.891 2.891" }],
    ["path", { d: "M9 22c1.35-1.5 2.092-3 2.5-4.5L10 16" }],
];
var hE = [
    ["path", { d: "m10 16 1.5 1.5" }],
    ["path", { d: "m14 8-1.5-1.5" }],
    ["path", { d: "M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" }],
    ["path", { d: "m16.5 10.5 1 1" }],
    ["path", { d: "m17 6-2.891-2.891" }],
    ["path", { d: "M2 15c6.667-6 13.333 0 20-6" }],
    ["path", { d: "m20 9 .891.891" }],
    ["path", { d: "M3.109 14.109 4 15" }],
    ["path", { d: "m6.5 12.5 1 1" }],
    ["path", { d: "m7 18 2.891 2.891" }],
    ["path", { d: "M9 22c1.798-1.998 2.518-3.995 2.807-5.993" }],
];
var bE = [
    ["path", { d: "M11.25 16.25h1.5L12 17z" }],
    ["path", { d: "M16 14v.5" }],
    [
        "path",
        {
            d: "M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309",
        },
    ],
    ["path", { d: "M8 14v.5" }],
    [
        "path",
        {
            d: "M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5",
        },
    ],
];
var kE = [
    ["path", { d: "M2 8h20" }],
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["path", { d: "M6 16h12" }],
];
var wE = [
    ["line", { x1: "12", x2: "12", y1: "2", y2: "22" }],
    ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }],
];
var fE = [
    [
        "path",
        {
            d: "M20.5 10a2.5 2.5 0 0 1-2.4-3H18a2.95 2.95 0 0 1-2.6-4.4 10 10 0 1 0 6.3 7.1c-.3.2-.8.3-1.2.3",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }],
];
var dE = [
    ["path", { d: "M10 12h.01" }],
    ["path", { d: "M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" }],
    ["path", { d: "M2 20h8" }],
    ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }],
    ["rect", { x: "14", y: "17", width: "8", height: "5", rx: "1" }],
];
var ME = [
    ["path", { d: "M10 12h.01" }],
    ["path", { d: "M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" }],
    ["path", { d: "M2 20h20" }],
];
var tE = [
    ["path", { d: "M11 20H2" }],
    [
        "path",
        {
            d: "M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z",
        },
    ],
    ["path", { d: "M11 4H8a2 2 0 0 0-2 2v14" }],
    ["path", { d: "M14 12h.01" }],
    ["path", { d: "M22 20h-3" }],
];
var UE = [
    ["path", { d: "M12 15V3" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "m7 10 5 5 5-5" }],
];
var LE = [["circle", { cx: "12.1", cy: "12.1", r: "1" }]];
var RE = [
    ["path", { d: "m12.99 6.74 1.93 3.44" }],
    ["path", { d: "M19.136 12a10 10 0 0 1-14.271 0" }],
    ["path", { d: "m21 21-2.16-3.84" }],
    ["path", { d: "m3 21 8.02-14.26" }],
    ["circle", { cx: "12", cy: "5", r: "2" }],
];
var lE = [
    ["path", { d: "M10 11h.01" }],
    ["path", { d: "M14 6h.01" }],
    ["path", { d: "M18 6h.01" }],
    ["path", { d: "M6.5 13.1h.01" }],
    ["path", { d: "M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3" }],
    ["path", { d: "M17.4 9.9c-.8.8-2 .8-2.8 0" }],
    [
        "path",
        {
            d: "M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7",
        },
    ],
    ["path", { d: "M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4" }],
];
var jE = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" }],
    ["path", { d: "M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" }],
    ["path", { d: "M8.56 2.75c4.37 6 6 9.42 8 17.72" }],
];
var mE = [
    [
        "path",
        {
            d: "M10 18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3 1 1 0 0 1 1-1z",
        },
    ],
    [
        "path",
        {
            d: "M13 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1l-.81 3.242a1 1 0 0 1-.97.758H8",
        },
    ],
    ["path", { d: "M14 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3" }],
    ["path", { d: "M18 6h4" }],
    ["path", { d: "m5 10-2 8" }],
    ["path", { d: "m7 18 2-8" }],
];
var gE = [
    ["path", { d: "M10 10 7 7" }],
    ["path", { d: "m10 14-3 3" }],
    ["path", { d: "m14 10 3-3" }],
    ["path", { d: "m14 14 3 3" }],
    ["path", { d: "M14.205 4.139a4 4 0 1 1 5.439 5.863" }],
    ["path", { d: "M19.637 14a4 4 0 1 1-5.432 5.868" }],
    ["path", { d: "M4.367 10a4 4 0 1 1 5.438-5.862" }],
    ["path", { d: "M9.795 19.862a4 4 0 1 1-5.429-5.873" }],
    ["rect", { x: "10", y: "8", width: "4", height: "8", rx: "1" }],
];
var uE = [
    [
        "path",
        {
            d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z",
        },
    ],
];
var cE = [
    [
        "path",
        {
            d: "M18.715 13.186C18.29 11.858 17.384 10.607 16 9.5c-2-1.6-3.5-4-4-6.5a10.7 10.7 0 0 1-.884 2.586",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "M8.795 8.797A11 11 0 0 1 8 9.5C6 11.1 5 13 5 15a7 7 0 0 0 13.222 3.208",
        },
    ],
];
var nE = [
    [
        "path",
        {
            d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z",
        },
    ],
    [
        "path",
        {
            d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97",
        },
    ],
];
var iE = [
    ["path", { d: "m2 2 8 8" }],
    ["path", { d: "m22 2-8 8" }],
    ["ellipse", { cx: "12", cy: "9", rx: "10", ry: "5" }],
    ["path", { d: "M7 13.4v7.9" }],
    ["path", { d: "M12 14v8" }],
    ["path", { d: "M17 13.4v7.9" }],
    ["path", { d: "M2 9v8a10 5 0 0 0 20 0V9" }],
];
var oE = [
    [
        "path",
        {
            d: "M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23",
        },
    ],
    [
        "path",
        {
            d: "m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59",
        },
    ],
];
var rE = [
    [
        "path",
        {
            d: "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z",
        },
    ],
    ["path", { d: "m2.5 21.5 1.4-1.4" }],
    ["path", { d: "m20.1 3.9 1.4-1.4" }],
    [
        "path",
        {
            d: "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z",
        },
    ],
    ["path", { d: "m9.6 14.4 4.8-4.8" }],
];
var eE = [
    ["path", { d: "M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" }],
    ["path", { d: "M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" }],
];
var sE = [
    ["path", { d: "M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46" }],
    ["path", { d: "M6 8.5c0-.75.13-1.47.36-2.14" }],
    ["path", { d: "M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76" }],
    ["path", { d: "M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var pE = [
    ["path", { d: "M7 3.34V5a3 3 0 0 0 3 3" }],
    [
        "path",
        { d: "M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" },
    ],
    ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54" }],
    ["path", { d: "M12 2a10 10 0 1 0 9.54 13" }],
    ["path", { d: "M20 6V4a2 2 0 1 0-4 0v2" }],
    ["rect", { width: "8", height: "5", x: "14", y: "6", rx: "1" }],
];
var M1 = [
    ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54" }],
    [
        "path",
        {
            d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
        },
    ],
    [
        "path",
        { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" },
    ],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var aE = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 2a7 7 0 1 0 10 10" }],
];
var IN = [
    ["circle", { cx: "11.5", cy: "12.5", r: "3.5" }],
    [
        "path",
        {
            d: "M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z",
        },
    ],
];
var EN = [
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M20 14.347V14c0-6-4-12-8-12-1.078 0-2.157.436-3.157 1.19" }],
    ["path", { d: "M6.206 6.21C4.871 8.4 4 11.2 4 14a8 8 0 0 0 14.568 4.568" }],
];
var NN = [["path", { d: "M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" }]];
var t1 = [
    ["circle", { cx: "12", cy: "12", r: "1" }],
    ["circle", { cx: "12", cy: "5", r: "1" }],
    ["circle", { cx: "12", cy: "19", r: "1" }],
];
var U1 = [
    ["circle", { cx: "12", cy: "12", r: "1" }],
    ["circle", { cx: "19", cy: "12", r: "1" }],
    ["circle", { cx: "5", cy: "12", r: "1" }],
];
var $N = [
    ["path", { d: "M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" }],
    ["path", { d: "M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" }],
];
var _N = [
    ["line", { x1: "5", x2: "19", y1: "9", y2: "9" }],
    ["line", { x1: "5", x2: "19", y1: "15", y2: "15" }],
    ["line", { x1: "19", x2: "5", y1: "5", y2: "19" }],
];
var ZN = [
    ["line", { x1: "5", x2: "19", y1: "9", y2: "9" }],
    ["line", { x1: "5", x2: "19", y1: "15", y2: "15" }],
];
var YN = [
    [
        "path",
        {
            d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21",
        },
    ],
    ["path", { d: "m5.082 11.09 8.828 8.828" }],
];
var QN = [
    [
        "path",
        {
            d: "m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z",
        },
    ],
    ["path", { d: "M6 8v1" }],
    ["path", { d: "M10 8v1" }],
    ["path", { d: "M14 8v1" }],
    ["path", { d: "M18 8v1" }],
];
var JN = [
    ["path", { d: "M4 10h12" }],
    ["path", { d: "M4 14h9" }],
    [
        "path",
        {
            d: "M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2",
        },
    ],
];
var KN = [
    [
        "path",
        {
            d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5",
        },
    ],
    ["path", { d: "M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" }],
    ["path", { d: "M2 21h13" }],
    ["path", { d: "M3 7h11" }],
    ["path", { d: "m9 11-2 3h3l-2 3" }],
];
var XN = [
    ["path", { d: "m15 15 6 6" }],
    ["path", { d: "m15 9 6-6" }],
    ["path", { d: "M21 16v5h-5" }],
    ["path", { d: "M21 8V3h-5" }],
    ["path", { d: "M3 16v5h5" }],
    ["path", { d: "m3 21 6-6" }],
    ["path", { d: "M3 8V3h5" }],
    ["path", { d: "M9 9 3 3" }],
];
var VN = [
    ["path", { d: "M15 3h6v6" }],
    ["path", { d: "M10 14 21 3" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }],
];
var GN = [
    ["path", { d: "m15 18-.722-3.25" }],
    ["path", { d: "M2 8a10.645 10.645 0 0 0 20 0" }],
    ["path", { d: "m20 15-1.726-2.05" }],
    ["path", { d: "m4 15 1.726-2.05" }],
    ["path", { d: "m9 18 .722-3.25" }],
];
var WN = [
    [
        "path",
        {
            d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
    [
        "path",
        {
            d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
];
var xN = [
    [
        "path",
        {
            d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }],
];
var HN = [
    [
        "path",
        {
            d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
        },
    ],
];
var zN = [
    ["path", { d: "M12 16h.01" }],
    ["path", { d: "M16 16h.01" }],
    [
        "path",
        {
            d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z",
        },
    ],
    ["path", { d: "M8 16h.01" }],
];
var ON = [
    [
        "path",
        {
            d: "M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z",
        },
    ],
    ["path", { d: "M12 12v.01" }],
];
var TN = [
    [
        "path",
        {
            d: "M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z",
        },
    ],
    ["path", { d: "M16 8 2 22" }],
    ["path", { d: "M17.5 15H9" }],
];
var DN = [
    [
        "path",
        {
            d: "M12 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 12 18z",
        },
    ],
    [
        "path",
        {
            d: "M2 6a2 2 0 0 1 3.414-1.414l6 6a2 2 0 0 1 0 2.828l-6 6A2 2 0 0 1 2 18z",
        },
    ],
];
var FN = [
    ["path", { d: "M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" }],
    ["path", { d: "M6 8h4" }],
    ["path", { d: "M6 18h4" }],
    ["path", { d: "m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" }],
    ["path", { d: "M14 8h4" }],
    ["path", { d: "M14 18h4" }],
    ["path", { d: "m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" }],
];
var AN = [
    ["circle", { cx: "12", cy: "12", r: "2" }],
    ["path", { d: "M12 2v4" }],
    ["path", { d: "m6.8 15-3.5 2" }],
    ["path", { d: "m20.7 7-3.5 2" }],
    ["path", { d: "M6.8 9 3.3 7" }],
    ["path", { d: "m20.7 17-3.5-2" }],
    ["path", { d: "m9 22 3-8 3 8" }],
    ["path", { d: "M8 22h8" }],
    ["path", { d: "M18 18.7a9 9 0 1 0-12 0" }],
];
var BN = [
    ["path", { d: "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" }],
    ["path", { d: "M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" }],
    ["path", { d: "M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" }],
    ["path", { d: "M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" }],
    [
        "path",
        { d: "M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" },
    ],
];
var SN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["circle", { cx: "3", cy: "17", r: "1" }],
    ["path", { d: "M2 17v-3a4 4 0 0 1 8 0v3" }],
    ["circle", { cx: "9", cy: "17", r: "1" }],
];
var vN = [
    ["path", { d: "M10 12v-1" }],
    ["path", { d: "M10 18v-2" }],
    ["path", { d: "M10 7V6" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01",
        },
    ],
    ["circle", { cx: "10", cy: "20", r: "2" }],
];
var yN = [
    ["path", { d: "M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0",
        },
    ],
];
var L1 = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m8 18 4-4" }],
    ["path", { d: "M8 10v8h8" }],
];
var PN = [
    [
        "path",
        {
            d: "m13.69 12.479 1.29 4.88a.5.5 0 0 1-.697.591l-1.844-.849a1 1 0 0 0-.88.001l-1.846.85a.5.5 0 0 1-.693-.593l1.29-4.88",
        },
    ],
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
];
var qN = [
    ["path", { d: "M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.072" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "m6.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.88.001l-1.846.85a.5.5 0 0 1-.693-.593l1.29-4.88",
        },
    ],
    ["circle", { cx: "5", cy: "14", r: "3" }],
];
var CN = [
    ["path", { d: "M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01Z",
        },
    ],
    ["path", { d: "M7 17v5" }],
    ["path", { d: "M11.7 14.2 7 17l-4.7-2.8" }],
];
var R1 = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M8 18v-2" }],
    ["path", { d: "M12 18v-4" }],
    ["path", { d: "M16 18v-6" }],
];
var l1 = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M8 18v-1" }],
    ["path", { d: "M12 18v-6" }],
    ["path", { d: "M16 18v-3" }],
];
var j1 = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m16 13-3.5 3.5-2-2L8 17" }],
];
var m1 = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5" }],
    ["path", { d: "M4.017 11.512a6 6 0 1 0 8.466 8.475" }],
    [
        "path",
        {
            d: "M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z",
        },
    ],
];
var hN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m9 15 2 2 4-4" }],
];
var bN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m3 15 2 2 4-4" }],
];
var kN = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M8 14v2.2l1.6 1" }],
    ["circle", { cx: "8", cy: "16", r: "6" }],
];
var wN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m5 12-3 3 3 3" }],
    ["path", { d: "m9 18 3-3-3-3" }],
];
var fN = [
    ["path", { d: "M10 12.5 8 15l2 2.5" }],
    ["path", { d: "m14 12.5 2 2.5-2 2.5" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" },
    ],
];
var g1 = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m2.305 15.53.923-.382" }],
    ["path", { d: "m3.228 12.852-.924-.383" }],
    [
        "path",
        {
            d: "M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5",
        },
    ],
    ["path", { d: "m4.852 11.228-.383-.923" }],
    ["path", { d: "m4.852 16.772-.383.924" }],
    ["path", { d: "m7.148 11.228.383-.923" }],
    ["path", { d: "m7.53 17.696-.382-.924" }],
    ["path", { d: "m8.772 12.852.923-.383" }],
    ["path", { d: "m8.772 15.148.923.383" }],
    ["circle", { cx: "6", cy: "14", r: "3" }],
];
var dN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M9 10h6" }],
    ["path", { d: "M12 13V7" }],
    ["path", { d: "M9 17h6" }],
];
var MN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["rect", { width: "4", height: "6", x: "2", y: "12", rx: "2" }],
    ["path", { d: "M10 12h2v6" }],
    ["path", { d: "M10 18h4" }],
];
var tN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M12 18v-6" }],
    ["path", { d: "m9 15 3 3 3-3" }],
];
var UN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["circle", { cx: "10", cy: "12", r: "2" }],
    ["path", { d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" }],
];
var LN = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M2.62 13.8A2.25 2.25 0 1 1 6 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z",
        },
    ],
    [
        "path",
        {
            d: "M4 6.005V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-1.9-1.376",
        },
    ],
];
var RN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M2 15h10" }],
    ["path", { d: "m9 18 3-3-3-3" }],
];
var lN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
        },
    ],
    [
        "path",
        {
            d: "M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
        },
    ],
];
var jN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
        },
    ],
    [
        "path",
        {
            d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
        },
    ],
];
var mN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v6" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["circle", { cx: "4", cy: "16", r: "2" }],
    ["path", { d: "m10 10-4.5 4.5" }],
    ["path", { d: "m9 11 1 1" }],
];
var gN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["circle", { cx: "10", cy: "16", r: "2" }],
    ["path", { d: "m16 10-4.5 4.5" }],
    ["path", { d: "m15 11 1 1" }],
];
var uN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["rect", { width: "8", height: "6", x: "8", y: "12", rx: "1" }],
    ["path", { d: "M10 12v-2a2 2 0 1 1 4 0v2" }],
];
var cN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v1" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["rect", { width: "8", height: "5", x: "2", y: "13", rx: "1" }],
    ["path", { d: "M8 13v-2a2 2 0 1 0-4 0v2" }],
];
var nN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M3 15h6" }],
];
var iN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M9 15h6" }],
];
var oN = [
    ["path", { d: "M10.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8.4" }],
    ["path", { d: "M8 18v-7.7L16 9v7" }],
    ["circle", { cx: "14", cy: "16", r: "2" }],
    ["circle", { cx: "6", cy: "18", r: "2" }],
];
var rN = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2" }],
    ["path", { d: "M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6" }],
    ["path", { d: "m5 11-3 3" }],
    ["path", { d: "m5 17-3-3h10" }],
];
var u1 = [
    [
        "path",
        {
            d: "m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2",
        },
    ],
    [
        "path",
        {
            d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
    ["path", { d: "M8 18h1" }],
];
var c1 = [
    ["path", { d: "M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
];
var n1 = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" },
    ],
    [
        "path",
        {
            d: "M15.033 13.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56v-4.704a.645.645 0 0 1 .967-.56z",
        },
    ],
];
var eN = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M3 15h6" }],
    ["path", { d: "M6 12v6" }],
];
var sN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M9 15h6" }],
    ["path", { d: "M12 18v-6" }],
];
var i1 = [
    ["path", { d: "M12 17h.01" }],
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" },
    ],
    ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" }],
];
var pN = [
    ["path", { d: "M20 10V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M16 14a2 2 0 0 0-2 2" }],
    ["path", { d: "M20 14a2 2 0 0 1 2 2" }],
    ["path", { d: "M20 22a2 2 0 0 0 2-2" }],
    ["path", { d: "M16 22a2 2 0 0 1-2-2" }],
];
var aN = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["circle", { cx: "11.5", cy: "14.5", r: "2.5" }],
    ["path", { d: "M13.3 16.3 15 18" }],
];
var I$ = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",
        },
    ],
    ["path", { d: "m9 18-1.5-1.5" }],
    ["circle", { cx: "5", cy: "14", r: "3" }],
];
var E$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "M10 11v2" }],
    ["path", { d: "M8 17h8" }],
    ["path", { d: "M14 16v2" }],
];
var N$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M8 13h2" }],
    ["path", { d: "M14 13h2" }],
    ["path", { d: "M8 17h2" }],
    ["path", { d: "M14 17h2" }],
];
var $$ = [
    ["path", { d: "M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1" }],
    ["path", { d: "M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1" }],
    [
        "path",
        {
            d: "M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z",
        },
    ],
];
var _$ = [
    ["path", { d: "m10 18 3-3-3-3" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",
        },
    ],
];
var Z$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m8 16 2-2-2-2" }],
    ["path", { d: "M12 18h4" }],
];
var Y$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M10 9H8" }],
    ["path", { d: "M16 13H8" }],
    ["path", { d: "M16 17H8" }],
];
var Q$ = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M2 13v-1h6v1" }],
    ["path", { d: "M5 12v6" }],
    ["path", { d: "M4 18h2" }],
];
var J$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M9 13v-1h6v1" }],
    ["path", { d: "M12 12v6" }],
    ["path", { d: "M11 18h2" }],
];
var K$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M12 12v6" }],
    ["path", { d: "m15 15-3-3-3 3" }],
];
var X$ = [
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M15 18a3 3 0 1 0-6 0" }],
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" },
    ],
    ["circle", { cx: "12", cy: "13", r: "2" }],
];
var o1 = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["rect", { width: "8", height: "6", x: "2", y: "12", rx: "1" }],
    [
        "path",
        {
            d: "m10 13.843 3.033-1.755a.645.645 0 0 1 .967.56v4.704a.645.645 0 0 1-.967.56L10 16.157",
        },
    ],
];
var V$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M8 15h.01" }],
    ["path", { d: "M11.5 13.5a2.5 2.5 0 0 1 0 3" }],
    ["path", { d: "M15 12a5 5 0 0 1 0 6" }],
];
var G$ = [
    ["path", { d: "M11 11a5 5 0 0 1 0 6" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    [
        "path",
        {
            d: "M4 6.765V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-.93-.23",
        },
    ],
    [
        "path",
        {
            d: "M7 10.51a.5.5 0 0 0-.826-.38l-1.893 1.628A1 1 0 0 1 3.63 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1.129a1 1 0 0 1 .652.242l1.893 1.63a.5.5 0 0 0 .826-.38z",
        },
    ],
];
var W$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }],
];
var x$ = [
    ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m8 12.5-5 5" }],
    ["path", { d: "m3 12.5 5 5" }],
];
var H$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "m14.5 12.5-5 5" }],
    ["path", { d: "m9.5 12.5 5 5" }],
];
var z$ = [
    [
        "path",
        { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" },
    ],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
];
var O$ = [
    [
        "path",
        {
            d: "M15 2a2 2 0 0 1 1.414.586l4 4A2 2 0 0 1 21 8v7a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z",
        },
    ],
    ["path", { d: "M15 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" }],
];
var T$ = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7 3v18" }],
    ["path", { d: "M3 7.5h4" }],
    ["path", { d: "M3 12h18" }],
    ["path", { d: "M3 16.5h4" }],
    ["path", { d: "M17 3v18" }],
    ["path", { d: "M17 7.5h4" }],
    ["path", { d: "M17 16.5h4" }],
];
var D$ = [
    ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" }],
    ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88" }],
    ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02" }],
    ["path", { d: "M2 12a10 10 0 0 1 18-6" }],
    ["path", { d: "M2 16h.01" }],
    ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6" }],
    ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" }],
    ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2" }],
    ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2" }],
];
var F$ = [
    ["path", { d: "M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5" }],
    ["path", { d: "M9 18h8" }],
    ["path", { d: "M18 3h-3" }],
    ["path", { d: "M11 3a6 6 0 0 0-6 6v11" }],
    ["path", { d: "M5 13h4" }],
    ["path", { d: "M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z" }],
];
var A$ = [
    [
        "path",
        {
            d: "M18 12.47v.03m0-.5v.47m-.475 5.056A6.744 6.744 0 0 1 15 18c-3.56 0-7.56-2.53-8.5-6 .348-1.28 1.114-2.433 2.121-3.38m3.444-2.088A8.802 8.802 0 0 1 15 6c3.56 0 6.06 2.54 7 6-.309 1.14-.786 2.177-1.413 3.058",
        },
    ],
    [
        "path",
        {
            d: "M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33m7.48-4.372A9.77 9.77 0 0 1 16 6.07m0 11.86a9.77 9.77 0 0 1-1.728-3.618",
        },
    ],
    [
        "path",
        {
            d: "m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98M8.53 3h5.27a2 2 0 0 1 1.98 1.67l.23 1.4M2 2l20 20",
        },
    ],
];
var B$ = [["path", { d: "M2 16s9-15 20-4C11 23 2 8 2 8" }]];
var S$ = [
    [
        "path",
        {
            d: "M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z",
        },
    ],
    ["path", { d: "M18 12v.5" }],
    ["path", { d: "M16 17.93a9.77 9.77 0 0 1 0-11.86" }],
    [
        "path",
        {
            d: "M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33",
        },
    ],
    [
        "path",
        {
            d: "M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4",
        },
    ],
    [
        "path",
        {
            d: "m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98",
        },
    ],
];
var v$ = [
    ["path", { d: "M16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M4 22V4" }],
    [
        "path",
        { d: "M7.656 2H8c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10.347" },
    ],
];
var y$ = [
    [
        "path",
        {
            d: "M18 22V2.8a.8.8 0 0 0-1.17-.71L5.45 7.78a.8.8 0 0 0 0 1.44L18 15.5",
        },
    ],
];
var P$ = [
    [
        "path",
        {
            d: "M6 22V2.8a.8.8 0 0 1 1.17-.71l11.38 5.69a.8.8 0 0 1 0 1.44L6 15.5",
        },
    ],
];
var q$ = [
    [
        "path",
        {
            d: "M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528",
        },
    ],
];
var C$ = [
    [
        "path",
        {
            d: "M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z",
        },
    ],
    ["path", { d: "m5 22 14-4" }],
    ["path", { d: "m5 18 14 4" }],
];
var h$ = [
    [
        "path",
        {
            d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
        },
    ],
];
var b$ = [
    ["path", { d: "M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4" }],
    ["path", { d: "M7 2h11v4c0 2-2 2-2 4v1" }],
    ["line", { x1: "11", x2: "18", y1: "6", y2: "6" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var k$ = [
    [
        "path",
        {
            d: "M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z",
        },
    ],
    ["line", { x1: "6", x2: "18", y1: "6", y2: "6" }],
    ["line", { x1: "12", x2: "12", y1: "12", y2: "12" }],
];
var w$ = [
    ["path", { d: "M10 2v2.343" }],
    ["path", { d: "M14 2v6.343" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-1.755-2.96l5.227-9.563" }],
    ["path", { d: "M6.453 15H15" }],
    ["path", { d: "M8.5 2h7" }],
];
var f$ = [
    [
        "path",
        {
            d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2",
        },
    ],
    ["path", { d: "M6.453 15h11.094" }],
    ["path", { d: "M8.5 2h7" }],
];
var d$ = [
    ["path", { d: "M10 2v6.292a7 7 0 1 0 4 0V2" }],
    ["path", { d: "M5 15h14" }],
    ["path", { d: "M8.5 2h7" }],
];
var M$ = [
    ["path", { d: "m3 7 5 5-5 5V7" }],
    ["path", { d: "m21 7-5 5 5 5V7" }],
    ["path", { d: "M12 20v2" }],
    ["path", { d: "M12 14v2" }],
    ["path", { d: "M12 8v2" }],
    ["path", { d: "M12 2v2" }],
];
var t$ = [
    ["path", { d: "M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" }],
    ["path", { d: "M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" }],
    ["path", { d: "M12 20v2" }],
    ["path", { d: "M12 14v2" }],
    ["path", { d: "M12 8v2" }],
    ["path", { d: "M12 2v2" }],
];
var U$ = [
    ["path", { d: "m17 3-5 5-5-5h10" }],
    ["path", { d: "m17 21-5-5-5 5h10" }],
    ["path", { d: "M4 12H2" }],
    ["path", { d: "M10 12H8" }],
    ["path", { d: "M16 12h-2" }],
    ["path", { d: "M22 12h-2" }],
];
var L$ = [
    ["path", { d: "M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" }],
    ["path", { d: "M4 12H2" }],
    ["path", { d: "M10 12H8" }],
    ["path", { d: "M16 12h-2" }],
    ["path", { d: "M22 12h-2" }],
];
var R$ = [
    ["circle", { cx: "12", cy: "12", r: "3" }],
    [
        "path",
        {
            d: "M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5",
        },
    ],
    ["path", { d: "M12 7.5V9" }],
    ["path", { d: "M7.5 12H9" }],
    ["path", { d: "M16.5 12H15" }],
    ["path", { d: "M12 16.5V15" }],
    ["path", { d: "m8 8 1.88 1.88" }],
    ["path", { d: "M14.12 9.88 16 8" }],
    ["path", { d: "m8 16 1.88-1.88" }],
    ["path", { d: "M14.12 14.12 16 16" }],
];
var l$ = [
    [
        "path",
        {
            d: "M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1",
        },
    ],
    ["circle", { cx: "12", cy: "8", r: "2" }],
    ["path", { d: "M12 10v12" }],
    ["path", { d: "M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z" }],
    ["path", { d: "M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z" }],
];
var j$ = [
    ["circle", { cx: "12", cy: "12", r: "3" }],
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
];
var m$ = [
    ["path", { d: "M2 12h6" }],
    ["path", { d: "M22 12h-6" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M12 8v2" }],
    ["path", { d: "M12 14v2" }],
    ["path", { d: "M12 20v2" }],
    ["path", { d: "m19 9-3 3 3 3" }],
    ["path", { d: "m5 15 3-3-3-3" }],
];
var g$ = [
    ["path", { d: "M12 22v-6" }],
    ["path", { d: "M12 8V2" }],
    ["path", { d: "M4 12H2" }],
    ["path", { d: "M10 12H8" }],
    ["path", { d: "M16 12h-2" }],
    ["path", { d: "M22 12h-2" }],
    ["path", { d: "m15 19-3-3-3 3" }],
    ["path", { d: "m15 5-3 3-3-3" }],
];
var u$ = [
    ["circle", { cx: "15", cy: "19", r: "2" }],
    [
        "path",
        {
            d: "M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1",
        },
    ],
    ["path", { d: "M15 11v-1" }],
    ["path", { d: "M15 17v-2" }],
];
var c$ = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
    ["path", { d: "m9 13 2 2 4-4" }],
];
var n$ = [
    ["path", { d: "M16 14v2.2l1.6 1" }],
    [
        "path",
        {
            d: "M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2",
        },
    ],
    ["circle", { cx: "16", cy: "16", r: "6" }],
];
var i$ = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
    ["path", { d: "M2 10h20" }],
];
var o$ = [
    ["path", { d: "M10 10.5 8 13l2 2.5" }],
    ["path", { d: "m14 10.5 2 2.5-2 2.5" }],
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z",
        },
    ],
];
var r1 = [
    [
        "path",
        {
            d: "M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3",
        },
    ],
    ["path", { d: "m14.305 19.53.923-.382" }],
    ["path", { d: "m15.228 16.852-.923-.383" }],
    ["path", { d: "m16.852 15.228-.383-.923" }],
    ["path", { d: "m16.852 20.772-.383.924" }],
    ["path", { d: "m19.148 15.228.383-.923" }],
    ["path", { d: "m19.53 21.696-.382-.924" }],
    ["path", { d: "m20.772 16.852.924-.383" }],
    ["path", { d: "m20.772 19.148.924.383" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
];
var r$ = [
    [
        "path",
        {
            d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
        },
    ],
    ["circle", { cx: "12", cy: "13", r: "1" }],
];
var e$ = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
    ["path", { d: "M12 10v6" }],
    ["path", { d: "m15 13-3 3-3-3" }],
];
var s$ = [
    [
        "path",
        {
            d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5",
        },
    ],
    ["circle", { cx: "13", cy: "12", r: "2" }],
    ["path", { d: "M18 19c-2.8 0-5-2.2-5-5v8" }],
    ["circle", { cx: "20", cy: "19", r: "2" }],
];
var p$ = [
    [
        "path",
        {
            d: "M10.638 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v3.417",
        },
    ],
    [
        "path",
        {
            d: "M14.62 18.8A2.25 2.25 0 1 1 18 15.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z",
        },
    ],
];
var a$ = [
    ["circle", { cx: "12", cy: "13", r: "2" }],
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
    ["path", { d: "M14 13h3" }],
    ["path", { d: "M7 13h3" }],
];
var I_ = [
    [
        "path",
        {
            d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
        },
    ],
    ["path", { d: "M8 10v4" }],
    ["path", { d: "M12 10v2" }],
    ["path", { d: "M16 10v6" }],
];
var E_ = [
    [
        "path",
        {
            d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",
        },
    ],
    ["path", { d: "M2 13h10" }],
    ["path", { d: "m9 16 3-3-3-3" }],
];
var N_ = [
    ["circle", { cx: "16", cy: "20", r: "2" }],
    [
        "path",
        {
            d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2",
        },
    ],
    ["path", { d: "m22 14-4.5 4.5" }],
    ["path", { d: "m21 15 1 1" }],
];
var $_ = [
    ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1" }],
    [
        "path",
        {
            d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
        },
    ],
    ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }],
];
var __ = [
    ["path", { d: "M9 13h6" }],
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
];
var Z_ = [
    [
        "path",
        {
            d: "m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2",
        },
    ],
    ["circle", { cx: "14", cy: "15", r: "1" }],
];
var Y_ = [
    [
        "path",
        {
            d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
        },
    ],
];
var Q_ = [
    [
        "path",
        {
            d: "M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5",
        },
    ],
    ["path", { d: "M2 13h10" }],
    ["path", { d: "m5 10-3 3 3 3" }],
];
var e1 = [
    [
        "path",
        {
            d: "M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5",
        },
    ],
    [
        "path",
        {
            d: "M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
];
var J_ = [
    [
        "path",
        {
            d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
        },
    ],
    ["circle", { cx: "12", cy: "13", r: "2" }],
    ["path", { d: "M12 15v5" }],
];
var K_ = [
    ["path", { d: "M12 10v6" }],
    ["path", { d: "M9 13h6" }],
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
];
var X_ = [
    ["circle", { cx: "11.5", cy: "12.5", r: "2.5" }],
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
    ["path", { d: "M13.3 14.3 15 16" }],
];
var V_ = [
    [
        "path",
        {
            d: "M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1",
        },
    ],
    ["path", { d: "m21 21-1.9-1.9" }],
    ["circle", { cx: "17", cy: "17", r: "3" }],
];
var G_ = [
    [
        "path",
        {
            d: "M2 9.35V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7",
        },
    ],
    ["path", { d: "m8 16 3-3-3-3" }],
];
var W_ = [
    [
        "path",
        {
            d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5",
        },
    ],
    ["path", { d: "M12 10v4h4" }],
    ["path", { d: "m12 14 1.535-1.605a5 5 0 0 1 8 1.5" }],
    ["path", { d: "M22 22v-4h-4" }],
    ["path", { d: "m22 18-1.535 1.605a5 5 0 0 1-8-1.5" }],
];
var x_ = [
    [
        "path",
        {
            d: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
        },
    ],
    [
        "path",
        {
            d: "M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z",
        },
    ],
    ["path", { d: "M3 5a2 2 0 0 0 2 2h3" }],
    ["path", { d: "M3 3v13a2 2 0 0 0 2 2h3" }],
];
var H_ = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
    ["path", { d: "m9.5 10.5 5 5" }],
    ["path", { d: "m14.5 10.5-5 5" }],
];
var z_ = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
    ["path", { d: "M12 10v6" }],
    ["path", { d: "m9 13 3-3 3 3" }],
];
var O_ = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
        },
    ],
];
var T_ = [
    [
        "path",
        {
            d: "M20 5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2.5a1.5 1.5 0 0 1 1.2.6l.6.8a1.5 1.5 0 0 0 1.2.6z",
        },
    ],
    [
        "path",
        {
            d: "M3 8.268a2 2 0 0 0-1 1.738V19a2 2 0 0 0 2 2h11a2 2 0 0 0 1.732-1",
        },
    ],
];
var D_ = [
    [
        "path",
        {
            d: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z",
        },
    ],
    [
        "path",
        {
            d: "M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z",
        },
    ],
    ["path", { d: "M16 17h4" }],
    ["path", { d: "M4 13h4" }],
];
var F_ = [
    ["path", { d: "M12 12H5a2 2 0 0 0-2 2v5" }],
    ["circle", { cx: "13", cy: "19", r: "2" }],
    ["circle", { cx: "5", cy: "19", r: "2" }],
    ["path", { d: "M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5" }],
];
var A_ = [
    ["line", { x1: "22", x2: "2", y1: "6", y2: "6" }],
    ["line", { x1: "22", x2: "2", y1: "18", y2: "18" }],
    ["line", { x1: "6", x2: "6", y1: "2", y2: "22" }],
    ["line", { x1: "18", x2: "18", y1: "2", y2: "22" }],
];
var B_ = [
    ["path", { d: "m15 17 5-5-5-5" }],
    ["path", { d: "M4 18v-2a4 4 0 0 1 4-4h12" }],
];
var S_ = [["path", { d: "M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" }]];
var v_ = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2" }],
    ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
    ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }],
];
var y_ = [
    [
        "path",
        {
            d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0v-6.998a2 2 0 0 0-.59-1.42L18 5",
        },
    ],
    ["path", { d: "M14 21V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16" }],
    ["path", { d: "M2 21h13" }],
    ["path", { d: "M3 9h11" }],
];
var P_ = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["rect", { width: "10", height: "8", x: "7", y: "8", rx: "1" }],
];
var q_ = [
    [
        "path",
        {
            d: "M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348",
        },
    ],
    ["path", { d: "M16 6h6" }],
    ["path", { d: "M19 3v6" }],
];
var s1 = [
    [
        "path",
        {
            d: "M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473",
        },
    ],
    ["path", { d: "m16.5 3.5 5 5" }],
    ["path", { d: "m21.5 3.5-5 5" }],
];
var p1 = [
    [
        "path",
        {
            d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
        },
    ],
];
var C_ = [
    ["path", { d: "M2 7v10" }],
    ["path", { d: "M6 5v14" }],
    ["rect", { width: "12", height: "18", x: "10", y: "3", rx: "2" }],
];
var h_ = [
    ["path", { d: "M2 3v18" }],
    ["rect", { width: "12", height: "18", x: "6", y: "3", rx: "2" }],
    ["path", { d: "M22 3v18" }],
];
var b_ = [
    ["path", { d: "M7 2h10" }],
    ["path", { d: "M5 6h14" }],
    ["rect", { width: "18", height: "12", x: "3", y: "10", rx: "2" }],
];
var k_ = [
    ["rect", { width: "18", height: "14", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M4 21h1" }],
    ["path", { d: "M9 21h1" }],
    ["path", { d: "M14 21h1" }],
    ["path", { d: "M19 21h1" }],
];
var w_ = [
    ["path", { d: "M3 2h18" }],
    ["rect", { width: "18", height: "12", x: "3", y: "6", rx: "2" }],
    ["path", { d: "M3 22h18" }],
];
var f_ = [
    ["line", { x1: "6", x2: "10", y1: "11", y2: "11" }],
    ["line", { x1: "8", x2: "8", y1: "9", y2: "13" }],
    ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12" }],
    ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10" }],
    [
        "path",
        {
            d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z",
        },
    ],
];
var d_ = [
    ["line", { x1: "6", x2: "10", y1: "12", y2: "12" }],
    ["line", { x1: "8", x2: "8", y1: "10", y2: "14" }],
    ["line", { x1: "15", x2: "15.01", y1: "13", y2: "13" }],
    ["line", { x1: "18", x2: "18.01", y1: "11", y2: "11" }],
    ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }],
];
var M_ = [
    ["path", { d: "m12 14 4-4" }],
    ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0" }],
];
var t_ = [
    ["path", { d: "m14 13-8.381 8.38a1 1 0 0 1-3.001-3l8.384-8.381" }],
    ["path", { d: "m16 16 6-6" }],
    ["path", { d: "m21.5 10.5-8-8" }],
    ["path", { d: "m8 8 6-6" }],
    ["path", { d: "m8.5 7.5 8 8" }],
];
var U_ = [
    ["path", { d: "M10.5 3 8 9l4 13 4-13-2.5-6" }],
    [
        "path",
        {
            d: "M17 3a2 2 0 0 1 1.6.8l3 4a2 2 0 0 1 .013 2.382l-7.99 10.986a2 2 0 0 1-3.247 0l-7.99-10.986A2 2 0 0 1 2.4 7.8l2.998-3.997A2 2 0 0 1 7 3z",
        },
    ],
    ["path", { d: "M2 9h20" }],
];
var L_ = [
    ["path", { d: "M11.5 21a7.5 7.5 0 1 1 7.35-9" }],
    ["path", { d: "M13 12V3" }],
    ["path", { d: "M4 21h16" }],
    ["path", { d: "M9 12V3" }],
];
var R_ = [
    ["path", { d: "M9 10h.01" }],
    ["path", { d: "M15 10h.01" }],
    [
        "path",
        {
            d: "M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z",
        },
    ],
];
var l_ = [
    ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1" }],
    ["path", { d: "M12 8v13" }],
    ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" }],
    [
        "path",
        {
            d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5",
        },
    ],
];
var j_ = [
    ["path", { d: "M6 3v12" }],
    ["path", { d: "M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" }],
    ["path", { d: "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" }],
    ["path", { d: "M15 6a9 9 0 0 0-9 9" }],
    ["path", { d: "M18 15v6" }],
    ["path", { d: "M21 18h-6" }],
];
var m_ = [
    ["line", { x1: "6", x2: "6", y1: "3", y2: "15" }],
    ["circle", { cx: "18", cy: "6", r: "3" }],
    ["circle", { cx: "6", cy: "18", r: "3" }],
    ["path", { d: "M18 9a9 9 0 0 1-9 9" }],
];
var a1 = [
    ["circle", { cx: "12", cy: "12", r: "3" }],
    ["line", { x1: "3", x2: "9", y1: "12", y2: "12" }],
    ["line", { x1: "15", x2: "21", y1: "12", y2: "12" }],
];
var g_ = [
    ["path", { d: "M12 3v6" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
    ["path", { d: "M12 15v6" }],
];
var u_ = [
    ["circle", { cx: "5", cy: "6", r: "3" }],
    ["path", { d: "M12 6h5a2 2 0 0 1 2 2v7" }],
    ["path", { d: "m15 9-3-3 3-3" }],
    ["circle", { cx: "19", cy: "18", r: "3" }],
    ["path", { d: "M12 18H7a2 2 0 0 1-2-2V9" }],
    ["path", { d: "m9 15 3 3-3 3" }],
];
var c_ = [
    ["circle", { cx: "18", cy: "18", r: "3" }],
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M13 6h3a2 2 0 0 1 2 2v7" }],
    ["path", { d: "M11 18H8a2 2 0 0 1-2-2V9" }],
];
var n_ = [
    ["circle", { cx: "12", cy: "18", r: "3" }],
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["circle", { cx: "18", cy: "6", r: "3" }],
    ["path", { d: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" }],
    ["path", { d: "M12 12v3" }],
];
var i_ = [
    ["circle", { cx: "5", cy: "6", r: "3" }],
    ["path", { d: "M5 9v6" }],
    ["circle", { cx: "5", cy: "18", r: "3" }],
    ["path", { d: "M12 3v18" }],
    ["circle", { cx: "19", cy: "6", r: "3" }],
    ["path", { d: "M16 15.7A9 9 0 0 0 19 9" }],
];
var o_ = [
    ["circle", { cx: "18", cy: "18", r: "3" }],
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M6 21V9a9 9 0 0 0 9 9" }],
];
var r_ = [
    ["circle", { cx: "5", cy: "6", r: "3" }],
    ["path", { d: "M5 9v12" }],
    ["circle", { cx: "19", cy: "18", r: "3" }],
    ["path", { d: "m15 9-3-3 3-3" }],
    ["path", { d: "M12 6h5a2 2 0 0 1 2 2v7" }],
];
var e_ = [
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M6 9v12" }],
    ["path", { d: "m21 3-6 6" }],
    ["path", { d: "m21 9-6-6" }],
    ["path", { d: "M18 11.5V15" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
];
var s_ = [
    ["circle", { cx: "5", cy: "6", r: "3" }],
    ["path", { d: "M5 9v12" }],
    ["path", { d: "m15 9-3-3 3-3" }],
    ["path", { d: "M12 6h5a2 2 0 0 1 2 2v3" }],
    ["path", { d: "M19 15v6" }],
    ["path", { d: "M22 18h-6" }],
];
var p_ = [
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M6 9v12" }],
    ["path", { d: "M13 6h3a2 2 0 0 1 2 2v3" }],
    ["path", { d: "M18 15v6" }],
    ["path", { d: "M21 18h-6" }],
];
var a_ = [
    ["circle", { cx: "18", cy: "18", r: "3" }],
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M18 6V5" }],
    ["path", { d: "M18 11v-1" }],
    ["line", { x1: "6", x2: "6", y1: "9", y2: "21" }],
];
var IZ = [
    ["circle", { cx: "18", cy: "18", r: "3" }],
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M13 6h3a2 2 0 0 1 2 2v7" }],
    ["line", { x1: "6", x2: "6", y1: "9", y2: "21" }],
];
var EZ = [
    [
        "path",
        {
            d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
        },
    ],
    ["path", { d: "M9 18c-4.51 2-5-2-7-2" }],
];
var NZ = [
    [
        "path",
        {
            d: "m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z",
        },
    ],
];
var $Z = [
    [
        "path",
        {
            d: "M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z",
        },
    ],
    ["path", { d: "M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" }],
];
var _Z = [
    ["circle", { cx: "6", cy: "15", r: "4" }],
    ["circle", { cx: "18", cy: "15", r: "4" }],
    ["path", { d: "M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" }],
    ["path", { d: "M2.5 13 5 7c.7-1.3 1.4-2 3-2" }],
    ["path", { d: "M21.5 13 19 7c-.7-1.3-1.5-2-3-2" }],
];
var ZZ = [
    [
        "path",
        {
            d: "M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13",
        },
    ],
    ["path", { d: "M2 12h8.5" }],
    ["path", { d: "M20 6V4a2 2 0 1 0-4 0v2" }],
    ["rect", { width: "8", height: "5", x: "14", y: "6", rx: "1" }],
];
var YZ = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
    ["path", { d: "M2 12h20" }],
];
var QZ = [
    ["path", { d: "M12 13V2l8 4-8 4" }],
    ["path", { d: "M20.561 10.222a9 9 0 1 1-12.55-5.29" }],
    ["path", { d: "M8.002 9.997a5 5 0 1 0 8.9 2.02" }],
];
var JZ = [
    [
        "path",
        {
            d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
        },
    ],
    ["path", { d: "M22 10v6" }],
    ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5" }],
];
var KZ = [
    ["path", { d: "M2 21V3" }],
    ["path", { d: "M2 5h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2.26" }],
    ["path", { d: "M7 17v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3" }],
    ["circle", { cx: "16", cy: "11", r: "2" }],
    ["circle", { cx: "8", cy: "11", r: "2" }],
];
var XZ = [
    ["path", { d: "M22 5V2l-5.89 5.89" }],
    ["circle", { cx: "16.6", cy: "15.89", r: "3" }],
    ["circle", { cx: "8.11", cy: "7.4", r: "3" }],
    ["circle", { cx: "12.35", cy: "11.65", r: "3" }],
    ["circle", { cx: "13.91", cy: "5.85", r: "3" }],
    ["circle", { cx: "18.15", cy: "10.09", r: "3" }],
    ["circle", { cx: "6.56", cy: "13.2", r: "3" }],
    ["circle", { cx: "10.8", cy: "17.44", r: "3" }],
    ["circle", { cx: "5", cy: "19", r: "3" }],
];
var I0 = [
    [
        "path",
        {
            d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
        },
    ],
    ["path", { d: "m16 19 2 2 4-4" }],
];
var E0 = [
    [
        "path",
        {
            d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
        },
    ],
    ["path", { d: "M16 19h6" }],
    ["path", { d: "M19 22v-6" }],
];
var N0 = [
    [
        "path",
        {
            d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3",
        },
    ],
    ["path", { d: "m16 16 5 5" }],
    ["path", { d: "m16 21 5-5" }],
];
var $0 = [
    ["path", { d: "M12 3v18" }],
    ["path", { d: "M3 12h18" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var VZ = [
    ["path", { d: "M15 3v18" }],
    ["path", { d: "M3 12h18" }],
    ["path", { d: "M9 3v18" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var V = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "M3 15h18" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "M15 3v18" }],
];
var GZ = [
    ["circle", { cx: "12", cy: "9", r: "1" }],
    ["circle", { cx: "19", cy: "9", r: "1" }],
    ["circle", { cx: "5", cy: "9", r: "1" }],
    ["circle", { cx: "12", cy: "15", r: "1" }],
    ["circle", { cx: "19", cy: "15", r: "1" }],
    ["circle", { cx: "5", cy: "15", r: "1" }],
];
var WZ = [
    ["circle", { cx: "9", cy: "12", r: "1" }],
    ["circle", { cx: "9", cy: "5", r: "1" }],
    ["circle", { cx: "9", cy: "19", r: "1" }],
    ["circle", { cx: "15", cy: "12", r: "1" }],
    ["circle", { cx: "15", cy: "5", r: "1" }],
    ["circle", { cx: "15", cy: "19", r: "1" }],
];
var xZ = [
    ["circle", { cx: "12", cy: "5", r: "1" }],
    ["circle", { cx: "19", cy: "5", r: "1" }],
    ["circle", { cx: "5", cy: "5", r: "1" }],
    ["circle", { cx: "12", cy: "12", r: "1" }],
    ["circle", { cx: "19", cy: "12", r: "1" }],
    ["circle", { cx: "5", cy: "12", r: "1" }],
    ["circle", { cx: "12", cy: "19", r: "1" }],
    ["circle", { cx: "19", cy: "19", r: "1" }],
    ["circle", { cx: "5", cy: "19", r: "1" }],
];
var HZ = [
    ["path", { d: "M3 7V5c0-1.1.9-2 2-2h2" }],
    ["path", { d: "M17 3h2c1.1 0 2 .9 2 2v2" }],
    ["path", { d: "M21 17v2c0 1.1-.9 2-2 2h-2" }],
    ["path", { d: "M7 21H5c-1.1 0-2-.9-2-2v-2" }],
    ["rect", { width: "7", height: "5", x: "7", y: "7", rx: "1" }],
    ["rect", { width: "7", height: "5", x: "10", y: "12", rx: "1" }],
];
var zZ = [
    ["path", { d: "m11.9 12.1 4.514-4.514" }],
    [
        "path",
        {
            d: "M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z",
        },
    ],
    ["path", { d: "m6 16 2 2" }],
    [
        "path",
        {
            d: "M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z",
        },
    ],
];
var OZ = [
    ["path", { d: "M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856" }],
    [
        "path",
        {
            d: "M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288",
        },
    ],
    [
        "path",
        {
            d: "M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025",
        },
    ],
    ["path", { d: "m8.5 16.5-1-1" }],
];
var TZ = [
    ["path", { d: "M12 16H4a2 2 0 1 1 0-4h16a2 2 0 1 1 0 4h-4.25" }],
    ["path", { d: "M5 12a2 2 0 0 1-2-2 9 7 0 0 1 18 0 2 2 0 0 1-2 2" }],
    [
        "path",
        {
            d: "M5 16a2 2 0 0 0-2 2 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 2 2 0 0 0-2-2q0 0 0 0",
        },
    ],
    ["path", { d: "m6.67 12 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" }],
];
var DZ = [
    ["path", { d: "m15 12-9.373 9.373a1 1 0 0 1-3.001-3L12 9" }],
    ["path", { d: "m18 15 4-4" }],
    [
        "path",
        {
            d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172v-.344a2 2 0 0 0-.586-1.414l-1.657-1.657A6 6 0 0 0 12.516 3H9l1.243 1.243A6 6 0 0 1 12 8.485V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5",
        },
    ],
];
var FZ = [
    ["path", { d: "M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" }],
    [
        "path",
        {
            d: "m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
        },
    ],
    ["path", { d: "m2 16 6 6" }],
    ["circle", { cx: "16", cy: "9", r: "2.9" }],
    ["circle", { cx: "6", cy: "5", r: "3" }],
];
var AZ = [
    [
        "path",
        {
            d: "M12.035 17.012a3 3 0 0 0-3-3l-.311-.002a.72.72 0 0 1-.505-1.229l1.195-1.195A2 2 0 0 1 10.828 11H12a2 2 0 0 0 0-4H9.243a3 3 0 0 0-2.122.879l-2.707 2.707A4.83 4.83 0 0 0 3 14a8 8 0 0 0 8 8h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v2a2 2 0 1 0 4 0",
        },
    ],
    ["path", { d: "M13.888 9.662A2 2 0 0 0 17 8V5A2 2 0 1 0 13 5" }],
    ["path", { d: "M9 5A2 2 0 1 0 5 5V10" }],
    ["path", { d: "M9 7V4A2 2 0 1 1 13 4V7.268" }],
];
var BZ = [
    ["path", { d: "M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" }],
    [
        "path",
        {
            d: "m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95",
        },
    ],
    ["path", { d: "m2 15 6 6" }],
    [
        "path",
        {
            d: "m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91",
        },
    ],
];
var _0 = [
    ["path", { d: "M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" }],
    ["path", { d: "M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" }],
    ["path", { d: "M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5" }],
    ["path", { d: "M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2" }],
    [
        "path",
        {
            d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0",
        },
    ],
];
var Z0 = [
    ["path", { d: "M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" }],
    [
        "path",
        {
            d: "m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
        },
    ],
    ["path", { d: "m2 13 6 6" }],
];
var SZ = [
    ["path", { d: "M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" }],
    ["path", { d: "M14 11V9a2 2 0 1 0-4 0v2" }],
    ["path", { d: "M10 10.5V5a2 2 0 1 0-4 0v9" }],
    [
        "path",
        {
            d: "m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5",
        },
    ],
];
var vZ = [
    ["path", { d: "M12 3V2" }],
    [
        "path",
        {
            d: "m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5",
        },
    ],
    ["path", { d: "M2 14h12a2 2 0 0 1 0 4h-2" }],
    ["path", { d: "M4 10h16" }],
    ["path", { d: "M5 10a7 7 0 0 1 14 0" }],
    ["path", { d: "M5 14v6a1 1 0 0 1-1 1H2" }],
];
var yZ = [
    ["path", { d: "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" }],
    ["path", { d: "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" }],
    ["path", { d: "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" }],
    [
        "path",
        {
            d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
        },
    ],
];
var PZ = [
    ["path", { d: "m11 17 2 2a1 1 0 1 0 3-3" }],
    [
        "path",
        {
            d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4",
        },
    ],
    ["path", { d: "m21 3 1 11h-2" }],
    ["path", { d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" }],
    ["path", { d: "M3 4h8" }],
];
var qZ = [
    [
        "path",
        {
            d: "M2.048 18.566A2 2 0 0 0 4 21h16a2 2 0 0 0 1.952-2.434l-2-9A2 2 0 0 0 18 8H6a2 2 0 0 0-1.952 1.566z",
        },
    ],
    ["path", { d: "M8 11V6a4 4 0 0 1 8 0v5" }],
];
var CZ = [
    ["path", { d: "M12 2v8" }],
    ["path", { d: "m16 6-4 4-4-4" }],
    ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
    ["path", { d: "M6 18h.01" }],
    ["path", { d: "M10 18h.01" }],
];
var hZ = [
    ["path", { d: "m16 6-4-4-4 4" }],
    ["path", { d: "M12 2v8" }],
    ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
    ["path", { d: "M6 18h.01" }],
    ["path", { d: "M10 18h.01" }],
];
var bZ = [
    ["line", { x1: "22", x2: "2", y1: "12", y2: "12" }],
    [
        "path",
        {
            d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        },
    ],
    ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16" }],
    ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16" }],
];
var kZ = [
    ["path", { d: "M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" }],
    ["path", { d: "M14 6a6 6 0 0 1 6 6v3" }],
    ["path", { d: "M4 15v-3a6 6 0 0 1 6-6" }],
    ["rect", { x: "2", y: "15", width: "20", height: "4", rx: "1" }],
];
var wZ = [
    ["line", { x1: "4", x2: "20", y1: "9", y2: "9" }],
    ["line", { x1: "4", x2: "20", y1: "15", y2: "15" }],
    ["line", { x1: "10", x2: "8", y1: "3", y2: "21" }],
    ["line", { x1: "16", x2: "14", y1: "3", y2: "21" }],
];
var fZ = [
    ["path", { d: "M14 18a2 2 0 0 0-4 0" }],
    [
        "path",
        {
            d: "m19 11-2.11-6.657a2 2 0 0 0-2.752-1.148l-1.276.61A2 2 0 0 1 12 4H8.5a2 2 0 0 0-1.925 1.456L5 11",
        },
    ],
    ["path", { d: "M2 11h20" }],
    ["circle", { cx: "17", cy: "18", r: "3" }],
    ["circle", { cx: "7", cy: "18", r: "3" }],
];
var dZ = [
    ["path", { d: "m5.2 6.2 1.4 1.4" }],
    ["path", { d: "M2 13h2" }],
    ["path", { d: "M20 13h2" }],
    ["path", { d: "m17.4 7.6 1.4-1.4" }],
    ["path", { d: "M22 17H2" }],
    ["path", { d: "M22 21H2" }],
    ["path", { d: "M16 13a4 4 0 0 0-8 0" }],
    ["path", { d: "M12 5V2.5" }],
];
var MZ = [
    [
        "path",
        {
            d: "M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z",
        },
    ],
    ["path", { d: "M7.5 12h9" }],
];
var tZ = [
    ["path", { d: "M4 12h8" }],
    ["path", { d: "M4 18V6" }],
    ["path", { d: "M12 18V6" }],
    ["path", { d: "m17 12 3-2v8" }],
];
var UZ = [
    ["path", { d: "M4 12h8" }],
    ["path", { d: "M4 18V6" }],
    ["path", { d: "M12 18V6" }],
    ["path", { d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" }],
];
var LZ = [
    ["path", { d: "M4 12h8" }],
    ["path", { d: "M4 18V6" }],
    ["path", { d: "M12 18V6" }],
    ["path", { d: "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" }],
    ["path", { d: "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" }],
];
var RZ = [
    ["path", { d: "M12 18V6" }],
    ["path", { d: "M17 10v3a1 1 0 0 0 1 1h3" }],
    ["path", { d: "M21 10v8" }],
    ["path", { d: "M4 12h8" }],
    ["path", { d: "M4 18V6" }],
];
var lZ = [
    ["path", { d: "M4 12h8" }],
    ["path", { d: "M4 18V6" }],
    ["path", { d: "M12 18V6" }],
    ["path", { d: "M17 13v-3h4" }],
    [
        "path",
        {
            d: "M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17",
        },
    ],
];
var jZ = [
    ["path", { d: "M4 12h8" }],
    ["path", { d: "M4 18V6" }],
    ["path", { d: "M12 18V6" }],
    ["circle", { cx: "19", cy: "16", r: "2" }],
    ["path", { d: "M20 10c-2 2-3 3.5-3 6" }],
];
var mZ = [
    ["path", { d: "M6 12h12" }],
    ["path", { d: "M6 20V4" }],
    ["path", { d: "M18 20V4" }],
];
var gZ = [
    ["path", { d: "M21 14h-1.343" }],
    ["path", { d: "M9.128 3.47A9 9 0 0 1 21 12v3.343" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3" }],
    [
        "path",
        {
            d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364",
        },
    ],
];
var uZ = [
    [
        "path",
        {
            d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",
        },
    ],
];
var cZ = [
    [
        "path",
        {
            d: "M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z",
        },
    ],
    ["path", { d: "M21 16v2a4 4 0 0 1-4 4h-5" }],
];
var nZ = [
    [
        "path",
        {
            d: "M12.409 5.824c-.702.792-1.15 1.496-1.415 2.166l2.153 2.156a.5.5 0 0 1 0 .707l-2.293 2.293a.5.5 0 0 0 0 .707L12 15",
        },
    ],
    [
        "path",
        {
            d: "M13.508 20.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.677.6.6 0 0 0 .818.001A5.5 5.5 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5z",
        },
    ],
];
var iZ = [
    [
        "path",
        {
            d: "M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762",
        },
    ],
];
var oZ = [
    [
        "path",
        {
            d: "m14.876 18.99-1.368 1.323a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.244 1.572",
        },
    ],
    ["path", { d: "M15 15h6" }],
];
var rZ = [
    [
        "path",
        {
            d: "M10.5 4.893a5.5 5.5 0 0 1 1.091.931.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 1.872-1.002 3.356-2.187 4.655",
        },
    ],
    [
        "path",
        {
            d: "m16.967 16.967-3.459 3.346a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 2.747-4.761",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
];
var eZ = [
    [
        "path",
        {
            d: "m14.479 19.374-.971.939a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5a5.2 5.2 0 0 1-.219 1.49",
        },
    ],
    ["path", { d: "M15 15h6" }],
    ["path", { d: "M18 12v6" }],
];
var sZ = [
    [
        "path",
        {
            d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        },
    ],
    ["path", { d: "M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" }],
];
var pZ = [
    [
        "path",
        {
            d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        },
    ],
];
var aZ = [
    ["path", { d: "M11 8c2-3-2-3 0-6" }],
    ["path", { d: "M15.5 8c2-3-2-3 0-6" }],
    ["path", { d: "M6 10h.01" }],
    ["path", { d: "M6 14h.01" }],
    ["path", { d: "M10 16v-4" }],
    ["path", { d: "M14 16v-4" }],
    ["path", { d: "M18 16v-4" }],
    [
        "path",
        {
            d: "M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3",
        },
    ],
    ["path", { d: "M5 20v2" }],
    ["path", { d: "M19 20v2" }],
];
var IY = [
    [
        "path",
        {
            d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
        },
    ],
];
var EY = [
    ["path", { d: "m9 11-6 6v3h9l3-3" }],
    [
        "path",
        { d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" },
    ],
];
var NY = [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }],
    ["path", { d: "M12 7v5l4 2" }],
];
var $Y = [
    ["path", { d: "M10.82 16.12c1.69.6 3.91.79 5.18.85.28.01.53-.09.7-.27" }],
    [
        "path",
        {
            d: "M11.14 20.57c.52.24 2.44 1.12 4.08 1.37.46.06.86-.25.9-.71.12-1.52-.3-3.43-.5-4.28",
        },
    ],
    ["path", { d: "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .7-.26" }],
    [
        "path",
        {
            d: "M17.99 5.52a20.83 20.83 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-1.17.1-2.5.02-3.9-.25",
        },
    ],
    [
        "path",
        { d: "M20.57 11.14c.24.52 1.12 2.44 1.37 4.08.04.3-.08.59-.31.75" },
    ],
    [
        "path",
        {
            d: "M4.93 4.93a10 10 0 0 0-.67 13.4c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.85.85 0 0 0 .48-.24",
        },
    ],
    [
        "path",
        {
            d: "M5.52 17.99c1.05.95 2.91 2.42 4.5 3.15a.8.8 0 0 0 1.13-.68c.2-2.34-.33-5.3-1.57-8.28",
        },
    ],
    [
        "path",
        {
            d: "M8.35 2.68a10 10 0 0 1 9.98 1.58c.43.35.4.96-.12 1.17-1.5.6-4.3.98-6.07 1.05",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
];
var _Y = [
    [
        "path",
        {
            d: "M10.82 16.12c1.69.6 3.91.79 5.18.85.55.03 1-.42.97-.97-.06-1.27-.26-3.5-.85-5.18",
        },
    ],
    [
        "path",
        {
            d: "M11.5 6.5c1.64 0 5-.38 6.71-1.07.52-.2.55-.82.12-1.17A10 10 0 0 0 4.26 18.33c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.88.88 0 0 0 .73-.74c.3-2.14-.15-3.5-.61-4.88",
        },
    ],
    [
        "path",
        {
            d: "M15.62 16.95c.2.85.62 2.76.5 4.28a.77.77 0 0 1-.9.7 16.64 16.64 0 0 1-4.08-1.36",
        },
    ],
    [
        "path",
        {
            d: "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .96-.96 17.68 17.68 0 0 0-.9-4.87",
        },
    ],
    [
        "path",
        {
            d: "M16.94 15.62c.86.2 2.77.62 4.29.5a.77.77 0 0 0 .7-.9 16.64 16.64 0 0 0-1.36-4.08",
        },
    ],
    [
        "path",
        {
            d: "M17.99 5.52a20.82 20.82 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-2.33.2-5.3-.32-8.27-1.57",
        },
    ],
    ["path", { d: "M4.93 4.93 3 3a.7.7 0 0 1 0-1" }],
    [
        "path",
        {
            d: "M9.58 12.18c1.24 2.98 1.77 5.95 1.57 8.28a.8.8 0 0 1-1.13.68 20.82 20.82 0 0 1-4.5-3.15",
        },
    ],
];
var ZY = [
    ["path", { d: "M12 7v4" }],
    ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }],
    ["path", { d: "M14 9h-4" }],
    [
        "path",
        {
            d: "M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2",
        },
    ],
    ["path", { d: "M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16" }],
];
var YY = [
    ["path", { d: "M10 22v-6.57" }],
    ["path", { d: "M12 11h.01" }],
    ["path", { d: "M12 7h.01" }],
    ["path", { d: "M14 15.43V22" }],
    ["path", { d: "M15 16a5 5 0 0 0-6 0" }],
    ["path", { d: "M16 11h.01" }],
    ["path", { d: "M16 7h.01" }],
    ["path", { d: "M8 11h.01" }],
    ["path", { d: "M8 7h.01" }],
    ["rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }],
];
var QY = [
    ["path", { d: "M5 22h14" }],
    ["path", { d: "M5 2h14" }],
    [
        "path",
        {
            d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22",
        },
    ],
    [
        "path",
        {
            d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",
        },
    ],
];
var JY = [
    [
        "path",
        {
            d: "M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z",
        },
    ],
    [
        "path",
        {
            d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        },
    ],
];
var KY = [
    ["path", { d: "M10 12V8.964" }],
    ["path", { d: "M14 12V8.964" }],
    [
        "path",
        {
            d: "M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z",
        },
    ],
    [
        "path",
        {
            d: "M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2",
        },
    ],
];
var XY = [
    [
        "path",
        {
            d: "M12.35 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v2.35",
        },
    ],
    ["path", { d: "M14.8 12.4A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" }],
    ["path", { d: "M15 18h6" }],
    ["path", { d: "M18 15v6" }],
];
var Y0 = [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }],
    [
        "path",
        {
            d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        },
    ],
];
var VY = [
    ["path", { d: "M9.5 13.866a4 4 0 0 1 5 .01" }],
    ["path", { d: "M12 17h.01" }],
    [
        "path",
        {
            d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        },
    ],
    ["path", { d: "M7 10.754a8 8 0 0 1 10 0" }],
];
var Q0 = [
    [
        "path",
        {
            d: "M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0",
        },
    ],
    ["path", { d: "M12.14 11a3.5 3.5 0 1 1 6.71 0" }],
    ["path", { d: "M15.5 6.5a3.5 3.5 0 1 0-7 0" }],
];
var J0 = [
    ["path", { d: "m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11" }],
    ["path", { d: "M17 7A5 5 0 0 0 7 7" }],
    ["path", { d: "M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4" }],
];
var GY = [
    ["path", { d: "M13.5 8h-3" }],
    [
        "path",
        {
            d: "m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3",
        },
    ],
    ["path", { d: "M16.899 22A5 5 0 0 0 7.1 22" }],
    ["path", { d: "m9 2 3 6" }],
    ["circle", { cx: "12", cy: "15", r: "3" }],
];
var WY = [
    ["path", { d: "M16 10h2" }],
    ["path", { d: "M16 14h2" }],
    ["path", { d: "M6.17 15a3 3 0 0 1 5.66 0" }],
    ["circle", { cx: "9", cy: "11", r: "2" }],
    ["rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }],
];
var xY = [
    [
        "path",
        {
            d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21",
        },
    ],
    ["path", { d: "m14 19 3 3v-5.5" }],
    ["path", { d: "m17 22 3-3" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
];
var HY = [
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
    ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83" }],
    ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21" }],
    ["line", { x1: "18", x2: "21", y1: "12", y2: "15" }],
    [
        "path",
        {
            d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
        },
    ],
    ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9" }],
];
var zY = [
    ["path", { d: "M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" }],
    ["line", { x1: "16", x2: "22", y1: "5", y2: "5" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
    ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
];
var OY = [
    [
        "path",
        {
            d: "M15 15.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z",
        },
    ],
    [
        "path",
        { d: "M21 12.17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" },
    ],
    ["path", { d: "m6 21 5-5" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
];
var TY = [
    ["path", { d: "M16 5h6" }],
    ["path", { d: "M19 2v6" }],
    [
        "path",
        { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" },
    ],
    ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
];
var DY = [
    [
        "path",
        {
            d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21",
        },
    ],
    ["path", { d: "m14 19.5 3-3 3 3" }],
    ["path", { d: "M17 22v-5.5" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
];
var FY = [
    ["path", { d: "M16 3h5v5" }],
    ["path", { d: "M17 21h2a2 2 0 0 0 2-2" }],
    ["path", { d: "M21 12v3" }],
    ["path", { d: "m21 3-5 5" }],
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2" }],
    ["path", { d: "m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19" }],
    ["path", { d: "M9 3h3" }],
    ["rect", { x: "3", y: "11", width: "10", height: "10", rx: "1" }],
];
var AY = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
    ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
];
var BY = [
    ["path", { d: "m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16" }],
    ["path", { d: "M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" }],
    ["circle", { cx: "13", cy: "7", r: "1", fill: "currentColor" }],
    ["rect", { x: "8", y: "2", width: "14", height: "14", rx: "2" }],
];
var SY = [
    ["path", { d: "M12 3v12" }],
    ["path", { d: "m8 11 4 4 4-4" }],
    [
        "path",
        {
            d: "M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4",
        },
    ],
];
var vY = [
    ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12" }],
    [
        "path",
        {
            d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        },
    ],
];
var yY = [
    ["path", { d: "M6 3h12" }],
    ["path", { d: "M6 8h12" }],
    ["path", { d: "m6 13 8.5 8" }],
    ["path", { d: "M6 13h3" }],
    ["path", { d: "M9 13c6.667 0 6.667-10 0-10" }],
];
var PY = [
    [
        "path",
        { d: "M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" },
    ],
];
var qY = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }],
];
var CY = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7 7h.01" }],
    ["path", { d: "M17 7h.01" }],
    ["path", { d: "M7 17h.01" }],
    ["path", { d: "M17 17h.01" }],
];
var hY = [
    ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5" }],
    ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }],
    ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" }],
];
var bY = [
    ["line", { x1: "19", x2: "10", y1: "4", y2: "4" }],
    ["line", { x1: "14", x2: "5", y1: "20", y2: "20" }],
    ["line", { x1: "15", x2: "9", y1: "4", y2: "20" }],
];
var kY = [
    ["path", { d: "m16 14 4 4-4 4" }],
    ["path", { d: "M20 10a8 8 0 1 0-8 8h8" }],
];
var wY = [
    ["path", { d: "M4 10a8 8 0 1 1 8 8H4" }],
    ["path", { d: "m8 22-4-4 4-4" }],
];
var fY = [
    ["path", { d: "M12 9.5V21m0-11.5L6 3m6 6.5L18 3" }],
    ["path", { d: "M6 15h12" }],
    ["path", { d: "M6 11h12" }],
];
var dY = [
    [
        "path",
        {
            d: "M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z",
        },
    ],
    ["path", { d: "M6 15v-2" }],
    ["path", { d: "M12 15V9" }],
    ["circle", { cx: "12", cy: "6", r: "3" }],
];
var MY = [
    ["path", { d: "M5 3v14" }],
    ["path", { d: "M12 3v8" }],
    ["path", { d: "M19 3v18" }],
];
var tY = [
    ["path", { d: "M18 17a1 1 0 0 0-1 1v1a2 2 0 1 0 2-2z" }],
    [
        "path",
        {
            d: "M20.97 3.61a.45.45 0 0 0-.58-.58C10.2 6.6 6.6 10.2 3.03 20.39a.45.45 0 0 0 .58.58C13.8 17.4 17.4 13.8 20.97 3.61",
        },
    ],
    ["path", { d: "m6.707 6.707 10.586 10.586" }],
    ["path", { d: "M7 5a2 2 0 1 0-2 2h1a1 1 0 0 0 1-1z" }],
];
var UY = [
    [
        "path",
        {
            d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
        },
    ],
    ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor" }],
];
var LY = [
    [
        "path",
        {
            d: "M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z",
        },
    ],
    ["path", { d: "m14 7 3 3" }],
    [
        "path",
        {
            d: "m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814",
        },
    ],
];
var RY = [
    [
        "path",
        { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" },
    ],
    ["path", { d: "m21 2-9.6 9.6" }],
    ["circle", { cx: "7.5", cy: "15.5", r: "5.5" }],
];
var lY = [
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["path", { d: "M6 8h4" }],
    ["path", { d: "M14 8h.01" }],
    ["path", { d: "M18 8h.01" }],
    ["path", { d: "M2 12h20" }],
    ["path", { d: "M6 12v4" }],
    ["path", { d: "M10 12v4" }],
    ["path", { d: "M14 12v4" }],
    ["path", { d: "M18 12v4" }],
];
var jY = [
    ["path", { d: "M 20 4 A2 2 0 0 1 22 6" }],
    ["path", { d: "M 22 6 L 22 16.41" }],
    ["path", { d: "M 7 16 L 16 16" }],
    ["path", { d: "M 9.69 4 L 20 4" }],
    ["path", { d: "M14 8h.01" }],
    ["path", { d: "M18 8h.01" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" }],
    ["path", { d: "M6 8h.01" }],
    ["path", { d: "M8 12h.01" }],
];
var mY = [
    ["path", { d: "M10 8h.01" }],
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M14 8h.01" }],
    ["path", { d: "M16 12h.01" }],
    ["path", { d: "M18 8h.01" }],
    ["path", { d: "M6 8h.01" }],
    ["path", { d: "M7 16h10" }],
    ["path", { d: "M8 12h.01" }],
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
];
var gY = [
    ["path", { d: "M12 2v5" }],
    ["path", { d: "M14.829 15.998a3 3 0 1 1-5.658 0" }],
    [
        "path",
        {
            d: "M20.92 14.606A1 1 0 0 1 20 16H4a1 1 0 0 1-.92-1.394l3-7A1 1 0 0 1 7 7h10a1 1 0 0 1 .92.606z",
        },
    ],
];
var uY = [
    [
        "path",
        {
            d: "M10.293 2.293a1 1 0 0 1 1.414 0l2.5 2.5 5.994 1.227a1 1 0 0 1 .506 1.687l-7 7a1 1 0 0 1-1.687-.506l-1.227-5.994-2.5-2.5a1 1 0 0 1 0-1.414z",
        },
    ],
    ["path", { d: "m14.207 4.793-3.414 3.414" }],
    [
        "path",
        {
            d: "M3 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z",
        },
    ],
    ["path", { d: "m9.086 6.5-4.793 4.793a1 1 0 0 0-.18 1.17L7 18" }],
];
var cY = [
    ["path", { d: "M12 10v12" }],
    [
        "path",
        {
            d: "M17.929 7.629A1 1 0 0 1 17 9H7a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 9 2h6a1 1 0 0 1 .928.629z",
        },
    ],
    ["path", { d: "M9 22h6" }],
];
var nY = [
    [
        "path",
        {
            d: "M19.929 18.629A1 1 0 0 1 19 20H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 13h6a1 1 0 0 1 .928.629z",
        },
    ],
    [
        "path",
        {
            d: "M6 3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
        },
    ],
    ["path", { d: "M8 6h4a2 2 0 0 1 2 2v5" }],
];
var iY = [
    [
        "path",
        {
            d: "M19.929 9.629A1 1 0 0 1 19 11H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 4h6a1 1 0 0 1 .928.629z",
        },
    ],
    [
        "path",
        {
            d: "M6 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z",
        },
    ],
    ["path", { d: "M8 18h4a2 2 0 0 0 2-2v-5" }],
];
var oY = [
    ["path", { d: "M12 12v6" }],
    [
        "path",
        {
            d: "M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z",
        },
    ],
    [
        "path",
        {
            d: "M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z",
        },
    ],
];
var rY = [
    ["path", { d: "m12 8 6-3-6-3v10" }],
    [
        "path",
        {
            d: "m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12",
        },
    ],
    ["path", { d: "m6.49 12.85 11.02 6.3" }],
    ["path", { d: "M17.51 12.85 6.5 19.15" }],
];
var eY = [
    ["path", { d: "M10 18v-7" }],
    [
        "path",
        {
            d: "M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z",
        },
    ],
    ["path", { d: "M14 18v-7" }],
    ["path", { d: "M18 18v-7" }],
    ["path", { d: "M3 22h18" }],
    ["path", { d: "M6 18v-7" }],
];
var sY = [
    ["path", { d: "m5 8 6 6" }],
    ["path", { d: "m4 14 6-6 2-3" }],
    ["path", { d: "M2 5h12" }],
    ["path", { d: "M7 2h1" }],
    ["path", { d: "m22 22-5-10-5 10" }],
    ["path", { d: "M14 18h6" }],
];
var pY = [
    ["path", { d: "M2 20h20" }],
    ["path", { d: "m9 10 2 2 4-4" }],
    ["rect", { x: "3", y: "4", width: "18", height: "12", rx: "2" }],
];
var K0 = [
    ["rect", { width: "18", height: "12", x: "3", y: "4", rx: "2", ry: "2" }],
    ["line", { x1: "2", x2: "22", y1: "20", y2: "20" }],
];
var aY = [
    [
        "path",
        {
            d: "M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z",
        },
    ],
    ["path", { d: "M20.054 15.987H3.946" }],
];
var IQ = [
    ["path", { d: "M7 22a5 5 0 0 1-2-4" }],
    ["path", { d: "M7 16.93c.96.43 1.96.74 2.99.91" }],
    [
        "path",
        {
            d: "M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2",
        },
    ],
    ["path", { d: "M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" }],
    [
        "path",
        {
            d: "M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14z",
        },
    ],
];
var EQ = [
    [
        "path",
        {
            d: "M3.704 14.467A10 8 0 0 1 2 10a10 8 0 0 1 20 0 10 8 0 0 1-10 8 10 8 0 0 1-5.181-1.158",
        },
    ],
    ["path", { d: "M7 22a5 5 0 0 1-2-3.994" }],
    ["circle", { cx: "5", cy: "16", r: "2" }],
];
var NQ = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" }],
    ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
    ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }],
];
var $Q = [
    [
        "path",
        {
            d: "M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z",
        },
    ],
    [
        "path",
        {
            d: "m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845",
        },
    ],
];
var X0 = [
    [
        "path",
        {
            d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
        },
    ],
    [
        "path",
        {
            d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
        },
    ],
    [
        "path",
        {
            d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
        },
    ],
];
var _Q = [
    ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1" }],
    ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1" }],
];
var ZQ = [
    ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" }],
];
var YQ = [
    ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" }],
    ["path", { d: "M14 4h7" }],
    ["path", { d: "M14 9h7" }],
    ["path", { d: "M14 15h7" }],
    ["path", { d: "M14 20h7" }],
];
var QQ = [
    ["rect", { width: "7", height: "18", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }],
];
var JQ = [
    ["rect", { width: "18", height: "7", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" }],
    ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }],
];
var KQ = [
    ["rect", { width: "18", height: "7", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "9", height: "7", x: "3", y: "14", rx: "1" }],
    ["rect", { width: "5", height: "7", x: "16", y: "14", rx: "1" }],
];
var XQ = [
    [
        "path",
        {
            d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z",
        },
    ],
    ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" }],
];
var VQ = [
    [
        "path",
        {
            d: "M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22",
        },
    ],
    ["path", { d: "M2 22 17 7" }],
];
var GQ = [
    [
        "path",
        {
            d: "M16 12h3a2 2 0 0 0 1.902-1.38l1.056-3.333A1 1 0 0 0 21 6H3a1 1 0 0 0-.958 1.287l1.056 3.334A2 2 0 0 0 5 12h3",
        },
    ],
    ["path", { d: "M18 6V3a1 1 0 0 0-1-1h-3" }],
    ["rect", { width: "8", height: "12", x: "8", y: "10", rx: "1" }],
];
var WQ = [
    ["rect", { width: "8", height: "18", x: "3", y: "3", rx: "1" }],
    ["path", { d: "M7 3v18" }],
    [
        "path",
        {
            d: "M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z",
        },
    ],
];
var xQ = [
    ["path", { d: "m16 6 4 14" }],
    ["path", { d: "M12 6v14" }],
    ["path", { d: "M8 8v12" }],
    ["path", { d: "M4 4v16" }],
];
var HQ = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m4.93 4.93 4.24 4.24" }],
    ["path", { d: "m14.83 9.17 4.24-4.24" }],
    ["path", { d: "m14.83 14.83 4.24 4.24" }],
    ["path", { d: "m9.17 14.83-4.24 4.24" }],
    ["circle", { cx: "12", cy: "12", r: "4" }],
];
var zQ = [
    ["path", { d: "M14 12h2v8" }],
    ["path", { d: "M14 20h4" }],
    ["path", { d: "M6 12h4" }],
    ["path", { d: "M6 20h4" }],
    ["path", { d: "M8 20V8a4 4 0 0 1 7.464-2" }],
];
var OQ = [
    ["path", { d: "M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5" }],
    ["path", { d: "M9 18h6" }],
    ["path", { d: "M10 22h4" }],
];
var TQ = [
    [
        "path",
        {
            d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
        },
    ],
    ["path", { d: "M9 18h6" }],
    ["path", { d: "M10 22h4" }],
];
var DQ = [
    [
        "path",
        {
            d: "M7 3.5c5-2 7 2.5 3 4C1.5 10 2 15 5 16c5 2 9-10 14-7s.5 13.5-4 12c-5-2.5.5-11 6-2",
        },
    ],
];
var FQ = [
    ["path", { d: "M9 17H7A5 5 0 0 1 7 7" }],
    ["path", { d: "M15 7h2a5 5 0 0 1 4 8" }],
    ["line", { x1: "8", x2: "12", y1: "12", y2: "12" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var AQ = [
    ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2" }],
    ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2" }],
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
];
var BQ = [
    [
        "path",
        { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" },
    ],
    [
        "path",
        { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" },
    ],
];
var SQ = [
    [
        "path",
        {
            d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
        },
    ],
    ["rect", { width: "4", height: "12", x: "2", y: "9" }],
    ["circle", { cx: "4", cy: "4", r: "2" }],
];
var vQ = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M16 12H3" }],
    ["path", { d: "M11 19H3" }],
    ["path", { d: "m15 18 2 2 4-4" }],
];
var yQ = [
    ["path", { d: "M13 5h8" }],
    ["path", { d: "M13 12h8" }],
    ["path", { d: "M13 19h8" }],
    ["path", { d: "m3 17 2 2 4-4" }],
    ["path", { d: "m3 7 2 2 4-4" }],
];
var PQ = [
    ["path", { d: "M3 5h8" }],
    ["path", { d: "M3 12h8" }],
    ["path", { d: "M3 19h8" }],
    ["path", { d: "m15 5 3 3 3-3" }],
    ["path", { d: "m15 19 3-3 3 3" }],
];
var qQ = [
    ["path", { d: "M3 5h8" }],
    ["path", { d: "M3 12h8" }],
    ["path", { d: "M3 19h8" }],
    ["path", { d: "m15 8 3-3 3 3" }],
    ["path", { d: "m15 16 3 3 3-3" }],
];
var CQ = [
    ["path", { d: "M10 5h11" }],
    ["path", { d: "M10 12h11" }],
    ["path", { d: "M10 19h11" }],
    ["path", { d: "m3 10 3-3-3-3" }],
    ["path", { d: "m3 20 3-3-3-3" }],
];
var hQ = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M16 12H3" }],
    ["path", { d: "M9 19H3" }],
    ["path", { d: "m16 16-3 3 3 3" }],
    ["path", { d: "M21 5v12a2 2 0 0 1-2 2h-6" }],
];
var bQ = [
    ["path", { d: "M2 5h20" }],
    ["path", { d: "M6 12h12" }],
    ["path", { d: "M9 19h6" }],
];
var kQ = [
    ["path", { d: "M12 5H2" }],
    ["path", { d: "M6 12h12" }],
    ["path", { d: "M9 19h6" }],
    ["path", { d: "M16 5h6" }],
    ["path", { d: "M19 8V2" }],
];
var G = [
    ["path", { d: "M21 5H11" }],
    ["path", { d: "M21 12H11" }],
    ["path", { d: "M21 19H11" }],
    ["path", { d: "m7 8-4 4 4 4" }],
];
var W = [
    ["path", { d: "M21 5H11" }],
    ["path", { d: "M21 12H11" }],
    ["path", { d: "M21 19H11" }],
    ["path", { d: "m3 8 4 4-4 4" }],
];
var wQ = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M11 12H3" }],
    ["path", { d: "M16 19H3" }],
    ["path", { d: "M21 12h-6" }],
];
var fQ = [
    ["path", { d: "M11 5h10" }],
    ["path", { d: "M11 12h10" }],
    ["path", { d: "M11 19h10" }],
    ["path", { d: "M4 4h1v5" }],
    ["path", { d: "M4 9h2" }],
    ["path", { d: "M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02" }],
];
var dQ = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M11 12H3" }],
    ["path", { d: "M11 19H3" }],
    ["path", { d: "M21 16V5" }],
    ["circle", { cx: "18", cy: "16", r: "3" }],
];
var MQ = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M11 12H3" }],
    ["path", { d: "M16 19H3" }],
    ["path", { d: "M18 9v6" }],
    ["path", { d: "M21 12h-6" }],
];
var tQ = [
    ["path", { d: "M21 5H3" }],
    ["path", { d: "M7 12H3" }],
    ["path", { d: "M7 19H3" }],
    [
        "path",
        {
            d: "M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14",
        },
    ],
    ["path", { d: "M11 10v4h4" }],
];
var UQ = [
    ["path", { d: "M3 5h6" }],
    ["path", { d: "M3 12h13" }],
    ["path", { d: "M3 19h13" }],
    ["path", { d: "m16 8-3-3 3-3" }],
    ["path", { d: "M21 19V7a2 2 0 0 0-2-2h-6" }],
];
var LQ = [
    ["path", { d: "M13 5h8" }],
    ["path", { d: "M13 12h8" }],
    ["path", { d: "M13 19h8" }],
    ["path", { d: "m3 17 2 2 4-4" }],
    ["rect", { x: "3", y: "4", width: "6", height: "6", rx: "1" }],
];
var RQ = [
    ["path", { d: "M8 5h13" }],
    ["path", { d: "M13 12h8" }],
    ["path", { d: "M13 19h8" }],
    ["path", { d: "M3 10a2 2 0 0 0 2 2h3" }],
    ["path", { d: "M3 5v12a2 2 0 0 0 2 2h3" }],
];
var lQ = [
    ["path", { d: "M21 5H3" }],
    ["path", { d: "M10 12H3" }],
    ["path", { d: "M10 19H3" }],
    [
        "path",
        {
            d: "M15 12.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997a1 1 0 0 1-1.517-.86z",
        },
    ],
];
var jQ = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M11 12H3" }],
    ["path", { d: "M16 19H3" }],
    ["path", { d: "m15.5 9.5 5 5" }],
    ["path", { d: "m20.5 9.5-5 5" }],
];
var mQ = [
    ["path", { d: "M3 5h.01" }],
    ["path", { d: "M3 12h.01" }],
    ["path", { d: "M3 19h.01" }],
    ["path", { d: "M8 5h13" }],
    ["path", { d: "M8 12h13" }],
    ["path", { d: "M8 19h13" }],
];
var V0 = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]];
var gQ = [
    ["path", { d: "M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" }],
    ["path", { d: "M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" }],
    ["path", { d: "M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var uQ = [
    ["path", { d: "M12 2v4" }],
    ["path", { d: "m16.2 7.8 2.9-2.9" }],
    ["path", { d: "M18 12h4" }],
    ["path", { d: "m16.2 16.2 2.9 2.9" }],
    ["path", { d: "M12 18v4" }],
    ["path", { d: "m4.9 19.1 2.9-2.9" }],
    ["path", { d: "M2 12h4" }],
    ["path", { d: "m4.9 4.9 2.9 2.9" }],
];
var cQ = [
    ["line", { x1: "2", x2: "5", y1: "12", y2: "12" }],
    ["line", { x1: "19", x2: "22", y1: "12", y2: "12" }],
    ["line", { x1: "12", x2: "12", y1: "2", y2: "5" }],
    ["line", { x1: "12", x2: "12", y1: "19", y2: "22" }],
    ["circle", { cx: "12", cy: "12", r: "7" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
];
var nQ = [
    ["path", { d: "M12 19v3" }],
    ["path", { d: "M12 2v3" }],
    ["path", { d: "M18.89 13.24a7 7 0 0 0-8.13-8.13" }],
    ["path", { d: "M19 12h3" }],
    ["path", { d: "M2 12h3" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M7.05 7.05a7 7 0 0 0 9.9 9.9" }],
];
var iQ = [
    ["line", { x1: "2", x2: "5", y1: "12", y2: "12" }],
    ["line", { x1: "19", x2: "22", y1: "12", y2: "12" }],
    ["line", { x1: "12", x2: "12", y1: "2", y2: "5" }],
    ["line", { x1: "12", x2: "12", y1: "19", y2: "22" }],
    ["circle", { cx: "12", cy: "12", r: "7" }],
];
var G0 = [
    ["circle", { cx: "12", cy: "16", r: "1" }],
    ["rect", { width: "18", height: "12", x: "3", y: "10", rx: "2" }],
    ["path", { d: "M7 10V7a5 5 0 0 1 9.33-2.5" }],
];
var oQ = [
    ["circle", { cx: "12", cy: "16", r: "1" }],
    ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2" }],
    ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3" }],
];
var W0 = [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1" }],
];
var rQ = [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }],
];
var eQ = [
    ["path", { d: "m10 17 5-5-5-5" }],
    ["path", { d: "M15 12H3" }],
    ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }],
];
var sQ = [
    ["path", { d: "m16 17 5-5-5-5" }],
    ["path", { d: "M21 12H9" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
];
var pQ = [
    ["path", { d: "M3 5h1" }],
    ["path", { d: "M3 12h1" }],
    ["path", { d: "M3 19h1" }],
    ["path", { d: "M8 5h1" }],
    ["path", { d: "M8 12h1" }],
    ["path", { d: "M8 19h1" }],
    ["path", { d: "M13 5h8" }],
    ["path", { d: "M13 12h8" }],
    ["path", { d: "M13 19h8" }],
];
var aQ = [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }],
    ["path", { d: "M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0" }],
];
var IJ = [
    [
        "path",
        {
            d: "M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2",
        },
    ],
    ["path", { d: "M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" }],
    ["path", { d: "M10 20h4" }],
    ["circle", { cx: "16", cy: "20", r: "2" }],
    ["circle", { cx: "8", cy: "20", r: "2" }],
];
var EJ = [
    ["path", { d: "m12 15 4 4" }],
    [
        "path",
        {
            d: "M2.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.029-6.029a1 1 0 1 1 3 3l-6.029 6.029a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l6.365-6.367A1 1 0 0 0 8.716 4.282z",
        },
    ],
    ["path", { d: "m5 8 4 4" }],
];
var NJ = [
    [
        "path",
        { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
    ["path", { d: "m16 19 2 2 4-4" }],
];
var $J = [
    [
        "path",
        { d: "M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
    ["path", { d: "M16 19h6" }],
];
var _J = [
    [
        "path",
        {
            d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
        },
    ],
    ["path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" }],
];
var ZJ = [
    [
        "path",
        { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
    ["path", { d: "M19 16v6" }],
    ["path", { d: "M16 19h6" }],
];
var x0 = [
    [
        "path",
        { d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
    [
        "path",
        {
            d: "M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2",
        },
    ],
    ["path", { d: "M20 22v.01" }],
];
var YJ = [
    [
        "path",
        { d: "M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
    ["path", { d: "M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
    ["path", { d: "m22 22-1.5-1.5" }],
];
var QJ = [
    [
        "path",
        { d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
    ["path", { d: "M20 14v4" }],
    ["path", { d: "M20 22v.01" }],
];
var JJ = [
    [
        "path",
        { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" },
    ],
    ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
    ["path", { d: "m17 17 4 4" }],
    ["path", { d: "m21 17-4 4" }],
];
var KJ = [
    ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }],
    ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }],
];
var XJ = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z",
        },
    ],
    ["polyline", { points: "15,9 18,9 18,11" }],
    ["path", { d: "M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" }],
    ["line", { x1: "6", x2: "7", y1: "10", y2: "10" }],
];
var VJ = [
    [
        "path",
        { d: "M17 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.732" },
    ],
    ["path", { d: "m22 5.5-6.419 4.179a2 2 0 0 1-2.162 0L7 5.5" }],
    ["rect", { x: "7", y: "3", width: "15", height: "12", rx: "2" }],
];
var GJ = [
    [
        "path",
        {
            d: "m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V14",
        },
    ],
    ["path", { d: "M15 5.764V14" }],
    ["path", { d: "M21 18h-6" }],
    ["path", { d: "M9 3.236v15" }],
];
var WJ = [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        },
    ],
    ["path", { d: "m9 10 2 2 4-4" }],
];
var xJ = [
    [
        "path",
        {
            d: "M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728",
        },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
    ["path", { d: "m16 18 2 2 4-4" }],
];
var HJ = [
    [
        "path",
        {
            d: "M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z",
        },
    ],
    [
        "path",
        {
            d: "M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2",
        },
    ],
    ["path", { d: "M18 22v-3" }],
    ["circle", { cx: "10", cy: "10", r: "3" }],
];
var zJ = [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        },
    ],
    ["path", { d: "M9 10h6" }],
];
var OJ = [
    [
        "path",
        {
            d: "M18.977 14C19.6 12.701 20 11.343 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738",
        },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
    ["path", { d: "M16 18h6" }],
];
var TJ = [
    ["path", { d: "M12.75 7.09a3 3 0 0 1 2.16 2.16" }],
    [
        "path",
        {
            d: "M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533" }],
    ["path", { d: "M9.13 9.13a3 3 0 0 0 3.74 3.74" }],
];
var H0 = [
    [
        "path",
        { d: "M17.97 9.304A8 8 0 0 0 2 10c0 4.69 4.887 9.562 7.022 11.468" },
    ],
    [
        "path",
        {
            d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
    ["circle", { cx: "10", cy: "10", r: "3" }],
];
var DJ = [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        },
    ],
    ["path", { d: "M12 7v6" }],
    ["path", { d: "M9 10h6" }],
];
var FJ = [
    [
        "path",
        {
            d: "M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738",
        },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
    ["path", { d: "M16 18h6" }],
    ["path", { d: "M19 15v6" }],
];
var AJ = [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        },
    ],
    ["path", { d: "m14.5 7.5-5 5" }],
    ["path", { d: "m9.5 7.5 5 5" }],
];
var BJ = [
    [
        "path",
        {
            d: "M19.752 11.901A7.78 7.78 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 19 19 0 0 0 .09-.077",
        },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
    ["path", { d: "m21.5 15.5-5 5" }],
    ["path", { d: "m21.5 20.5-5-5" }],
];
var SJ = [
    [
        "path",
        {
            d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
        },
    ],
    ["circle", { cx: "12", cy: "10", r: "3" }],
];
var vJ = [
    [
        "path",
        {
            d: "M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0",
        },
    ],
    ["circle", { cx: "12", cy: "8", r: "2" }],
    [
        "path",
        {
            d: "M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712",
        },
    ],
];
var yJ = [
    [
        "path",
        {
            d: "m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V12",
        },
    ],
    ["path", { d: "M15 5.764V12" }],
    ["path", { d: "M18 15v6" }],
    ["path", { d: "M21 18h-6" }],
    ["path", { d: "M9 3.236v15" }],
];
var PJ = [
    [
        "path",
        {
            d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
        },
    ],
    ["path", { d: "M15 5.764v15" }],
    ["path", { d: "M9 3.236v15" }],
];
var qJ = [
    ["path", { d: "m14 6 4 4" }],
    ["path", { d: "M17 3h4v4" }],
    ["path", { d: "m21 3-7.75 7.75" }],
    ["circle", { cx: "9", cy: "15", r: "6" }],
];
var CJ = [
    ["path", { d: "M16 3h5v5" }],
    ["path", { d: "m21 3-6.75 6.75" }],
    ["circle", { cx: "10", cy: "14", r: "6" }],
];
var hJ = [
    ["path", { d: "M8 22h8" }],
    ["path", { d: "M12 11v11" }],
    ["path", { d: "m19 3-7 8-7-8Z" }],
];
var bJ = [
    ["path", { d: "M15 3h6v6" }],
    ["path", { d: "m21 3-7 7" }],
    ["path", { d: "m3 21 7-7" }],
    ["path", { d: "M9 21H3v-6" }],
];
var kJ = [
    ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3" }],
    ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3" }],
    ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3" }],
];
var wJ = [
    [
        "path",
        {
            d: "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",
        },
    ],
    ["path", { d: "M11 12 5.12 2.2" }],
    ["path", { d: "m13 12 5.88-9.8" }],
    ["path", { d: "M8 7h8" }],
    ["circle", { cx: "12", cy: "17", r: "5" }],
    ["path", { d: "M12 18v-2h-.5" }],
];
var fJ = [
    ["path", { d: "M11.636 6A13 13 0 0 0 19.4 3.2 1 1 0 0 1 21 4v11.344" }],
    [
        "path",
        {
            d: "M14.378 14.357A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" },
    ],
    ["path", { d: "M8 8v6" }],
];
var dJ = [
    [
        "path",
        {
            d: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
        },
    ],
    [
        "path",
        { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" },
    ],
    ["path", { d: "M8 6v8" }],
];
var MJ = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "8", x2: "16", y1: "15", y2: "15" }],
    ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
    ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }],
];
var tJ = [
    ["path", { d: "M6 19v-3" }],
    ["path", { d: "M10 19v-3" }],
    ["path", { d: "M14 19v-3" }],
    ["path", { d: "M18 19v-3" }],
    ["path", { d: "M8 11V9" }],
    ["path", { d: "M16 11V9" }],
    ["path", { d: "M12 11V9" }],
    ["path", { d: "M2 15h20" }],
    [
        "path",
        {
            d: "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z",
        },
    ],
];
var UJ = [
    ["path", { d: "M4 5h16" }],
    ["path", { d: "M4 12h16" }],
    ["path", { d: "M4 19h16" }],
];
var LJ = [
    ["path", { d: "m8 6 4-4 4 4" }],
    ["path", { d: "M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" }],
    ["path", { d: "m20 22-5-5" }],
];
var RJ = [
    ["path", { d: "m10 9-3 3 3 3" }],
    ["path", { d: "m14 15 3-3-3-3" }],
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
];
var lJ = [
    ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0" }],
    ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0" }],
    ["path", { d: "M17.609 3.72a10 10 0 0 1 2.69 2.7" }],
    ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8" }],
    ["path", { d: "M20.28 17.61a10 10 0 0 1-2.7 2.69" }],
    ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8" }],
    ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69" }],
    ["path", { d: "m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98" }],
];
var jJ = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
    [
        "path",
        {
            d: "M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 5.004 2.224 3 3 0 0 1-.832 2.083l-3.447 3.62a1 1 0 0 1-1.45-.001z",
        },
    ],
];
var mJ = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
    ["path", { d: "M8 12h.01" }],
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M16 12h.01" }],
];
var gJ = [
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "M4.93 4.929a10 10 0 0 0-1.938 11.412 2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 0 0 11.302-1.989",
        },
    ],
    ["path", { d: "M8.35 2.69A10 10 0 0 1 21.3 15.65" }],
];
var uJ = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "M12 8v8" }],
];
var z0 = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
    ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
    ["path", { d: "M12 17h.01" }],
];
var cJ = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
    ["path", { d: "m10 15-3-3 3-3" }],
    ["path", { d: "M7 12h8a2 2 0 0 1 2 2v1" }],
];
var nJ = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
    ["path", { d: "M12 8v4" }],
    ["path", { d: "M12 16h.01" }],
];
var iJ = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "m9 9 6 6" }],
];
var oJ = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "m10 8-3 3 3 3" }],
    ["path", { d: "m14 14 3-3-3-3" }],
];
var rJ = [
    [
        "path",
        {
            d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        },
    ],
];
var eJ = [
    ["path", { d: "M12 19h.01" }],
    ["path", { d: "M12 3h.01" }],
    ["path", { d: "M16 19h.01" }],
    ["path", { d: "M16 3h.01" }],
    ["path", { d: "M2 13h.01" }],
    [
        "path",
        {
            d: "M2 17v4.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H8",
        },
    ],
    ["path", { d: "M2 5a2 2 0 0 1 2-2" }],
    ["path", { d: "M2 9h.01" }],
    ["path", { d: "M20 3a2 2 0 0 1 2 2" }],
    ["path", { d: "M22 13h.01" }],
    ["path", { d: "M22 17a2 2 0 0 1-2 2" }],
    ["path", { d: "M22 9h.01" }],
    ["path", { d: "M8 3h.01" }],
];
var sJ = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "M10 15h4" }],
    ["path", { d: "M10 9h4" }],
    ["path", { d: "M12 7v4" }],
];
var pJ = [
    [
        "path",
        {
            d: "M12.7 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4.7",
        },
    ],
    ["circle", { cx: "19", cy: "6", r: "3" }],
];
var aJ = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    [
        "path",
        {
            d: "M7.5 9.5c0 .687.265 1.383.697 1.844l3.009 3.264a1.14 1.14 0 0 0 .407.314 1 1 0 0 0 .783-.004 1.14 1.14 0 0 0 .398-.31l3.008-3.264A2.77 2.77 0 0 0 16.5 9.5 2.5 2.5 0 0 0 12 8a2.5 2.5 0 0 0-4.5 1.5",
        },
    ],
];
var IK = [
    [
        "path",
        {
            d: "M22 8.5V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H10",
        },
    ],
    ["path", { d: "M20 15v-2a2 2 0 0 0-4 0v2" }],
    ["rect", { x: "14", y: "15", width: "8", height: "5", rx: "1" }],
];
var EK = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "M12 11h.01" }],
    ["path", { d: "M16 11h.01" }],
    ["path", { d: "M8 11h.01" }],
];
var NK = [
    [
        "path",
        {
            d: "M19 19H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.7.7 0 0 1 2 21.286V5a2 2 0 0 1 1.184-1.826",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M8.656 3H20a2 2 0 0 1 2 2v11.344" }],
];
var $K = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "M12 8v6" }],
    ["path", { d: "M9 11h6" }],
];
var _K = [
    ["path", { d: "M14 14a2 2 0 0 0 2-2V8h-2" }],
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "M8 14a2 2 0 0 0 2-2V8H8" }],
];
var ZK = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "m10 8-3 3 3 3" }],
    ["path", { d: "M17 14v-1a2 2 0 0 0-2-2H7" }],
];
var YK = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "M7 11h10" }],
    ["path", { d: "M7 15h6" }],
    ["path", { d: "M7 7h8" }],
];
var QK = [
    [
        "path",
        {
            d: "M12 3H4a2 2 0 0 0-2 2v16.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H20a2 2 0 0 0 2-2v-4",
        },
    ],
    ["path", { d: "M16 3h6v6" }],
    ["path", { d: "m16 9 6-6" }],
];
var JK = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "M12 15h.01" }],
    ["path", { d: "M12 7v4" }],
];
var KK = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
];
var XK = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        },
    ],
    ["path", { d: "m14.5 8.5-5 5" }],
    ["path", { d: "m9.5 8.5 5 5" }],
];
var VK = [
    [
        "path",
        {
            d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
        },
    ],
    [
        "path",
        {
            d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
        },
    ],
];
var GK = [
    ["path", { d: "M12 19v3" }],
    ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33" }],
    ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2" }],
    ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12" }],
];
var WK = [
    ["path", { d: "M12 19v3" }],
    ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }],
    ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3" }],
];
var xK = [
    ["path", { d: "M18 12h2" }],
    ["path", { d: "M18 16h2" }],
    ["path", { d: "M18 20h2" }],
    ["path", { d: "M18 4h2" }],
    ["path", { d: "M18 8h2" }],
    ["path", { d: "M4 12h2" }],
    ["path", { d: "M4 16h2" }],
    ["path", { d: "M4 20h2" }],
    ["path", { d: "M4 4h2" }],
    ["path", { d: "M4 8h2" }],
    [
        "path",
        {
            d: "M8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1.5c-.276 0-.494.227-.562.495a2 2 0 0 1-3.876 0C9.994 2.227 9.776 2 9.5 2z",
        },
    ],
];
var O0 = [
    [
        "path",
        {
            d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12",
        },
    ],
    [
        "path",
        {
            d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5",
        },
    ],
    ["circle", { cx: "16", cy: "7", r: "5" }],
];
var HK = [
    ["path", { d: "M6 18h8" }],
    ["path", { d: "M3 22h18" }],
    ["path", { d: "M14 22a7 7 0 1 0 0-14h-1" }],
    ["path", { d: "M9 14h2" }],
    ["path", { d: "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" }],
    ["path", { d: "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" }],
];
var zK = [
    ["path", { d: "M12 13v8" }],
    ["path", { d: "M12 3v3" }],
    [
        "path",
        {
            d: "M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z",
        },
    ],
];
var OK = [
    ["path", { d: "M8 2h8" }],
    [
        "path",
        {
            d: "M9 2v1.343M15 2v2.789a4 4 0 0 0 .672 2.219l.656.984a4 4 0 0 1 .672 2.22v1.131M7.8 7.8l-.128.192A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3",
        },
    ],
    ["path", { d: "M7 15a6.47 6.47 0 0 1 5 0 6.472 6.472 0 0 0 3.435.435" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var TK = [
    ["rect", { width: "20", height: "15", x: "2", y: "4", rx: "2" }],
    ["rect", { width: "8", height: "7", x: "6", y: "8", rx: "1" }],
    ["path", { d: "M18 8v7" }],
    ["path", { d: "M6 19v2" }],
    ["path", { d: "M18 19v2" }],
];
var DK = [
    ["path", { d: "m14 10 7-7" }],
    ["path", { d: "M20 10h-6V4" }],
    ["path", { d: "m3 21 7-7" }],
    ["path", { d: "M4 14h6v6" }],
];
var FK = [
    ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3" }],
    ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3" }],
    ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3" }],
    ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3" }],
];
var AK = [
    ["path", { d: "M8 2h8" }],
    [
        "path",
        {
            d: "M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2",
        },
    ],
    ["path", { d: "M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0" }],
];
var BK = [["path", { d: "M5 12h14" }]];
var SK = [
    ["path", { d: "m9 10 2 2 4-4" }],
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
];
var vK = [
    ["path", { d: "M12 17v4" }],
    ["path", { d: "m14.305 7.53.923-.382" }],
    ["path", { d: "m15.228 4.852-.923-.383" }],
    ["path", { d: "m16.852 3.228-.383-.924" }],
    ["path", { d: "m16.852 8.772-.383.923" }],
    ["path", { d: "m19.148 3.228.383-.924" }],
    ["path", { d: "m19.53 9.696-.382-.924" }],
    ["path", { d: "m20.772 4.852.924-.383" }],
    ["path", { d: "m20.772 7.148.924.383" }],
    ["path", { d: "M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" }],
    ["path", { d: "M8 21h8" }],
    ["circle", { cx: "18", cy: "6", r: "3" }],
];
var yK = [
    ["path", { d: "M12 17v4" }],
    [
        "path",
        {
            d: "M22 12.307V15a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8.693",
        },
    ],
    ["path", { d: "M8 21h8" }],
    ["circle", { cx: "19", cy: "6", r: "3" }],
];
var PK = [
    ["path", { d: "M12 13V7" }],
    ["path", { d: "m15 10-3 3-3-3" }],
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
];
var qK = [
    ["path", { d: "M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2" }],
    ["path", { d: "M22 15V5a2 2 0 0 0-2-2H9" }],
    ["path", { d: "M8 21h8" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "m2 2 20 20" }],
];
var CK = [
    [
        "path",
        {
            d: "M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z",
        },
    ],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
    ["rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }],
];
var hK = [
    ["path", { d: "M10 13V7" }],
    ["path", { d: "M14 13V7" }],
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
];
var bK = [
    ["path", { d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" }],
    ["path", { d: "M10 19v-3.96 3.15" }],
    ["path", { d: "M7 19h5" }],
    ["rect", { width: "6", height: "10", x: "16", y: "12", rx: "2" }],
];
var kK = [
    ["path", { d: "M5.5 20H8" }],
    ["path", { d: "M17 9h.01" }],
    ["rect", { width: "10", height: "16", x: "12", y: "4", rx: "2" }],
    ["path", { d: "M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4" }],
    ["circle", { cx: "17", cy: "15", r: "1" }],
];
var wK = [
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
    ["rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }],
    ["rect", { x: "9", y: "7", width: "6", height: "6", rx: "1" }],
];
var fK = [
    ["path", { d: "m9 10 3-3 3 3" }],
    ["path", { d: "M12 13V7" }],
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
];
var dK = [
    ["path", { d: "m14.5 12.5-5-5" }],
    ["path", { d: "m9.5 12.5 5-5" }],
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
];
var MK = [
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
    ["line", { x1: "8", x2: "16", y1: "21", y2: "21" }],
    ["line", { x1: "12", x2: "12", y1: "17", y2: "21" }],
];
var tK = [
    ["path", { d: "M18 5h4" }],
    ["path", { d: "M20 3v4" }],
    [
        "path",
        {
            d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
        },
    ],
];
var UK = [
    [
        "path",
        {
            d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
        },
    ],
];
var LK = [
    ["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }],
    [
        "path",
        {
            d: "M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19",
        },
    ],
];
var RK = [["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }]];
var lK = [
    ["path", { d: "M12 6v.343" }],
    ["path", { d: "M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218" }],
    ["path", { d: "M19 13.343V9A7 7 0 0 0 8.56 2.902" }],
    ["path", { d: "M22 22 2 2" }],
];
var jK = [
    [
        "path",
        {
            d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z",
        },
    ],
];
var mK = [
    [
        "path",
        {
            d: "M2.034 2.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.944L8.204 7.545a1 1 0 0 0-.66.66l-1.066 3.443a.5.5 0 0 1-.944.033z",
        },
    ],
    ["circle", { cx: "16", cy: "16", r: "6" }],
    ["path", { d: "m11.8 11.8 8.4 8.4" }],
];
var gK = [
    ["path", { d: "M14 4.1 12 6" }],
    ["path", { d: "m5.1 8-2.9-.8" }],
    ["path", { d: "m6 12-1.9 2" }],
    ["path", { d: "M7.2 2.2 8 5.1" }],
    [
        "path",
        {
            d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
        },
    ],
];
var uK = [
    ["path", { d: "M12.586 12.586 19 19" }],
    [
        "path",
        {
            d: "M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",
        },
    ],
];
var cK = [
    ["rect", { x: "5", y: "2", width: "14", height: "20", rx: "7" }],
    ["path", { d: "M12 6v4" }],
];
var T0 = [
    ["path", { d: "M5 3v16h16" }],
    ["path", { d: "m5 19 6-6" }],
    ["path", { d: "m2 6 3-3 3 3" }],
    ["path", { d: "m18 16 3 3-3 3" }],
];
var nK = [
    ["path", { d: "M19 13v6h-6" }],
    ["path", { d: "M5 11V5h6" }],
    ["path", { d: "m5 5 14 14" }],
];
var iK = [
    ["path", { d: "M11 19H5v-6" }],
    ["path", { d: "M13 5h6v6" }],
    ["path", { d: "M19 5 5 19" }],
];
var oK = [
    ["path", { d: "M11 19H5V13" }],
    ["path", { d: "M19 5L5 19" }],
];
var rK = [
    ["path", { d: "M19 13V19H13" }],
    ["path", { d: "M5 5L19 19" }],
];
var eK = [
    ["path", { d: "M8 18L12 22L16 18" }],
    ["path", { d: "M12 2V22" }],
];
var sK = [
    ["path", { d: "m18 8 4 4-4 4" }],
    ["path", { d: "M2 12h20" }],
    ["path", { d: "m6 8-4 4 4 4" }],
];
var pK = [
    ["path", { d: "M6 8L2 12L6 16" }],
    ["path", { d: "M2 12H22" }],
];
var aK = [
    ["path", { d: "M18 8L22 12L18 16" }],
    ["path", { d: "M2 12H22" }],
];
var IX = [
    ["path", { d: "M5 11V5H11" }],
    ["path", { d: "M5 5L19 19" }],
];
var EX = [
    ["path", { d: "M13 5H19V11" }],
    ["path", { d: "M19 5L5 19" }],
];
var NX = [
    ["path", { d: "M8 6L12 2L16 6" }],
    ["path", { d: "M12 2V22" }],
];
var $X = [
    ["path", { d: "M12 2v20" }],
    ["path", { d: "m8 18 4 4 4-4" }],
    ["path", { d: "m8 6 4-4 4 4" }],
];
var _X = [
    ["path", { d: "M12 2v20" }],
    ["path", { d: "m15 19-3 3-3-3" }],
    ["path", { d: "m19 9 3 3-3 3" }],
    ["path", { d: "M2 12h20" }],
    ["path", { d: "m5 9-3 3 3 3" }],
    ["path", { d: "m9 5 3-3 3 3" }],
];
var ZX = [
    ["circle", { cx: "8", cy: "18", r: "4" }],
    ["path", { d: "M12 18V2l7 4" }],
];
var YX = [
    ["circle", { cx: "12", cy: "18", r: "4" }],
    ["path", { d: "M16 18V2" }],
];
var QX = [
    ["path", { d: "M9 18V5l12-2v13" }],
    ["path", { d: "m9 9 12-2" }],
    ["circle", { cx: "6", cy: "18", r: "3" }],
    ["circle", { cx: "18", cy: "16", r: "3" }],
];
var JX = [
    ["path", { d: "M9 18V5l12-2v13" }],
    ["circle", { cx: "6", cy: "18", r: "3" }],
    ["circle", { cx: "18", cy: "16", r: "3" }],
];
var KX = [
    ["path", { d: "M9.31 9.31 5 21l7-4 7 4-1.17-3.17" }],
    ["path", { d: "M14.53 8.88 12 2l-1.17 3.17" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var XX = [["polygon", { points: "12 2 19 21 12 17 5 21 12 2" }]];
var VX = [
    ["path", { d: "M8.43 8.43 3 11l8 2 2 8 2.57-5.43" }],
    ["path", { d: "M17.39 11.73 22 2l-9.73 4.61" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var GX = [["polygon", { points: "3 11 22 2 13 21 11 13 3 11" }]];
var WX = [
    ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1" }],
    ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1" }],
    ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1" }],
    ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" }],
    ["path", { d: "M12 12V8" }],
];
var xX = [
    ["path", { d: "M15 18h-5" }],
    ["path", { d: "M18 14h-8" }],
    [
        "path",
        {
            d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2",
        },
    ],
    ["rect", { width: "8", height: "4", x: "10", y: "6", rx: "1" }],
];
var HX = [
    ["path", { d: "M6 8.32a7.43 7.43 0 0 1 0 7.36" }],
    ["path", { d: "M9.46 6.21a11.76 11.76 0 0 1 0 11.58" }],
    ["path", { d: "M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" }],
    ["path", { d: "M16.37 2a20.16 20.16 0 0 1 0 20" }],
];
var zX = [
    ["path", { d: "M12 2v10" }],
    ["path", { d: "m8.5 4 7 4" }],
    ["path", { d: "m8.5 8 7-4" }],
    ["circle", { cx: "12", cy: "17", r: "5" }],
];
var OX = [
    [
        "path",
        { d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" },
    ],
    ["path", { d: "M2 6h4" }],
    ["path", { d: "M2 10h4" }],
    ["path", { d: "M2 14h4" }],
    ["path", { d: "M2 18h4" }],
    [
        "path",
        {
            d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
];
var TX = [
    ["path", { d: "M2 6h4" }],
    ["path", { d: "M2 10h4" }],
    ["path", { d: "M2 14h4" }],
    ["path", { d: "M2 18h4" }],
    ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
    ["path", { d: "M15 2v20" }],
    ["path", { d: "M15 7h5" }],
    ["path", { d: "M15 12h5" }],
    ["path", { d: "M15 17h5" }],
];
var DX = [
    ["path", { d: "M2 6h4" }],
    ["path", { d: "M2 10h4" }],
    ["path", { d: "M2 14h4" }],
    ["path", { d: "M2 18h4" }],
    ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
    ["path", { d: "M9.5 8h5" }],
    ["path", { d: "M9.5 12H16" }],
    ["path", { d: "M9.5 16H14" }],
];
var FX = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M12 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M20 12v2" }],
    ["path", { d: "M20 18v2a2 2 0 0 1-2 2h-1" }],
    ["path", { d: "M13 22h-2" }],
    ["path", { d: "M7 22H6a2 2 0 0 1-2-2v-2" }],
    ["path", { d: "M4 14v-2" }],
    ["path", { d: "M4 8V6a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M8 10h6" }],
    ["path", { d: "M8 14h8" }],
    ["path", { d: "M8 18h5" }],
];
var AX = [
    ["path", { d: "M2 6h4" }],
    ["path", { d: "M2 10h4" }],
    ["path", { d: "M2 14h4" }],
    ["path", { d: "M2 18h4" }],
    ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
    ["path", { d: "M16 2v20" }],
];
var BX = [
    ["path", { d: "M8 2v4" }],
    ["path", { d: "M12 2v4" }],
    ["path", { d: "M16 2v4" }],
    ["rect", { width: "16", height: "18", x: "4", y: "4", rx: "2" }],
    ["path", { d: "M8 10h6" }],
    ["path", { d: "M8 14h8" }],
    ["path", { d: "M8 18h5" }],
];
var SX = [
    ["path", { d: "M12 4V2" }],
    [
        "path",
        {
            d: "M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592a7.01 7.01 0 0 0 4.125-2.939",
        },
    ],
    ["path", { d: "M19 10v3.343" }],
    [
        "path",
        {
            d: "M12 12c-1.349-.573-1.905-1.005-2.5-2-.546.902-1.048 1.353-2.5 2-1.018-.644-1.46-1.08-2-2-1.028.71-1.69.918-3 1 1.081-1.048 1.757-2.03 2-3 .194-.776.84-1.551 1.79-2.21m11.654 5.997c.887-.457 1.28-.891 1.556-1.787 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4-.74 0-1.461.068-2.15.192",
        },
    ],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var vX = [
    ["path", { d: "M12 4V2" }],
    [
        "path",
        {
            d: "M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592A7.003 7.003 0 0 0 19 14v-4",
        },
    ],
    [
        "path",
        {
            d: "M12 4C8 4 4.5 6 4 8c-.243.97-.919 1.952-2 3 1.31-.082 1.972-.29 3-1 .54.92.982 1.356 2 2 1.452-.647 1.954-1.098 2.5-2 .595.995 1.151 1.427 2.5 2 1.31-.621 1.862-1.058 2.5-2 .629.977 1.162 1.423 2.5 2 1.209-.548 1.68-.967 2-2 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4Z",
        },
    ],
];
var D0 = [
    ["path", { d: "M12 16h.01" }],
    ["path", { d: "M12 8v4" }],
    [
        "path",
        {
            d: "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",
        },
    ],
];
var yX = [
    [
        "path",
        {
            d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
        },
    ],
    ["path", { d: "M8 12h8" }],
];
var F0 = [
    ["path", { d: "m15 9-6 6" }],
    [
        "path",
        {
            d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
        },
    ],
    ["path", { d: "m9 9 6 6" }],
];
var PX = [
    [
        "path",
        {
            d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
        },
    ],
];
var A0 = [
    ["path", { d: "M10 15V9" }],
    ["path", { d: "M14 15V9" }],
    [
        "path",
        {
            d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z",
        },
    ],
];
var qX = [
    [
        "path",
        {
            d: "M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21",
        },
    ],
];
var CX = [
    ["path", { d: "M3 3h6l6 18h6" }],
    ["path", { d: "M14 3h7" }],
];
var hX = [
    ["path", { d: "M20.341 6.484A10 10 0 0 1 10.266 21.85" }],
    ["path", { d: "M3.659 17.516A10 10 0 0 1 13.74 2.152" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
    ["circle", { cx: "19", cy: "5", r: "2" }],
    ["circle", { cx: "5", cy: "19", r: "2" }],
];
var bX = [
    ["path", { d: "M12 3v6" }],
    [
        "path",
        {
            d: "M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z",
        },
    ],
    ["path", { d: "M3.054 9.013h17.893" }],
];
var kX = [
    ["path", { d: "m16 16 2 2 4-4" }],
    [
        "path",
        {
            d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
        },
    ],
    ["path", { d: "m7.5 4.27 9 5.15" }],
    ["polyline", { points: "3.29 7 12 12 20.71 7" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
];
var wX = [
    [
        "path",
        { d: "M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025" },
    ],
    [
        "path",
        {
            d: "m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009",
        },
    ],
    [
        "path",
        {
            d: "m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027",
        },
    ],
];
var fX = [
    ["path", { d: "M16 16h6" }],
    [
        "path",
        {
            d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
        },
    ],
    ["path", { d: "m7.5 4.27 9 5.15" }],
    ["polyline", { points: "3.29 7 12 12 20.71 7" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
];
var dX = [
    ["path", { d: "M12 22v-9" }],
    [
        "path",
        {
            d: "M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z",
        },
    ],
    [
        "path",
        {
            d: "M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13",
        },
    ],
    [
        "path",
        {
            d: "M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z",
        },
    ],
];
var MX = [
    ["path", { d: "M16 16h6" }],
    ["path", { d: "M19 13v6" }],
    [
        "path",
        {
            d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
        },
    ],
    ["path", { d: "m7.5 4.27 9 5.15" }],
    ["polyline", { points: "3.29 7 12 12 20.71 7" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
];
var tX = [
    [
        "path",
        {
            d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
        },
    ],
    ["path", { d: "m7.5 4.27 9 5.15" }],
    ["polyline", { points: "3.29 7 12 12 20.71 7" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
    ["path", { d: "m17 13 5 5m-5 0 5-5" }],
];
var UX = [
    [
        "path",
        {
            d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
        },
    ],
    ["path", { d: "m7.5 4.27 9 5.15" }],
    ["polyline", { points: "3.29 7 12 12 20.71 7" }],
    ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
    ["circle", { cx: "18.5", cy: "15.5", r: "2.5" }],
    ["path", { d: "M20.27 17.27 22 19" }],
];
var LX = [
    [
        "path",
        {
            d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
        },
    ],
    ["path", { d: "M12 22V12" }],
    ["polyline", { points: "3.29 7 12 12 20.71 7" }],
    ["path", { d: "m7.5 4.27 9 5.15" }],
];
var RX = [
    [
        "path",
        {
            d: "m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z",
        },
    ],
    ["path", { d: "m5 2 5 5" }],
    ["path", { d: "M2 13h15" }],
    ["path", { d: "M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" }],
];
var lX = [
    ["rect", { width: "16", height: "6", x: "2", y: "2", rx: "2" }],
    [
        "path",
        { d: "M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
    ],
    ["rect", { width: "4", height: "6", x: "8", y: "16", rx: "1" }],
];
var B0 = [
    ["path", { d: "M10 2v2" }],
    ["path", { d: "M14 2v4" }],
    ["path", { d: "M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z" }],
    [
        "path",
        {
            d: "M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1",
        },
    ],
];
var jX = [
    ["path", { d: "m14.622 17.897-10.68-2.913" }],
    [
        "path",
        {
            d: "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z",
        },
    ],
    [
        "path",
        {
            d: "M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15",
        },
    ],
];
var mX = [
    [
        "path",
        {
            d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
        },
    ],
    ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor" }],
    ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor" }],
    ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor" }],
    ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor" }],
];
var gX = [
    ["path", { d: "M11.25 17.25h1.5L12 18z" }],
    ["path", { d: "m15 12 2 2" }],
    ["path", { d: "M18 6.5a.5.5 0 0 0-.5-.5" }],
    [
        "path",
        {
            d: "M20.69 9.67a4.5 4.5 0 1 0-7.04-5.5 8.35 8.35 0 0 0-3.3 0 4.5 4.5 0 1 0-7.04 5.5C2.49 11.2 2 12.88 2 14.5 2 19.47 6.48 22 12 22s10-2.53 10-7.5c0-1.62-.48-3.3-1.3-4.83",
        },
    ],
    ["path", { d: "M6 6.5a.495.495 0 0 1 .5-.5" }],
    ["path", { d: "m9 12-2 2" }],
];
var uX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 15h18" }],
    ["path", { d: "m15 8-3 3-3-3" }],
];
var S0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M14 15h1" }],
    ["path", { d: "M19 15h2" }],
    ["path", { d: "M3 15h2" }],
    ["path", { d: "M9 15h1" }],
];
var cX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 15h18" }],
    ["path", { d: "m9 10 3-3 3 3" }],
];
var v0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m16 15-3-3 3-3" }],
];
var nX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 15h18" }],
];
var y0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 14v1" }],
    ["path", { d: "M9 19v2" }],
    ["path", { d: "M9 3v2" }],
    ["path", { d: "M9 9v1" }],
];
var P0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m14 9 3 3-3 3" }],
];
var iX = [
    ["path", { d: "M15 10V9" }],
    ["path", { d: "M15 15v-1" }],
    ["path", { d: "M15 21v-2" }],
    ["path", { d: "M15 5V3" }],
    ["path", { d: "M9 10V9" }],
    ["path", { d: "M9 15v-1" }],
    ["path", { d: "M9 21v-2" }],
    ["path", { d: "M9 5V3" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var q0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
];
var oX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M15 3v18" }],
    ["path", { d: "m8 9 3 3-3 3" }],
];
var C0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M15 14v1" }],
    ["path", { d: "M15 19v2" }],
    ["path", { d: "M15 3v2" }],
    ["path", { d: "M15 9v1" }],
];
var rX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M15 3v18" }],
    ["path", { d: "m10 15-3-3 3-3" }],
];
var eX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M15 3v18" }],
];
var sX = [
    ["path", { d: "M14 15h1" }],
    ["path", { d: "M14 9h1" }],
    ["path", { d: "M19 15h2" }],
    ["path", { d: "M19 9h2" }],
    ["path", { d: "M3 15h2" }],
    ["path", { d: "M3 9h2" }],
    ["path", { d: "M9 15h1" }],
    ["path", { d: "M9 9h1" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var pX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "m9 16 3-3 3 3" }],
];
var h0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M14 9h1" }],
    ["path", { d: "M19 9h2" }],
    ["path", { d: "M3 9h2" }],
    ["path", { d: "M9 9h1" }],
];
var aX = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "m15 14-3 3-3-3" }],
];
var IV = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 9h18" }],
];
var EV = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "M9 15h12" }],
];
var NV = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 15h12" }],
    ["path", { d: "M15 3v18" }],
];
var b0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "M9 21V9" }],
];
var $V = [
    [
        "path",
        {
            d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
        },
    ],
];
var _V = [
    ["path", { d: "M8 21s-4-3-4-9 4-9 4-9" }],
    ["path", { d: "M16 3s4 3 4 9-4 9-4 9" }],
];
var ZV = [
    ["path", { d: "M11 15h2" }],
    ["path", { d: "M12 12v3" }],
    ["path", { d: "M12 19v3" }],
    [
        "path",
        {
            d: "M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z",
        },
    ],
    ["path", { d: "M9 9a3 3 0 1 1 6 0" }],
];
var YV = [
    ["path", { d: "M5.8 11.3 2 22l10.7-3.79" }],
    ["path", { d: "M4 3h.01" }],
    ["path", { d: "M22 8h.01" }],
    ["path", { d: "M15 2h.01" }],
    ["path", { d: "M22 20h.01" }],
    [
        "path",
        {
            d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10",
        },
    ],
    [
        "path",
        {
            d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17",
        },
    ],
    [
        "path",
        { d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" },
    ],
    [
        "path",
        {
            d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z",
        },
    ],
];
var QV = [
    ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1" }],
    ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1" }],
];
var JV = [
    ["circle", { cx: "11", cy: "4", r: "2" }],
    ["circle", { cx: "18", cy: "8", r: "2" }],
    ["circle", { cx: "20", cy: "16", r: "2" }],
    [
        "path",
        {
            d: "M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z",
        },
    ],
];
var KV = [
    ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2" }],
    ["path", { d: "M15 14h.01" }],
    ["path", { d: "M9 6h6" }],
    ["path", { d: "M9 10h6" }],
];
var k0 = [
    ["path", { d: "M13 21h8" }],
    [
        "path",
        {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        },
    ],
];
var XV = [
    [
        "path",
        {
            d: "m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982",
        },
    ],
    [
        "path",
        { d: "m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" },
    ],
    ["path", { d: "m2 2 20 20" }],
];
var VV = [
    [
        "path",
        {
            d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z",
        },
    ],
    [
        "path",
        {
            d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18",
        },
    ],
    ["path", { d: "m2.3 2.3 7.286 7.286" }],
    ["circle", { cx: "11", cy: "11", r: "2" }],
];
var GV = [
    ["path", { d: "M13 21h8" }],
    ["path", { d: "m15 5 4 4" }],
    [
        "path",
        {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        },
    ],
];
var w0 = [
    [
        "path",
        {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        },
    ],
];
var WV = [
    [
        "path",
        {
            d: "m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982",
        },
    ],
    [
        "path",
        { d: "m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" },
    ],
    ["path", { d: "m15 5 4 4" }],
    ["path", { d: "m2 2 20 20" }],
];
var xV = [
    [
        "path",
        {
            d: "M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13",
        },
    ],
    ["path", { d: "m8 6 2-2" }],
    ["path", { d: "m18 16 2-2" }],
    [
        "path",
        {
            d: "m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17",
        },
    ],
    [
        "path",
        {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        },
    ],
    ["path", { d: "m15 5 4 4" }],
];
var HV = [
    [
        "path",
        {
            d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        },
    ],
    ["path", { d: "m15 5 4 4" }],
];
var zV = [
    [
        "path",
        {
            d: "M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z",
        },
    ],
];
var OV = [
    ["line", { x1: "19", x2: "5", y1: "5", y2: "19" }],
    ["circle", { cx: "6.5", cy: "6.5", r: "2.5" }],
    ["circle", { cx: "17.5", cy: "17.5", r: "2.5" }],
];
var TV = [
    ["circle", { cx: "12", cy: "5", r: "1" }],
    ["path", { d: "m9 20 3-6 3 6" }],
    ["path", { d: "m6 8 6 2 6-2" }],
    ["path", { d: "M12 10v4" }],
];
var DV = [
    ["path", { d: "M20 11H4" }],
    ["path", { d: "M20 7H4" }],
    ["path", { d: "M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" }],
];
var FV = [
    ["path", { d: "M13 2a9 9 0 0 1 9 9" }],
    ["path", { d: "M13 6a5 5 0 0 1 5 5" }],
    [
        "path",
        {
            d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        },
    ],
];
var AV = [
    ["path", { d: "M14 6h8" }],
    ["path", { d: "m18 2 4 4-4 4" }],
    [
        "path",
        {
            d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        },
    ],
];
var BV = [
    ["path", { d: "M16 2v6h6" }],
    ["path", { d: "m22 2-6 6" }],
    [
        "path",
        {
            d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        },
    ],
];
var SV = [
    ["path", { d: "m16 2 6 6" }],
    ["path", { d: "m22 2-6 6" }],
    [
        "path",
        {
            d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        },
    ],
];
var vV = [
    [
        "path",
        {
            d: "M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272",
        },
    ],
    ["path", { d: "M22 2 2 22" }],
    [
        "path",
        {
            d: "M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473",
        },
    ],
];
var yV = [
    ["path", { d: "m16 8 6-6" }],
    ["path", { d: "M22 8V2h-6" }],
    [
        "path",
        {
            d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        },
    ],
];
var PV = [
    [
        "path",
        {
            d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
        },
    ],
];
var qV = [
    ["line", { x1: "9", x2: "9", y1: "4", y2: "20" }],
    ["path", { d: "M4 7c0-1.7 1.3-3 3-3h13" }],
    ["path", { d: "M18 20c-1.7 0-3-1.3-3-3V4" }],
];
var CV = [
    [
        "path",
        {
            d: "M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8",
        },
    ],
    ["path", { d: "M2 14h20" }],
    ["path", { d: "M6 14v4" }],
    ["path", { d: "M10 14v4" }],
    ["path", { d: "M14 14v4" }],
    ["path", { d: "M18 14v4" }],
];
var hV = [
    ["path", { d: "m14 13-8.381 8.38a1 1 0 0 1-3.001-3L11 9.999" }],
    [
        "path",
        {
            d: "M15.973 4.027A13 13 0 0 0 5.902 2.373c-1.398.342-1.092 2.158.277 2.601a19.9 19.9 0 0 1 5.822 3.024",
        },
    ],
    [
        "path",
        {
            d: "M16.001 11.999a19.9 19.9 0 0 1 3.024 5.824c.444 1.369 2.26 1.676 2.603.278A13 13 0 0 0 20 8.069",
        },
    ],
    [
        "path",
        {
            d: "M18.352 3.352a1.205 1.205 0 0 0-1.704 0l-5.296 5.296a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l5.296-5.296a1.205 1.205 0 0 0 0-1.704z",
        },
    ],
];
var bV = [
    ["path", { d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4" }],
    ["rect", { width: "10", height: "7", x: "12", y: "13", rx: "2" }],
];
var kV = [
    ["path", { d: "M2 10h6V4" }],
    ["path", { d: "m2 4 6 6" }],
    ["path", { d: "M21 10V7a2 2 0 0 0-2-2h-7" }],
    ["path", { d: "M3 14v2a2 2 0 0 0 2 2h3" }],
    ["rect", { x: "12", y: "14", width: "10", height: "7", rx: "1" }],
];
var wV = [
    [
        "path",
        {
            d: "M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z",
        },
    ],
    ["path", { d: "M16 10h.01" }],
    ["path", { d: "M2 8v1a2 2 0 0 0 2 2h1" }],
];
var fV = [
    ["path", { d: "M10 3v11" }],
    ["path", { d: "M10 9H7a1 1 0 0 1 0-6h8" }],
    ["path", { d: "M14 3v11" }],
    ["path", { d: "m18 14 4 4H2" }],
    ["path", { d: "m22 18-4 4" }],
];
var dV = [
    ["path", { d: "M14 3v11" }],
    ["path", { d: "M14 9h-3a3 3 0 0 1 0-6h9" }],
    ["path", { d: "M18 3v11" }],
    ["path", { d: "M22 18H2l4-4" }],
    ["path", { d: "m6 22-4-4" }],
];
var MV = [
    ["path", { d: "M13 4v16" }],
    ["path", { d: "M17 4v16" }],
    ["path", { d: "M19 4H9.5a4.5 4.5 0 0 0 0 9H13" }],
];
var tV = [
    ["path", { d: "M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" }],
    ["path", { d: "M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" }],
    ["rect", { width: "16", height: "5", x: "4", y: "2", rx: "1" }],
];
var UV = [
    [
        "path",
        {
            d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z",
        },
    ],
    ["path", { d: "m8.5 8.5 7 7" }],
];
var LV = [
    ["path", { d: "M12 17v5" }],
    ["path", { d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" }],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11",
        },
    ],
];
var RV = [
    ["path", { d: "M12 17v5" }],
    [
        "path",
        {
            d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z",
        },
    ],
];
var lV = [
    [
        "path",
        {
            d: "m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12",
        },
    ],
    [
        "path",
        {
            d: "m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z",
        },
    ],
    ["path", { d: "m2 22 .414-.414" }],
];
var jV = [
    ["path", { d: "m12 14-1 1" }],
    ["path", { d: "m13.75 18.25-1.25 1.42" }],
    ["path", { d: "M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12" }],
    ["path", { d: "M18.8 9.3a1 1 0 0 0 2.1 7.7" }],
    [
        "path",
        {
            d: "M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z",
        },
    ],
];
var mV = [
    ["path", { d: "M2 22h20" }],
    [
        "path",
        {
            d: "M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z",
        },
    ],
];
var gV = [
    ["path", { d: "M2 22h20" }],
    [
        "path",
        {
            d: "M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z",
        },
    ],
];
var uV = [
    [
        "path",
        {
            d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
        },
    ],
];
var cV = [
    [
        "path",
        {
            d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
        },
    ],
];
var nV = [
    ["path", { d: "M9 2v6" }],
    ["path", { d: "M15 2v6" }],
    ["path", { d: "M12 17v5" }],
    ["path", { d: "M5 8h14" }],
    ["path", { d: "M6 11V8h12v3a6 6 0 1 1-12 0Z" }],
];
var f0 = [
    [
        "path",
        {
            d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
        },
    ],
    ["path", { d: "m2 22 3-3" }],
    ["path", { d: "M7.5 13.5 10 11" }],
    ["path", { d: "M10.5 16.5 13 14" }],
    ["path", { d: "m18 3-4 4h6l-4 4" }],
];
var iV = [
    ["path", { d: "M12 22v-5" }],
    ["path", { d: "M9 8V2" }],
    ["path", { d: "M15 8V2" }],
    ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" }],
];
var oV = [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "M12 5v14" }],
];
var rV = [
    ["path", { d: "M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2" }],
    ["path", { d: "M18 6h.01" }],
    ["path", { d: "M6 18h.01" }],
    [
        "path",
        { d: "M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z" },
    ],
    ["path", { d: "M18 11.66V22a4 4 0 0 0 4-4V6" }],
];
var eV = [
    [
        "path",
        {
            d: "M13 17a1 1 0 1 0-2 0l.5 4.5a0.5 0.5 0 0 0 1 0z",
            fill: "currentColor",
        },
    ],
    ["path", { d: "M16.85 18.58a9 9 0 1 0-9.7 0" }],
    ["path", { d: "M8 14a5 5 0 1 1 8 0" }],
    ["circle", { cx: "12", cy: "11", r: "1", fill: "currentColor" }],
];
var sV = [
    ["path", { d: "M20 3a2 2 0 0 1 2 2v6a1 1 0 0 1-20 0V5a2 2 0 0 1 2-2z" }],
    ["path", { d: "m8 10 4 4 4-4" }],
];
var pV = [
    ["path", { d: "M22 14a8 8 0 0 1-8 8" }],
    ["path", { d: "M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" }],
    ["path", { d: "M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" }],
    ["path", { d: "M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" }],
    [
        "path",
        {
            d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15",
        },
    ],
];
var aV = [
    ["path", { d: "M10 4.5V4a2 2 0 0 0-2.41-1.957" }],
    ["path", { d: "M13.9 8.4a2 2 0 0 0-1.26-1.295" }],
    [
        "path",
        {
            d: "M21.7 16.2A8 8 0 0 0 22 14v-3a2 2 0 1 0-4 0v-1a2 2 0 0 0-3.63-1.158",
        },
    ],
    [
        "path",
        {
            d: "m7 15-1.8-1.8a2 2 0 0 0-2.79 2.86L6 19.7a7.74 7.74 0 0 0 6 2.3h2a8 8 0 0 0 5.657-2.343",
        },
    ],
    ["path", { d: "M6 6v8" }],
    ["path", { d: "m2 2 20 20" }],
];
var IG = [
    [
        "path",
        {
            d: "M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4",
        },
    ],
    ["path", { d: "M10 22 9 8" }],
    ["path", { d: "m14 22 1-14" }],
    [
        "path",
        {
            d: "M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z",
        },
    ],
];
var EG = [
    [
        "path",
        {
            d: "M18.6 14.4c.8-.8.8-2 0-2.8l-8.1-8.1a4.95 4.95 0 1 0-7.1 7.1l8.1 8.1c.9.7 2.1.7 2.9-.1Z",
        },
    ],
    ["path", { d: "m22 22-5.5-5.5" }],
];
var NG = [
    ["path", { d: "M18 7c0-5.333-8-5.333-8 0" }],
    ["path", { d: "M10 7v14" }],
    ["path", { d: "M6 21h12" }],
    ["path", { d: "M6 13h10" }],
];
var $G = [
    ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15" }],
    ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68" }],
    ["path", { d: "M12 2v4" }],
    ["path", { d: "m2 2 20 20" }],
];
var _G = [
    ["path", { d: "M2 3h20" }],
    ["path", { d: "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" }],
    ["path", { d: "m7 21 5-5 5 5" }],
];
var ZG = [
    ["path", { d: "M12 2v10" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04" }],
];
var YG = [
    [
        "path",
        { d: "M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5" },
    ],
    ["path", { d: "m16 19 2 2 4-4" }],
    [
        "path",
        { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" },
    ],
    ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" }],
];
var QG = [
    [
        "path",
        {
            d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
        },
    ],
    ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" }],
    ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1" }],
];
var JG = [
    ["path", { d: "M5 7 3 5" }],
    ["path", { d: "M9 6V3" }],
    ["path", { d: "m13 7 2-2" }],
    ["circle", { cx: "9", cy: "13", r: "3" }],
    [
        "path",
        {
            d: "M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17",
        },
    ],
    ["path", { d: "M16 16h2" }],
];
var KG = [
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["path", { d: "M12 9v11" }],
    ["path", { d: "M2 9h13a2 2 0 0 1 2 2v9" }],
];
var XG = [
    [
        "path",
        {
            d: "M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z",
        },
    ],
    ["path", { d: "M12 2v20" }],
];
var VG = [
    [
        "path",
        {
            d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
        },
    ],
];
var GG = [
    ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1" }],
    ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1" }],
    ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1" }],
    ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3" }],
    ["path", { d: "M21 21v.01" }],
    ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7" }],
    ["path", { d: "M3 12h.01" }],
    ["path", { d: "M12 3h.01" }],
    ["path", { d: "M12 16v.01" }],
    ["path", { d: "M16 12h1" }],
    ["path", { d: "M21 12v.01" }],
    ["path", { d: "M12 21v-1" }],
];
var WG = [
    [
        "path",
        {
            d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
        },
    ],
    [
        "path",
        {
            d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
        },
    ],
];
var xG = [
    ["path", { d: "M13 16a3 3 0 0 1 2.24 5" }],
    ["path", { d: "M18 12h.01" }],
    [
        "path",
        {
            d: "M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3",
        },
    ],
    ["path", { d: "M20 8.54V4a2 2 0 1 0-4 0v3" }],
    ["path", { d: "M7.612 12.524a3 3 0 1 0-1.6 4.3" }],
];
var HG = [
    ["path", { d: "M19.07 4.93A10 10 0 0 0 6.99 3.34" }],
    ["path", { d: "M4 6h.01" }],
    ["path", { d: "M2.29 9.62A10 10 0 1 0 21.31 8.35" }],
    ["path", { d: "M16.24 7.76A6 6 0 1 0 8.23 16.67" }],
    ["path", { d: "M12 18h.01" }],
    ["path", { d: "M17.99 11.66A6 6 0 0 1 15.77 16.67" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
    ["path", { d: "m13.41 10.59 5.66-5.66" }],
];
var zG = [
    ["path", { d: "M12 12h.01" }],
    [
        "path",
        {
            d: "M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z",
        },
    ],
    [
        "path",
        {
            d: "M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z",
        },
    ],
    [
        "path",
        {
            d: "M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z",
        },
    ],
];
var OG = [
    ["path", { d: "M5 16v2" }],
    ["path", { d: "M19 16v2" }],
    ["rect", { width: "20", height: "8", x: "2", y: "8", rx: "2" }],
    ["path", { d: "M18 12h.01" }],
];
var TG = [
    [
        "path",
        {
            d: "M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21",
        },
    ],
];
var DG = [
    ["path", { d: "M4.9 16.1C1 12.2 1 5.8 4.9 1.9" }],
    ["path", { d: "M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" }],
    ["circle", { cx: "12", cy: "9", r: "2" }],
    ["path", { d: "M16.2 4.8c2 2 2.26 5.11.8 7.47" }],
    ["path", { d: "M19.1 1.9a9.96 9.96 0 0 1 0 14.1" }],
    ["path", { d: "M9.5 18h5" }],
    ["path", { d: "m8 22 4-11 4 11" }],
];
var FG = [
    ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478" }],
    ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134" }],
    ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134" }],
    ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var AG = [
    ["path", { d: "M20.34 17.52a10 10 0 1 0-2.82 2.82" }],
    ["circle", { cx: "19", cy: "19", r: "2" }],
    ["path", { d: "m13.41 13.41 4.18 4.18" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var BG = [
    ["path", { d: "M5 15h14" }],
    ["path", { d: "M5 9h14" }],
    ["path", { d: "m14 20-5-5 6-6-5-5" }],
];
var SG = [
    ["path", { d: "M22 17a10 10 0 0 0-20 0" }],
    ["path", { d: "M6 17a6 6 0 0 1 12 0" }],
    ["path", { d: "M10 17a2 2 0 0 1 4 0" }],
];
var vG = [
    ["path", { d: "M13 22H4a2 2 0 0 1 0-4h12" }],
    ["path", { d: "M13.236 18a3 3 0 0 0-2.2-5" }],
    ["path", { d: "M16 9h.01" }],
    [
        "path",
        {
            d: "M16.82 3.94a3 3 0 1 1 3.237 4.868l1.815 2.587a1.5 1.5 0 0 1-1.5 2.1l-2.872-.453a3 3 0 0 0-3.5 3",
        },
    ],
    [
        "path",
        {
            d: "M17 4.988a3 3 0 1 0-5.2 2.052A7 7 0 0 0 4 14.015 4 4 0 0 0 8 18",
        },
    ],
];
var yG = [
    ["rect", { width: "12", height: "20", x: "6", y: "2", rx: "2" }],
    ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }],
];
var PG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M12 6.5v11" }],
    ["path", { d: "M15 9.4a4 4 0 1 0 0 5.2" }],
];
var qG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M8 12h5" }],
    ["path", { d: "M16 9.5a4 4 0 1 0 0 5.2" }],
];
var CG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M8 7h8" }],
    ["path", { d: "M12 17.5 8 15h1a4 4 0 0 0 0-8" }],
    ["path", { d: "M8 11h8" }],
];
var hG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "m12 10 3-3" }],
    ["path", { d: "m9 7 3 3v7.5" }],
    ["path", { d: "M9 11h6" }],
    ["path", { d: "M9 15h6" }],
];
var bG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M8 13h5" }],
    ["path", { d: "M10 17V9.5a2.5 2.5 0 0 1 5 0" }],
    ["path", { d: "M8 17h7" }],
];
var kG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M10 17V7h5" }],
    ["path", { d: "M10 11h4" }],
    ["path", { d: "M8 15h5" }],
];
var wG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M8 15h5" }],
    ["path", { d: "M8 11h5a2 2 0 1 0 0-4h-3v10" }],
];
var fG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M14 8H8" }],
    ["path", { d: "M16 12H8" }],
    ["path", { d: "M13 16H8" }],
];
var dG = [
    ["path", { d: "M10 6.5v11a5.5 5.5 0 0 0 5.5-5.5" }],
    ["path", { d: "m14 8-6 3" }],
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z",
        },
    ],
];
var MG = [
    [
        "path",
        {
            d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        },
    ],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
    ["path", { d: "M12 17.5v-11" }],
];
var tG = [
    ["path", { d: "M14 4v16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" }],
    ["circle", { cx: "14", cy: "12", r: "8" }],
];
var d0 = [
    ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }],
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M17 12h.01" }],
    ["path", { d: "M7 12h.01" }],
];
var UG = [
    [
        "path",
        {
            d: "M20 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-1.6-.8l-1.6-2.13a1 1 0 0 0-1.6 0L9.6 17.2A2 2 0 0 1 8 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z",
        },
    ],
];
var LG = [["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }]];
var RG = [["rect", { width: "12", height: "20", x: "6", y: "2", rx: "2" }]];
var lG = [
    [
        "path",
        {
            d: "M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5",
        },
    ],
    [
        "path",
        {
            d: "M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12",
        },
    ],
    ["path", { d: "m14 16-3 3 3 3" }],
    ["path", { d: "M8.293 13.596 7.196 9.5 3.1 10.598" }],
    [
        "path",
        {
            d: "m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843",
        },
    ],
    ["path", { d: "m13.378 9.633 4.096 1.098 1.097-4.096" }],
];
var jG = [
    ["path", { d: "m15 14 5-5-5-5" }],
    ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" }],
];
var mG = [
    ["circle", { cx: "12", cy: "17", r: "1" }],
    ["path", { d: "M21 7v6h-6" }],
    ["path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" }],
];
var gG = [
    ["path", { d: "M21 7v6h-6" }],
    ["path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" }],
];
var uG = [
    ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }],
    ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }],
    ["path", { d: "M16 16h5v5" }],
];
var cG = [
    ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }],
    ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }],
    ["path", { d: "M16 16h5v5" }],
    ["circle", { cx: "12", cy: "12", r: "1" }],
];
var nG = [
    [
        "path",
        {
            d: "M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47",
        },
    ],
    ["path", { d: "M8 16H3v5" }],
    ["path", { d: "M3 12C3 9.51 4 7.26 5.64 5.64" }],
    [
        "path",
        { d: "m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64" },
    ],
    ["path", { d: "M21 12c0 1-.16 1.97-.47 2.87" }],
    ["path", { d: "M21 3v5h-5" }],
    ["path", { d: "M22 22 2 2" }],
];
var iG = [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
    ["path", { d: "M21 3v5h-5" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
    ["path", { d: "M8 16H3v5" }],
];
var oG = [
    [
        "path",
        {
            d: "M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z",
        },
    ],
    ["path", { d: "M5 10h14" }],
    ["path", { d: "M15 7v6" }],
];
var rG = [
    ["path", { d: "M17 3v10" }],
    ["path", { d: "m12.67 5.5 8.66 5" }],
    ["path", { d: "m12.67 10.5 8.66-5" }],
    [
        "path",
        {
            d: "M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z",
        },
    ],
];
var eG = [
    ["path", { d: "M4 7V4h16v3" }],
    ["path", { d: "M5 20h6" }],
    ["path", { d: "M13 4 8 20" }],
    ["path", { d: "m15 15 5 5" }],
    ["path", { d: "m20 15-5 5" }],
];
var sG = [
    ["path", { d: "m17 2 4 4-4 4" }],
    ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14" }],
    ["path", { d: "m7 22-4-4 4-4" }],
    ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3" }],
    ["path", { d: "M11 10h1v4" }],
];
var pG = [
    ["path", { d: "m2 9 3-3 3 3" }],
    ["path", { d: "M13 18H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "m22 15-3 3-3-3" }],
    ["path", { d: "M11 6h6a2 2 0 0 1 2 2v10" }],
];
var aG = [
    ["path", { d: "m17 2 4 4-4 4" }],
    ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14" }],
    ["path", { d: "m7 22-4-4 4-4" }],
    ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3" }],
];
var IW = [
    ["path", { d: "M14 14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
    ["path", { d: "M14 4a2 2 0 0 1 2-2" }],
    ["path", { d: "M16 10a2 2 0 0 1-2-2" }],
    ["path", { d: "M20 14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
    ["path", { d: "M20 2a2 2 0 0 1 2 2" }],
    ["path", { d: "M22 8a2 2 0 0 1-2 2" }],
    ["path", { d: "m3 7 3 3 3-3" }],
    ["path", { d: "M6 10V5a 3 3 0 0 1 3-3h1" }],
    ["rect", { x: "2", y: "14", width: "8", height: "8", rx: "2" }],
];
var EW = [
    ["path", { d: "M14 4a2 2 0 0 1 2-2" }],
    ["path", { d: "M16 10a2 2 0 0 1-2-2" }],
    ["path", { d: "M20 2a2 2 0 0 1 2 2" }],
    ["path", { d: "M22 8a2 2 0 0 1-2 2" }],
    ["path", { d: "m3 7 3 3 3-3" }],
    ["path", { d: "M6 10V5a3 3 0 0 1 3-3h1" }],
    ["rect", { x: "2", y: "14", width: "8", height: "8", rx: "2" }],
];
var NW = [
    ["path", { d: "m12 17-5-5 5-5" }],
    ["path", { d: "M22 18v-2a4 4 0 0 0-4-4H7" }],
    ["path", { d: "m7 17-5-5 5-5" }],
];
var $W = [
    ["path", { d: "M20 18v-2a4 4 0 0 0-4-4H4" }],
    ["path", { d: "m9 17-5-5 5-5" }],
];
var _W = [
    [
        "path",
        {
            d: "M12 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 12 18z",
        },
    ],
    [
        "path",
        {
            d: "M22 6a2 2 0 0 0-3.414-1.414l-6 6a2 2 0 0 0 0 2.828l6 6A2 2 0 0 0 22 18z",
        },
    ],
];
var ZW = [
    [
        "path",
        {
            d: "M12 11.22C11 9.997 10 9 10 8a2 2 0 0 1 4 0c0 1-.998 2.002-2.01 3.22",
        },
    ],
    ["path", { d: "m12 18 2.57-3.5" }],
    ["path", { d: "M6.243 9.016a7 7 0 0 1 11.507-.009" }],
    ["path", { d: "M9.35 14.53 12 11.22" }],
    [
        "path",
        {
            d: "M9.35 14.53C7.728 12.246 6 10.221 6 7a6 5 0 0 1 12 0c-.005 3.22-1.778 5.235-3.43 7.5l3.557 4.527a1 1 0 0 1-.203 1.43l-1.894 1.36a1 1 0 0 1-1.384-.215L12 18l-2.679 3.593a1 1 0 0 1-1.39.213l-1.865-1.353a1 1 0 0 1-.203-1.422z",
        },
    ],
];
var YW = [
    [
        "path",
        {
            d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
        },
    ],
    [
        "path",
        {
            d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
        },
    ],
    ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }],
    ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }],
];
var QW = [
    ["polyline", { points: "3.5 2 6.5 12.5 18 12.5" }],
    ["line", { x1: "9.5", x2: "5.5", y1: "12.5", y2: "20" }],
    ["line", { x1: "15", x2: "18.5", y1: "12.5", y2: "20" }],
    ["path", { d: "M2.75 18a13 13 0 0 0 18.5 0" }],
];
var JW = [
    ["path", { d: "M6 19V5" }],
    ["path", { d: "M10 19V6.8" }],
    ["path", { d: "M14 19v-7.8" }],
    ["path", { d: "M18 5v4" }],
    ["path", { d: "M18 19v-6" }],
    ["path", { d: "M22 19V9" }],
    [
        "path",
        { d: "M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65" },
    ],
];
var KW = [
    ["path", { d: "M17 10h-1a4 4 0 1 1 4-4v.534" }],
    [
        "path",
        {
            d: "M17 6h1a4 4 0 0 1 1.42 7.74l-2.29.87a6 6 0 0 1-5.339-10.68l2.069-1.31",
        },
    ],
    [
        "path",
        {
            d: "M4.5 17c2.8-.5 4.4 0 5.5.8s1.8 2.2 2.3 3.7c-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2",
        },
    ],
    ["path", { d: "M9.77 12C4 15 2 22 2 22" }],
    ["circle", { cx: "17", cy: "8", r: "2" }],
];
var M0 = [
    [
        "path",
        {
            d: "M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2",
        },
    ],
    ["path", { d: "m15.194 13.707 3.814 1.86-1.86 3.814" }],
    [
        "path",
        {
            d: "M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4",
        },
    ],
];
var XW = [
    ["path", { d: "m14.5 9.5 1 1" }],
    ["path", { d: "m15.5 8.5-4 4" }],
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }],
    ["circle", { cx: "10", cy: "14", r: "2" }],
];
var VW = [
    ["path", { d: "M20 9V7a2 2 0 0 0-2-2h-6" }],
    ["path", { d: "m15 2-3 3 3 3" }],
    ["path", { d: "M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" }],
];
var GW = [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }],
];
var WW = [
    ["path", { d: "M12 5H6a2 2 0 0 0-2 2v3" }],
    ["path", { d: "m9 8 3-3-3-3" }],
    [
        "path",
        { d: "M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" },
    ],
];
var xW = [
    ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" }],
    ["path", { d: "M21 3v5h-5" }],
];
var HW = [
    ["circle", { cx: "6", cy: "19", r: "3" }],
    ["path", { d: "M9 19h8.5c.4 0 .9-.1 1.3-.2" }],
    ["path", { d: "M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M21 15.3a3.5 3.5 0 0 0-3.3-3.3" }],
    ["path", { d: "M15 5h-4.3" }],
    ["circle", { cx: "18", cy: "5", r: "3" }],
];
var zW = [
    ["circle", { cx: "6", cy: "19", r: "3" }],
    ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" }],
    ["circle", { cx: "18", cy: "5", r: "3" }],
];
var OW = [
    ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
    ["path", { d: "M6.01 18H6" }],
    ["path", { d: "M10.01 18H10" }],
    ["path", { d: "M15 10v4" }],
    ["path", { d: "M17.84 7.17a4 4 0 0 0-5.66 0" }],
    ["path", { d: "M20.66 4.34a8 8 0 0 0-11.31 0" }],
];
var t0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 12h18" }],
];
var U0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M21 9H3" }],
    ["path", { d: "M21 15H3" }],
];
var TW = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M21 7.5H3" }],
    ["path", { d: "M21 12H3" }],
    ["path", { d: "M21 16.5H3" }],
];
var DW = [
    ["path", { d: "M4 11a9 9 0 0 1 9 9" }],
    ["path", { d: "M4 4a16 16 0 0 1 16 16" }],
    ["circle", { cx: "5", cy: "19", r: "1" }],
];
var FW = [
    ["path", { d: "M12 15v-3.014" }],
    ["path", { d: "M16 15v-3.014" }],
    ["path", { d: "M20 6H4" }],
    ["path", { d: "M20 8V4" }],
    ["path", { d: "M4 8V4" }],
    ["path", { d: "M8 15v-3.014" }],
    ["rect", { x: "3", y: "12", width: "18", height: "7", rx: "1" }],
];
var AW = [
    ["path", { d: "M6 11h8a4 4 0 0 0 0-8H9v18" }],
    ["path", { d: "M6 15h8" }],
];
var BW = [
    [
        "path",
        {
            d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z",
        },
    ],
    ["path", { d: "m14.5 12.5 2-2" }],
    ["path", { d: "m11.5 9.5 2-2" }],
    ["path", { d: "m8.5 6.5 2-2" }],
    ["path", { d: "m17.5 15.5 2-2" }],
];
var SW = [
    ["path", { d: "M10 2v15" }],
    [
        "path",
        {
            d: "M7 22a4 4 0 0 1-4-4 1 1 0 0 1 1-1h16a1 1 0 0 1 1 1 4 4 0 0 1-4 4z",
        },
    ],
    [
        "path",
        {
            d: "M9.159 2.46a1 1 0 0 1 1.521-.193l9.977 8.98A1 1 0 0 1 20 13H4a1 1 0 0 1-.824-1.567z",
        },
    ],
];
var vW = [
    ["path", { d: "M7 21h10" }],
    ["path", { d: "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" }],
    [
        "path",
        {
            d: "M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1",
        },
    ],
    ["path", { d: "m13 12 4-4" }],
    ["path", { d: "M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2" }],
];
var yW = [
    ["path", { d: "M4 10a7.31 7.31 0 0 0 10 10Z" }],
    ["path", { d: "m9 15 3-3" }],
    ["path", { d: "M17 13a6 6 0 0 0-6-6" }],
    ["path", { d: "M21 13A10 10 0 0 0 11 3" }],
];
var PW = [
    ["path", { d: "m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777" }],
    ["path", { d: "M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25" }],
    ["path", { d: "M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9" }],
    ["path", { d: "m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" }],
    ["rect", { width: "20", height: "4", x: "2", y: "11", rx: "1" }],
];
var qW = [
    [
        "path",
        {
            d: "m13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5",
        },
    ],
    ["path", { d: "M16.5 7.5 19 5" }],
    [
        "path",
        {
            d: "m17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5",
        },
    ],
    ["path", { d: "M9 21a6 6 0 0 0-6-6" }],
    [
        "path",
        {
            d: "M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z",
        },
    ],
];
var CW = [
    ["path", { d: "m20 19.5-5.5 1.2" }],
    ["path", { d: "M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" }],
    ["path", { d: "m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" }],
    ["path", { d: "M20 10 4 13.5" }],
];
var hW = [
    ["path", { d: "M10 2v3a1 1 0 0 0 1 1h5" }],
    ["path", { d: "M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6" }],
    ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6" }],
    [
        "path",
        {
            d: "M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z",
        },
    ],
];
var bW = [
    ["path", { d: "M13 13H8a1 1 0 0 0-1 1v7" }],
    ["path", { d: "M14 8h1" }],
    ["path", { d: "M17 21v-4" }],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41",
        },
    ],
    ["path", { d: "M29.5 11.5s5 5 4 5" }],
    ["path", { d: "M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15" }],
];
var kW = [
    [
        "path",
        {
            d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        },
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7" }],
];
var L0 = [
    ["path", { d: "M5 7v11a1 1 0 0 0 1 1h11" }],
    ["path", { d: "M5.293 18.707 11 13" }],
    ["circle", { cx: "19", cy: "19", r: "2" }],
    ["circle", { cx: "5", cy: "5", r: "2" }],
];
var wW = [
    ["path", { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }],
    ["path", { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }],
    ["path", { d: "M7 21h10" }],
    ["path", { d: "M12 3v18" }],
    ["path", { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" }],
];
var fW = [
    [
        "path",
        { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" },
    ],
    ["path", { d: "M14 15H9v-5" }],
    ["path", { d: "M16 3h5v5" }],
    ["path", { d: "M21 3 9 15" }],
];
var dW = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["path", { d: "M8 7v10" }],
    ["path", { d: "M12 7v10" }],
    ["path", { d: "M17 7v10" }],
];
var MW = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["circle", { cx: "12", cy: "12", r: "1" }],
    [
        "path",
        {
            d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",
        },
    ],
];
var tW = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
    ["path", { d: "M9 9h.01" }],
    ["path", { d: "M15 9h.01" }],
];
var UW = [
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    [
        "path",
        {
            d: "M7.828 13.07A3 3 0 0 1 12 8.764a3 3 0 0 1 4.172 4.306l-3.447 3.62a1 1 0 0 1-1.449 0z",
        },
    ],
];
var LW = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["path", { d: "M7 12h10" }],
];
var RW = [
    ["path", { d: "M17 12v4a1 1 0 0 1-1 1h-4" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M17 8V7" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M7 17h.01" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["rect", { x: "7", y: "7", width: "5", height: "5", rx: "1" }],
];
var lW = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["path", { d: "M7 8h8" }],
    ["path", { d: "M7 12h10" }],
    ["path", { d: "M7 16h6" }],
];
var jW = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
    ["path", { d: "m16 16-1.9-1.9" }],
];
var mW = [
    ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
    ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
    ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
];
var gW = [
    ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }],
    ["path", { d: "M18 5v16" }],
    ["path", { d: "m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" }],
    [
        "path",
        {
            d: "m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11",
        },
    ],
    ["path", { d: "M6 5v16" }],
    ["circle", { cx: "12", cy: "9", r: "2" }],
];
var uW = [
    ["path", { d: "M5.42 9.42 8 12" }],
    ["circle", { cx: "4", cy: "8", r: "2" }],
    ["path", { d: "m14 6-8.58 8.58" }],
    ["circle", { cx: "4", cy: "16", r: "2" }],
    ["path", { d: "M10.8 14.8 14 18" }],
    ["path", { d: "M16 12h-2" }],
    ["path", { d: "M22 12h-2" }],
];
var cW = [
    ["circle", { cx: "6", cy: "6", r: "3" }],
    ["path", { d: "M8.12 8.12 12 12" }],
    ["path", { d: "M20 4 8.12 15.88" }],
    ["circle", { cx: "6", cy: "18", r: "3" }],
    ["path", { d: "M14.8 14.8 20 20" }],
];
var nW = [
    [
        "path",
        { d: "M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" },
    ],
    ["path", { d: "M8 21h8" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "m22 3-5 5" }],
    ["path", { d: "m17 3 5 5" }],
];
var iW = [
    [
        "path",
        { d: "M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" },
    ],
    ["path", { d: "M8 21h8" }],
    ["path", { d: "M12 17v4" }],
    ["path", { d: "m17 8 5-5" }],
    ["path", { d: "M17 3h5v5" }],
];
var oW = [
    ["path", { d: "M15 12h-5" }],
    ["path", { d: "M15 8h-5" }],
    ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }],
    [
        "path",
        {
            d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
        },
    ],
];
var rW = [
    ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }],
    [
        "path",
        {
            d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
        },
    ],
];
var eW = [
    ["path", { d: "m8 11 2 2 4-4" }],
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }],
];
var sW = [
    ["path", { d: "m13 13.5 2-2.5-2-2.5" }],
    ["path", { d: "m21 21-4.3-4.3" }],
    ["path", { d: "M9 8.5 7 11l2 2.5" }],
    ["circle", { cx: "11", cy: "11", r: "8" }],
];
var pW = [
    ["path", { d: "m13.5 8.5-5 5" }],
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }],
];
var aW = [
    ["path", { d: "m13.5 8.5-5 5" }],
    ["path", { d: "m8.5 8.5 5 5" }],
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }],
];
var Ix = [
    ["path", { d: "m21 21-4.34-4.34" }],
    ["circle", { cx: "11", cy: "11", r: "8" }],
];
var Ex = [
    ["path", { d: "M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0" }],
    ["path", { d: "M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0" }],
];
var R0 = [
    [
        "path",
        {
            d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z",
        },
    ],
    ["path", { d: "M6 12h16" }],
];
var Nx = [
    ["rect", { x: "14", y: "14", width: "8", height: "8", rx: "2" }],
    ["rect", { x: "2", y: "2", width: "8", height: "8", rx: "2" }],
    ["path", { d: "M7 14v1a2 2 0 0 0 2 2h1" }],
    ["path", { d: "M14 7h1a2 2 0 0 1 2 2v1" }],
];
var $x = [
    [
        "path",
        {
            d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
        },
    ],
    ["path", { d: "m21.854 2.147-10.94 10.939" }],
];
var _x = [
    ["path", { d: "m16 16-4 4-4-4" }],
    ["path", { d: "M3 12h18" }],
    ["path", { d: "m8 8 4-4 4 4" }],
];
var Zx = [
    ["path", { d: "M12 3v18" }],
    ["path", { d: "m16 16 4-4-4-4" }],
    ["path", { d: "m8 8-4 4 4 4" }],
];
var Yx = [
    ["path", { d: "m10.852 14.772-.383.923" }],
    ["path", { d: "M13.148 14.772a3 3 0 1 0-2.296-5.544l-.383-.923" }],
    ["path", { d: "m13.148 9.228.383-.923" }],
    ["path", { d: "m13.53 15.696-.382-.924a3 3 0 1 1-2.296-5.544" }],
    ["path", { d: "m14.772 10.852.923-.383" }],
    ["path", { d: "m14.772 13.148.923.383" }],
    [
        "path",
        {
            d: "M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5",
        },
    ],
    [
        "path",
        {
            d: "M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5",
        },
    ],
    ["path", { d: "M6 18h.01" }],
    ["path", { d: "M6 6h.01" }],
    ["path", { d: "m9.228 10.852-.923-.383" }],
    ["path", { d: "m9.228 13.148-.923.383" }],
];
var Qx = [
    [
        "path",
        {
            d: "M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2",
        },
    ],
    [
        "path",
        {
            d: "M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2",
        },
    ],
    ["path", { d: "M6 6h.01" }],
    ["path", { d: "M6 18h.01" }],
    ["path", { d: "m13 6-4 6h6l-4 6" }],
];
var Jx = [
    ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2" }],
    ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2" }],
    ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6" }],
    ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18" }],
];
var Kx = [
    ["path", { d: "M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" }],
    ["path", { d: "M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z" }],
    ["path", { d: "M22 17v-1a2 2 0 0 0-2-2h-1" }],
    ["path", { d: "M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z" }],
    ["path", { d: "M6 18h.01" }],
    ["path", { d: "m2 2 20 20" }],
];
var Xx = [
    ["path", { d: "M14 17H5" }],
    ["path", { d: "M19 7h-9" }],
    ["circle", { cx: "17", cy: "17", r: "3" }],
    ["circle", { cx: "7", cy: "7", r: "3" }],
];
var Vx = [
    [
        "path",
        {
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }],
];
var Gx = [
    [
        "path",
        {
            d: "M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",
        },
    ],
    ["rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }],
    ["circle", { cx: "17.5", cy: "17.5", r: "3.5" }],
];
var Wx = [
    ["circle", { cx: "18", cy: "5", r: "3" }],
    ["circle", { cx: "6", cy: "12", r: "3" }],
    ["circle", { cx: "18", cy: "19", r: "3" }],
    ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }],
    ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" }],
];
var xx = [
    ["path", { d: "M12 2v13" }],
    ["path", { d: "m16 6-4-4-4 4" }],
    ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }],
];
var Hx = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["line", { x1: "3", x2: "21", y1: "9", y2: "9" }],
    ["line", { x1: "3", x2: "21", y1: "15", y2: "15" }],
    ["line", { x1: "9", x2: "9", y1: "9", y2: "21" }],
    ["line", { x1: "15", x2: "15", y1: "9", y2: "21" }],
];
var zx = [
    [
        "path",
        {
            d: "M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44",
        },
    ],
];
var Ox = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M12 8v4" }],
    ["path", { d: "M12 16h.01" }],
];
var Tx = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "m4.243 5.21 14.39 12.472" }],
];
var Dx = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "m9 12 2 2 4-4" }],
];
var Fx = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M8 12h.01" }],
    ["path", { d: "M12 12h.01" }],
    ["path", { d: "M16 12h.01" }],
];
var Ax = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M12 22V2" }],
];
var Bx = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M9 12h6" }],
];
var Sx = [
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
        },
    ],
    [
        "path",
        {
            d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
        },
    ],
];
var vx = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M9 12h6" }],
    ["path", { d: "M12 9v6" }],
];
var yx = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M6.376 18.91a6 6 0 0 1 11.249.003" }],
    ["circle", { cx: "12", cy: "11", r: "4" }],
];
var l0 = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" }],
    ["path", { d: "M12 17h.01" }],
];
var j0 = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
    ["path", { d: "m14.5 9.5-5 5" }],
    ["path", { d: "m9.5 9.5 5 5" }],
];
var Px = [
    [
        "path",
        {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        },
    ],
];
var qx = [
    ["path", { d: "M12 10.189V14" }],
    ["path", { d: "M12 2v3" }],
    ["path", { d: "M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" }],
    [
        "path",
        {
            d: "M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76",
        },
    ],
    [
        "path",
        {
            d: "M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
    ],
];
var Cx = [
    [
        "path",
        {
            d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",
        },
    ],
];
var hx = [
    ["circle", { cx: "12", cy: "12", r: "8" }],
    ["path", { d: "M12 2v7.5" }],
    ["path", { d: "m19 5-5.23 5.23" }],
    ["path", { d: "M22 12h-7.5" }],
    ["path", { d: "m19 19-5.23-5.23" }],
    ["path", { d: "M12 14.5V22" }],
    ["path", { d: "M10.23 13.77 5 19" }],
    ["path", { d: "M9.5 12H2" }],
    ["path", { d: "M10.23 10.23 5 5" }],
    ["circle", { cx: "12", cy: "12", r: "2.5" }],
];
var bx = [
    ["path", { d: "M16 10a4 4 0 0 1-8 0" }],
    ["path", { d: "M3.103 6.034h17.794" }],
    [
        "path",
        {
            d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",
        },
    ],
];
var kx = [
    ["path", { d: "m15 11-1 9" }],
    ["path", { d: "m19 11-4-7" }],
    ["path", { d: "M2 11h20" }],
    [
        "path",
        { d: "m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" },
    ],
    ["path", { d: "M4.5 15.5h15" }],
    ["path", { d: "m5 11 4-7" }],
    ["path", { d: "m9 11 1 9" }],
];
var wx = [
    ["circle", { cx: "8", cy: "21", r: "1" }],
    ["circle", { cx: "19", cy: "21", r: "1" }],
    [
        "path",
        {
            d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",
        },
    ],
];
var fx = [
    [
        "path",
        {
            d: "M21.56 4.56a1.5 1.5 0 0 1 0 2.122l-.47.47a3 3 0 0 1-4.212-.03 3 3 0 0 1 0-4.243l.44-.44a1.5 1.5 0 0 1 2.121 0z",
        },
    ],
    [
        "path",
        {
            d: "M3 22a1 1 0 0 1-1-1v-3.586a1 1 0 0 1 .293-.707l3.355-3.355a1.205 1.205 0 0 1 1.704 0l3.296 3.296a1.205 1.205 0 0 1 0 1.704l-3.355 3.355a1 1 0 0 1-.707.293z",
        },
    ],
    ["path", { d: "m9 15 7.879-7.878" }],
];
var dx = [
    ["path", { d: "m4 4 2.5 2.5" }],
    ["path", { d: "M13.5 6.5a4.95 4.95 0 0 0-7 7" }],
    ["path", { d: "M15 5 5 15" }],
    ["path", { d: "M14 17v.01" }],
    ["path", { d: "M10 16v.01" }],
    ["path", { d: "M13 13v.01" }],
    ["path", { d: "M16 10v.01" }],
    ["path", { d: "M11 20v.01" }],
    ["path", { d: "M17 14v.01" }],
    ["path", { d: "M20 11v.01" }],
];
var Mx = [
    ["path", { d: "M10 22v-5" }],
    ["path", { d: "M14 19v-2" }],
    ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M18 20v-3" }],
    ["path", { d: "M2 13h20" }],
    ["path", { d: "M20 13V7l-5-5H6a2 2 0 0 0-2 2v9" }],
    ["path", { d: "M6 20v-3" }],
];
var tx = [
    ["path", { d: "M11 12h.01" }],
    ["path", { d: "M13 22c.5-.5 1.12-1 2.5-1-1.38 0-2-.5-2.5-1" }],
    [
        "path",
        {
            d: "M14 2a3.28 3.28 0 0 1-3.227 1.798l-6.17-.561A2.387 2.387 0 1 0 4.387 8H15.5a1 1 0 0 1 0 13 1 1 0 0 0 0-5H12a7 7 0 0 1-7-7V8",
        },
    ],
    ["path", { d: "M14 8a8.5 8.5 0 0 1 0 8" }],
    ["path", { d: "M16 16c2 0 4.5-4 4-6" }],
];
var Ux = [
    ["path", { d: "m15 15 6 6m-6-6v4.8m0-4.8h4.8" }],
    ["path", { d: "M9 19.8V15m0 0H4.2M9 15l-6 6" }],
    ["path", { d: "M15 4.2V9m0 0h4.8M15 9l6-6" }],
    ["path", { d: "M9 4.2V9m0 0H4.2M9 9 3 3" }],
];
var Lx = [
    [
        "path",
        {
            d: "M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2",
        },
    ],
];
var Rx = [
    ["path", { d: "M12 22v-5.172a2 2 0 0 0-.586-1.414L9.5 13.5" }],
    ["path", { d: "M14.5 14.5 12 17" }],
    [
        "path",
        { d: "M17 8.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0z" },
    ],
];
var lx = [
    ["path", { d: "m18 14 4 4-4 4" }],
    ["path", { d: "m18 2 4 4-4 4" }],
    [
        "path",
        { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" },
    ],
    ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2" }],
    ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" }],
];
var jx = [
    ["path", { d: "M2 20h.01" }],
    ["path", { d: "M7 20v-4" }],
    ["path", { d: "M12 20v-8" }],
    ["path", { d: "M17 20V8" }],
];
var mx = [
    ["path", { d: "M2 20h.01" }],
    ["path", { d: "M7 20v-4" }],
];
var gx = [
    ["path", { d: "M2 20h.01" }],
    ["path", { d: "M7 20v-4" }],
    ["path", { d: "M12 20v-8" }],
];
var ux = [["path", { d: "M2 20h.01" }]];
var cx = [
    ["path", { d: "M2 20h.01" }],
    ["path", { d: "M7 20v-4" }],
    ["path", { d: "M12 20v-8" }],
    ["path", { d: "M17 20V8" }],
    ["path", { d: "M22 4v16" }],
];
var nx = [
    [
        "path",
        {
            d: "m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284",
        },
    ],
    ["path", { d: "M3 21h18" }],
];
var ix = [
    ["path", { d: "M10 9H4L2 7l2-2h6" }],
    ["path", { d: "M14 5h6l2 2-2 2h-6" }],
    ["path", { d: "M10 22V4a2 2 0 1 1 4 0v18" }],
    ["path", { d: "M8 22h8" }],
];
var ox = [
    ["path", { d: "M12 13v8" }],
    ["path", { d: "M12 3v3" }],
    [
        "path",
        {
            d: "M18 6a2 2 0 0 1 1.387.56l2.307 2.22a1 1 0 0 1 0 1.44l-2.307 2.22A2 2 0 0 1 18 13H6a2 2 0 0 1-1.387-.56l-2.306-2.22a1 1 0 0 1 0-1.44l2.306-2.22A2 2 0 0 1 6 6z",
        },
    ],
];
var rx = [
    ["path", { d: "M7 18v-6a5 5 0 1 1 10 0v6" }],
    [
        "path",
        {
            d: "M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z",
        },
    ],
    ["path", { d: "M21 12h1" }],
    ["path", { d: "M18.5 4.5 18 5" }],
    ["path", { d: "M2 12h1" }],
    ["path", { d: "M12 2v1" }],
    ["path", { d: "m4.929 4.929.707.707" }],
    ["path", { d: "M12 12v6" }],
];
var ex = [
    [
        "path",
        {
            d: "M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
        },
    ],
    ["path", { d: "M3 20V4" }],
];
var sx = [
    ["path", { d: "M21 4v16" }],
    [
        "path",
        {
            d: "M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
        },
    ],
];
var px = [
    ["path", { d: "m12.5 17-.5-1-.5 1h1z" }],
    [
        "path",
        {
            d: "M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z",
        },
    ],
    ["circle", { cx: "15", cy: "12", r: "1" }],
    ["circle", { cx: "9", cy: "12", r: "1" }],
];
var ax = [
    ["rect", { width: "3", height: "8", x: "13", y: "2", rx: "1.5" }],
    ["path", { d: "M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" }],
    ["rect", { width: "3", height: "8", x: "8", y: "14", rx: "1.5" }],
    ["path", { d: "M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" }],
    ["rect", { width: "8", height: "3", x: "14", y: "13", rx: "1.5" }],
    ["path", { d: "M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" }],
    ["rect", { width: "8", height: "3", x: "2", y: "8", rx: "1.5" }],
    ["path", { d: "M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" }],
];
var IH = [["path", { d: "M22 2 2 22" }]];
var EH = [
    [
        "path",
        {
            d: "M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14",
        },
    ],
];
var NH = [
    ["path", { d: "M10 5H3" }],
    ["path", { d: "M12 19H3" }],
    ["path", { d: "M14 3v4" }],
    ["path", { d: "M16 17v4" }],
    ["path", { d: "M21 12h-9" }],
    ["path", { d: "M21 19h-5" }],
    ["path", { d: "M21 5h-7" }],
    ["path", { d: "M8 10v4" }],
    ["path", { d: "M8 12H3" }],
];
var m0 = [
    ["path", { d: "M10 8h4" }],
    ["path", { d: "M12 21v-9" }],
    ["path", { d: "M12 8V3" }],
    ["path", { d: "M17 16h4" }],
    ["path", { d: "M19 12V3" }],
    ["path", { d: "M19 21v-5" }],
    ["path", { d: "M3 14h4" }],
    ["path", { d: "M5 10V3" }],
    ["path", { d: "M5 21v-7" }],
];
var $H = [
    ["rect", { width: "7", height: "12", x: "2", y: "6", rx: "1" }],
    ["path", { d: "M13 8.32a7.43 7.43 0 0 1 0 7.36" }],
    ["path", { d: "M16.46 6.21a11.76 11.76 0 0 1 0 11.58" }],
    ["path", { d: "M19.91 4.1a15.91 15.91 0 0 1 .01 15.8" }],
];
var _H = [
    ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }],
    ["path", { d: "M12.667 8 10 12h4l-2.667 4" }],
];
var ZH = [
    ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }],
    ["path", { d: "M12 18h.01" }],
];
var YH = [
    ["path", { d: "M22 11v1a10 10 0 1 1-9-10" }],
    ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
    ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
    ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }],
    ["path", { d: "M16 5h6" }],
    ["path", { d: "M19 2v6" }],
];
var QH = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
    ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
    ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }],
];
var JH = [
    ["path", { d: "M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0" }],
    ["circle", { cx: "10", cy: "13", r: "8" }],
    ["path", { d: "M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6" }],
    ["path", { d: "M18 3 19.1 5.2" }],
    ["path", { d: "M22 3 20.9 5.2" }],
];
var KH = [
    ["path", { d: "m10 20-1.25-2.5L6 18" }],
    ["path", { d: "M10 4 8.75 6.5 6 6" }],
    ["path", { d: "m14 20 1.25-2.5L18 18" }],
    ["path", { d: "m14 4 1.25 2.5L18 6" }],
    ["path", { d: "m17 21-3-6h-4" }],
    ["path", { d: "m17 3-3 6 1.5 3" }],
    ["path", { d: "M2 12h6.5L10 9" }],
    ["path", { d: "m20 10-1.5 2 1.5 2" }],
    ["path", { d: "M22 12h-6.5L14 15" }],
    ["path", { d: "m4 10 1.5 2L4 14" }],
    ["path", { d: "m7 21 3-6-1.5-3" }],
    ["path", { d: "m7 3 3 6h4" }],
];
var XH = [
    ["path", { d: "M10.5 2v4" }],
    ["path", { d: "M14 2H7a2 2 0 0 0-2 2" }],
    [
        "path",
        {
            d: "M19.29 14.76A6.67 6.67 0 0 1 17 11a6.6 6.6 0 0 1-2.29 3.76c-1.15.92-1.71 2.04-1.71 3.19 0 2.22 1.8 4.05 4 4.05s4-1.83 4-4.05c0-1.16-.57-2.26-1.71-3.19",
        },
    ],
    [
        "path",
        {
            d: "M9.607 21H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3",
        },
    ],
];
var VH = [
    ["path", { d: "M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" }],
    [
        "path",
        {
            d: "M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z",
        },
    ],
    ["path", { d: "M4 18v2" }],
    ["path", { d: "M20 18v2" }],
    ["path", { d: "M12 4v9" }],
];
var GH = [
    ["path", { d: "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" }],
    ["path", { d: "M7 21h10" }],
    ["path", { d: "M19.5 12 22 6" }],
    [
        "path",
        {
            d: "M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62",
        },
    ],
    [
        "path",
        {
            d: "M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62",
        },
    ],
    [
        "path",
        {
            d: "M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62",
        },
    ],
];
var WH = [
    ["path", { d: "M12 18v4" }],
    [
        "path",
        {
            d: "M2 14.499a5.5 5.5 0 0 0 9.591 3.675.6.6 0 0 1 .818.001A5.5 5.5 0 0 0 22 14.5c0-2.29-1.5-4-3-5.5l-5.492-5.312a2 2 0 0 0-3-.02L5 8.999c-1.5 1.5-3 3.2-3 5.5",
        },
    ],
];
var xH = [
    [
        "path",
        {
            d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        },
    ],
];
var HH = [["path", { d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" }]];
var g0 = [
    [
        "path",
        {
            d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        },
    ],
    ["path", { d: "M20 2v4" }],
    ["path", { d: "M22 4h-4" }],
    ["circle", { cx: "4", cy: "20", r: "2" }],
];
var zH = [
    ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
    ["path", { d: "M12 6h.01" }],
    ["circle", { cx: "12", cy: "14", r: "4" }],
    ["path", { d: "M12 14h.01" }],
];
var OH = [
    [
        "path",
        {
            d: "M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20",
        },
    ],
    ["path", { d: "M19.8 17.8a7.5 7.5 0 0 0 .003-10.603" }],
    ["path", { d: "M17 15a3.5 3.5 0 0 0-.025-4.975" }],
];
var TH = [
    ["path", { d: "m6 16 6-12 6 12" }],
    ["path", { d: "M8 12h8" }],
    [
        "path",
        {
            d: "M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1",
        },
    ],
];
var DH = [
    ["path", { d: "m6 16 6-12 6 12" }],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "m16 20 2 2 4-4" }],
];
var FH = [
    [
        "path",
        {
            d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
        },
    ],
    ["path", { d: "M5 17A12 12 0 0 1 17 5" }],
    ["circle", { cx: "19", cy: "5", r: "2" }],
    ["circle", { cx: "5", cy: "19", r: "2" }],
];
var AH = [
    ["circle", { cx: "19", cy: "5", r: "2" }],
    ["circle", { cx: "5", cy: "19", r: "2" }],
    ["path", { d: "M5 17A12 12 0 0 1 17 5" }],
];
var BH = [
    ["path", { d: "M16 3h5v5" }],
    ["path", { d: "M8 3H3v5" }],
    ["path", { d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" }],
    ["path", { d: "m15 9 6-6" }],
];
var SH = [
    [
        "path",
        {
            d: "M17 13.44 4.442 17.082A2 2 0 0 0 4.982 21H19a2 2 0 0 0 .558-3.921l-1.115-.32A2 2 0 0 1 17 14.837V7.66",
        },
    ],
    [
        "path",
        {
            d: "m7 10.56 12.558-3.642A2 2 0 0 0 19.018 3H5a2 2 0 0 0-.558 3.921l1.115.32A2 2 0 0 1 7 9.163v7.178",
        },
    ],
];
var vH = [
    ["path", { d: "M15.295 19.562 16 22" }],
    ["path", { d: "m17 16 3.758 2.098" }],
    ["path", { d: "m19 12.5 3.026-.598" }],
    [
        "path",
        {
            d: "M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z",
        },
    ],
    ["path", { d: "M8 9V2" }],
];
var yH = [
    ["path", { d: "M3 3h.01" }],
    ["path", { d: "M7 5h.01" }],
    ["path", { d: "M11 7h.01" }],
    ["path", { d: "M3 7h.01" }],
    ["path", { d: "M7 9h.01" }],
    ["path", { d: "M3 11h.01" }],
    ["rect", { width: "4", height: "4", x: "15", y: "5" }],
    ["path", { d: "m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" }],
    ["path", { d: "m13 14 8-2" }],
    ["path", { d: "m13 19 8-2" }],
];
var PH = [
    [
        "path",
        {
            d: "M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3",
        },
    ],
    ["path", { d: "M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4" }],
    ["path", { d: "M5 21h14" }],
];
var u0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M17 12h-2l-2 5-2-10-2 5H7" }],
];
var c0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m16 8-8 8" }],
    ["path", { d: "M16 16H8V8" }],
];
var n0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m8 8 8 8" }],
    ["path", { d: "M16 8v8H8" }],
];
var i0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M12 8v8" }],
    ["path", { d: "m8 12 4 4 4-4" }],
];
var o0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m12 8-4 4 4 4" }],
    ["path", { d: "M16 12H8" }],
];
var r0 = [
    ["path", { d: "M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6" }],
    ["path", { d: "m3 21 9-9" }],
    ["path", { d: "M9 21H3v-6" }],
];
var e0 = [
    [
        "path",
        { d: "M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" },
    ],
    ["path", { d: "m3 3 9 9" }],
    ["path", { d: "M3 9V3h6" }],
];
var s0 = [
    [
        "path",
        { d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" },
    ],
    ["path", { d: "m21 21-9-9" }],
    ["path", { d: "M21 15v6h-6" }],
];
var p0 = [
    ["path", { d: "M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" }],
    ["path", { d: "m21 3-9 9" }],
    ["path", { d: "M15 3h6v6" }],
];
var a0 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "m12 16 4-4-4-4" }],
];
var I2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M8 16V8h8" }],
    ["path", { d: "M16 16 8 8" }],
];
var E2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M8 8h8v8" }],
    ["path", { d: "m8 16 8-8" }],
];
var N2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m16 12-4-4-4 4" }],
    ["path", { d: "M12 16V8" }],
];
var $2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M12 8v8" }],
    ["path", { d: "m8.5 14 7-4" }],
    ["path", { d: "m8.5 10 7 4" }],
];
var _2 = [
    [
        "path",
        {
            d: "M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2",
        },
    ],
    ["path", { d: "M10 22H8" }],
    ["path", { d: "M16 22h-2" }],
    ["circle", { cx: "8", cy: "8", r: "2" }],
    ["path", { d: "M9.414 9.414 12 12" }],
    ["path", { d: "M14.8 14.8 18 18" }],
    ["circle", { cx: "8", cy: "16", r: "2" }],
    ["path", { d: "m18 6-8.586 8.586" }],
];
var x = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 8h7" }],
    ["path", { d: "M8 12h6" }],
    ["path", { d: "M11 16h5" }],
];
var Z2 = [
    [
        "path",
        {
            d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344",
        },
    ],
    ["path", { d: "m9 11 3 3L22 4" }],
];
var Y2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m9 12 2 2 4-4" }],
];
var Q2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m16 10-4 4-4-4" }],
];
var J2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m14 16-4-4 4-4" }],
];
var K2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m10 8 4 4-4 4" }],
];
var X2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m8 14 4-4 4 4" }],
];
var V2 = [
    ["path", { d: "m10 9-3 3 3 3" }],
    ["path", { d: "m14 15 3-3-3-3" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var qH = [
    ["path", { d: "M10 9.5 8 12l2 2.5" }],
    ["path", { d: "M14 21h1" }],
    ["path", { d: "m14 9.5 2 2.5-2 2.5" }],
    [
        "path",
        {
            d: "M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",
        },
    ],
    ["path", { d: "M9 21h1" }],
];
var CH = [
    [
        "path",
        {
            d: "M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2",
        },
    ],
    ["path", { d: "M9 21h1" }],
    ["path", { d: "M14 21h1" }],
];
var G2 = [
    ["path", { d: "M8 7v7" }],
    ["path", { d: "M12 7v4" }],
    ["path", { d: "M16 7v9" }],
    ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
    ["path", { d: "M9 3h1" }],
    ["path", { d: "M14 3h1" }],
    ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
    ["path", { d: "M21 9v1" }],
    ["path", { d: "M21 14v1" }],
    ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
    ["path", { d: "M14 21h1" }],
    ["path", { d: "M9 21h1" }],
    ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
    ["path", { d: "M3 14v1" }],
    ["path", { d: "M3 9v1" }],
];
var W2 = [
    [
        "path",
        {
            d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
        },
    ],
    ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
    ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
    ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
    ["path", { d: "M9 3h1" }],
    ["path", { d: "M9 21h2" }],
    ["path", { d: "M14 3h1" }],
    ["path", { d: "M3 9v1" }],
    ["path", { d: "M21 9v2" }],
    ["path", { d: "M3 14v1" }],
];
var hH = [
    ["path", { d: "M14 21h1" }],
    ["path", { d: "M21 14v1" }],
    ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
    ["path", { d: "M21 9v1" }],
    ["path", { d: "M3 14v1" }],
    ["path", { d: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" }],
    ["path", { d: "M3 9v1" }],
    ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
    ["path", { d: "M9 21h1" }],
];
var x2 = [
    ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
    ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
    ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
    ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
    ["path", { d: "M9 3h1" }],
    ["path", { d: "M9 21h1" }],
    ["path", { d: "M14 3h1" }],
    ["path", { d: "M14 21h1" }],
    ["path", { d: "M3 9v1" }],
    ["path", { d: "M21 9v1" }],
    ["path", { d: "M3 14v1" }],
    ["path", { d: "M21 14v1" }],
];
var H2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["circle", { cx: "12", cy: "12", r: "1" }],
];
var z2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
    ["line", { x1: "12", x2: "12", y1: "16", y2: "16" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "8" }],
];
var O2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7 10h10" }],
    ["path", { d: "M7 14h10" }],
];
var T2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" }],
    ["path", { d: "M9 11.2h5.7" }],
];
var D2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M8 7v7" }],
    ["path", { d: "M12 7v4" }],
    ["path", { d: "M16 7v9" }],
];
var F2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7 7v10" }],
    ["path", { d: "M11 7v10" }],
    ["path", { d: "m15 7 2 10" }],
];
var A2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M8 16V8l4 4 4-4v8" }],
];
var B2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7 8h10" }],
    ["path", { d: "M7 12h10" }],
    ["path", { d: "M7 16h10" }],
];
var S2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M8 12h8" }],
];
var v2 = [
    [
        "path",
        {
            d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z",
        },
    ],
    [
        "path",
        { d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" },
    ],
];
var y2 = [
    [
        "path",
        { d: "M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41" },
    ],
    ["path", { d: "M3 8.7V19a2 2 0 0 0 2 2h10.3" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M13 13a3 3 0 1 0 0-6H9v2" }],
    ["path", { d: "M9 17v-2.3" }],
];
var P2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 17V7h4a3 3 0 0 1 0 6H9" }],
];
var bH = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["line", { x1: "10", x2: "10", y1: "15", y2: "9" }],
    ["line", { x1: "14", x2: "14", y1: "15", y2: "9" }],
];
var Y = [
    [
        "path",
        { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" },
    ],
    [
        "path",
        {
            d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
        },
    ],
];
var q2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "M9 9h.01" }],
    ["path", { d: "M15 15h.01" }],
];
var C2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7 7h10" }],
    ["path", { d: "M10 7v10" }],
    ["path", { d: "M16 17a2 2 0 0 1-2-2V7" }],
];
var h2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M12 12H9.5a2.5 2.5 0 0 1 0-5H17" }],
    ["path", { d: "M12 7v10" }],
    ["path", { d: "M16 7v10" }],
];
var b2 = [
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
    [
        "path",
        {
            d: "M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",
        },
    ],
];
var k2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M8 12h8" }],
    ["path", { d: "M12 8v8" }],
];
var w2 = [
    ["path", { d: "M12 7v4" }],
    ["path", { d: "M7.998 9.003a5 5 0 1 0 8-.005" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var kH = [
    ["path", { d: "M7 12h2l2 5 2-10h4" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var f2 = [
    ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "2" }],
    ["circle", { cx: "8", cy: "8", r: "2" }],
    ["path", { d: "M9.414 9.414 12 12" }],
    ["path", { d: "M14.8 14.8 18 18" }],
    ["circle", { cx: "8", cy: "16", r: "2" }],
    ["path", { d: "m18 6-8.586 8.586" }],
];
var wH = [
    ["path", { d: "M21 11a8 8 0 0 0-8-8" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }],
];
var d2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M16 8.9V7H8l4 5-4 5h8v-1.9" }],
];
var M2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["line", { x1: "9", x2: "15", y1: "15", y2: "9" }],
];
var t2 = [
    ["path", { d: "M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3" }],
    ["path", { d: "M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3" }],
    ["line", { x1: "12", x2: "12", y1: "4", y2: "20" }],
];
var U2 = [
    ["path", { d: "M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" }],
    ["path", { d: "M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" }],
    ["line", { x1: "4", x2: "20", y1: "12", y2: "12" }],
];
var fH = [
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
    ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1" }],
];
var dH = [
    [
        "path",
        {
            d: "M11.035 7.69a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z",
        },
    ],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
];
var MH = [
    ["path", { d: "M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" }],
    ["path", { d: "M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" }],
    ["rect", { width: "8", height: "8", x: "14", y: "14", rx: "2" }],
];
var tH = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" }],
];
var L2 = [
    ["path", { d: "m7 11 2-2-2-2" }],
    ["path", { d: "M11 13h4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
];
var R2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["circle", { cx: "12", cy: "10", r: "3" }],
    ["path", { d: "M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" }],
];
var l2 = [
    ["path", { d: "M18 21a6 6 0 0 0-12 0" }],
    ["circle", { cx: "12", cy: "11", r: "4" }],
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
];
var j2 = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "m9 9 6 6" }],
];
var UH = [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }]];
var LH = [
    [
        "path",
        {
            d: "M16 12v2a2 2 0 0 1-2 2H9a1 1 0 0 0-1 1v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h0",
        },
    ],
    [
        "path",
        {
            d: "M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-5a2 2 0 0 0-2 2v2",
        },
    ],
];
var RH = [
    ["path", { d: "M10 22a2 2 0 0 1-2-2" }],
    ["path", { d: "M14 2a2 2 0 0 1 2 2" }],
    ["path", { d: "M16 22h-2" }],
    ["path", { d: "M2 10V8" }],
    ["path", { d: "M2 4a2 2 0 0 1 2-2" }],
    ["path", { d: "M20 8a2 2 0 0 1 2 2" }],
    ["path", { d: "M22 14v2" }],
    ["path", { d: "M22 20a2 2 0 0 1-2 2" }],
    ["path", { d: "M4 16a2 2 0 0 1-2-2" }],
    [
        "path",
        {
            d: "M8 10a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H9a1 1 0 0 1-1-1z",
        },
    ],
    ["path", { d: "M8 2h2" }],
];
var lH = [
    ["path", { d: "M10 22a2 2 0 0 1-2-2" }],
    ["path", { d: "M16 22h-2" }],
    [
        "path",
        {
            d: "M16 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-5a2 2 0 0 1 2-2h5a1 1 0 0 0 1-1z",
        },
    ],
    ["path", { d: "M20 8a2 2 0 0 1 2 2" }],
    ["path", { d: "M22 14v2" }],
    ["path", { d: "M22 20a2 2 0 0 1-2 2" }],
];
var jH = [
    [
        "path",
        {
            d: "M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3a1 1 0 0 0-1-1z",
        },
    ],
];
var mH = [
    ["path", { d: "M13.77 3.043a34 34 0 0 0-3.54 0" }],
    ["path", { d: "M13.771 20.956a33 33 0 0 1-3.541.001" }],
    ["path", { d: "M20.18 17.74c-.51 1.15-1.29 1.93-2.439 2.44" }],
    ["path", { d: "M20.18 6.259c-.51-1.148-1.291-1.929-2.44-2.438" }],
    ["path", { d: "M20.957 10.23a33 33 0 0 1 0 3.54" }],
    ["path", { d: "M3.043 10.23a34 34 0 0 0 .001 3.541" }],
    ["path", { d: "M6.26 20.179c-1.15-.508-1.93-1.29-2.44-2.438" }],
    ["path", { d: "M6.26 3.82c-1.149.51-1.93 1.291-2.44 2.44" }],
];
var gH = [
    ["path", { d: "M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" }],
];
var uH = [
    ["path", { d: "M15.236 22a3 3 0 0 0-2.2-5" }],
    ["path", { d: "M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4" }],
    ["path", { d: "M18 13h.01" }],
    [
        "path",
        {
            d: "M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10",
        },
    ],
];
var cH = [
    ["path", { d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13" }],
    [
        "path",
        {
            d: "M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z",
        },
    ],
    ["path", { d: "M5 22h14" }],
];
var nH = [
    [
        "path",
        {
            d: "M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2",
        },
    ],
];
var iH = [
    [
        "path",
        { d: "M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43" },
    ],
    ["path", { d: "M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var oH = [
    [
        "path",
        {
            d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
        },
    ],
];
var rH = [
    [
        "path",
        {
            d: "M13.971 4.285A2 2 0 0 1 17 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z",
        },
    ],
    ["path", { d: "M21 20V4" }],
];
var eH = [
    [
        "path",
        {
            d: "M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z",
        },
    ],
    ["path", { d: "M3 4v16" }],
];
var sH = [
    ["path", { d: "M11 2v2" }],
    ["path", { d: "M5 2v2" }],
    ["path", { d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" }],
    ["path", { d: "M8 15a6 6 0 0 0 12 0v-3" }],
    ["circle", { cx: "20", cy: "10", r: "2" }],
];
var pH = [
    [
        "path",
        {
            d: "M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z",
        },
    ],
    ["path", { d: "M14 3v4a2 2 0 0 0 2 2h4" }],
    ["path", { d: "M8 13h.01" }],
    ["path", { d: "M16 13h.01" }],
    ["path", { d: "M10 16s.8 1 2 1c1.3 0 2-1 2-1" }],
];
var aH = [
    ["path", { d: "M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5" }],
    [
        "path",
        {
            d: "M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",
        },
    ],
    ["path", { d: "M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05" }],
];
var Iz = [
    [
        "path",
        { d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" },
    ],
    ["path", { d: "M15 3v4a2 2 0 0 0 2 2h4" }],
];
var Ez = [
    ["rect", { width: "20", height: "6", x: "2", y: "4", rx: "2" }],
    ["rect", { width: "20", height: "6", x: "2", y: "14", rx: "2" }],
];
var Nz = [
    ["rect", { width: "6", height: "20", x: "4", y: "2", rx: "2" }],
    ["rect", { width: "6", height: "20", x: "14", y: "2", rx: "2" }],
];
var $z = [
    ["path", { d: "M16 4H9a3 3 0 0 0-2.83 4" }],
    ["path", { d: "M14 12a4 4 0 0 1 0 8H6" }],
    ["line", { x1: "4", x2: "20", y1: "12", y2: "12" }],
];
var _z = [
    ["path", { d: "m4 5 8 8" }],
    ["path", { d: "m12 5-8 8" }],
    [
        "path",
        {
            d: "M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07",
        },
    ],
];
var Zz = [
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["path", { d: "M12 3v1" }],
    ["path", { d: "M12 20v1" }],
    ["path", { d: "M3 12h1" }],
    ["path", { d: "M20 12h1" }],
    ["path", { d: "m18.364 5.636-.707.707" }],
    ["path", { d: "m6.343 17.657-.707.707" }],
    ["path", { d: "m5.636 5.636.707.707" }],
    ["path", { d: "m17.657 17.657.707.707" }],
];
var Yz = [
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["path", { d: "M12 4h.01" }],
    ["path", { d: "M20 12h.01" }],
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M4 12h.01" }],
    ["path", { d: "M17.657 6.343h.01" }],
    ["path", { d: "M17.657 17.657h.01" }],
    ["path", { d: "M6.343 17.657h.01" }],
    ["path", { d: "M6.343 6.343h.01" }],
];
var Qz = [
    ["path", { d: "M10 21v-1" }],
    ["path", { d: "M10 4V3" }],
    ["path", { d: "M10 9a3 3 0 0 0 0 6" }],
    ["path", { d: "m14 20 1.25-2.5L18 18" }],
    ["path", { d: "m14 4 1.25 2.5L18 6" }],
    ["path", { d: "m17 21-3-6 1.5-3H22" }],
    ["path", { d: "m17 3-3 6 1.5 3" }],
    ["path", { d: "M2 12h1" }],
    ["path", { d: "m20 10-1.5 2 1.5 2" }],
    ["path", { d: "m3.64 18.36.7-.7" }],
    ["path", { d: "m4.34 6.34-.7-.7" }],
];
var Jz = [
    ["path", { d: "M12 2v2" }],
    [
        "path",
        {
            d: "M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715",
        },
    ],
    ["path", { d: "M16 12a4 4 0 0 0-4-4" }],
    ["path", { d: "m19 5-1.256 1.256" }],
    ["path", { d: "M20 12h2" }],
];
var Kz = [
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M12 20v2" }],
    ["path", { d: "m4.93 4.93 1.41 1.41" }],
    ["path", { d: "m17.66 17.66 1.41 1.41" }],
    ["path", { d: "M2 12h2" }],
    ["path", { d: "M20 12h2" }],
    ["path", { d: "m6.34 17.66-1.41 1.41" }],
    ["path", { d: "m19.07 4.93-1.41 1.41" }],
];
var Xz = [
    ["path", { d: "M12 2v8" }],
    ["path", { d: "m4.93 10.93 1.41 1.41" }],
    ["path", { d: "M2 18h2" }],
    ["path", { d: "M20 18h2" }],
    ["path", { d: "m19.07 10.93-1.41 1.41" }],
    ["path", { d: "M22 22H2" }],
    ["path", { d: "m8 6 4-4 4 4" }],
    ["path", { d: "M16 18a4 4 0 0 0-8 0" }],
];
var Vz = [
    ["path", { d: "m4 19 8-8" }],
    ["path", { d: "m12 19-8-8" }],
    [
        "path",
        {
            d: "M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06",
        },
    ],
];
var Gz = [
    ["path", { d: "M12 10V2" }],
    ["path", { d: "m4.93 10.93 1.41 1.41" }],
    ["path", { d: "M2 18h2" }],
    ["path", { d: "M20 18h2" }],
    ["path", { d: "m19.07 10.93-1.41 1.41" }],
    ["path", { d: "M22 22H2" }],
    ["path", { d: "m16 6-4 4-4-4" }],
    ["path", { d: "M16 18a4 4 0 0 0-8 0" }],
];
var Wz = [
    ["path", { d: "M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" }],
    ["path", { d: "M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" }],
    ["path", { d: "M 7 17h.01" }],
    [
        "path",
        {
            d: "m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8",
        },
    ],
];
var xz = [
    ["path", { d: "M10 21V3h8" }],
    ["path", { d: "M6 16h9" }],
    ["path", { d: "M10 9.5h7" }],
];
var Hz = [
    ["path", { d: "M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" }],
    ["path", { d: "M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
    ["path", { d: "m18 22-3-3 3-3" }],
    ["path", { d: "m6 2 3 3-3 3" }],
];
var zz = [
    ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5" }],
    ["line", { x1: "13", x2: "19", y1: "19", y2: "13" }],
    ["line", { x1: "16", x2: "20", y1: "16", y2: "20" }],
    ["line", { x1: "19", x2: "21", y1: "21", y2: "19" }],
];
var Oz = [
    ["path", { d: "m18 2 4 4" }],
    ["path", { d: "m17 7 3-3" }],
    [
        "path",
        { d: "M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" },
    ],
    ["path", { d: "m9 11 4 4" }],
    ["path", { d: "m5 19-3 3" }],
    ["path", { d: "m14 4 6 6" }],
];
var Tz = [
    ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5" }],
    ["line", { x1: "13", x2: "19", y1: "19", y2: "13" }],
    ["line", { x1: "16", x2: "20", y1: "16", y2: "20" }],
    ["line", { x1: "19", x2: "21", y1: "21", y2: "19" }],
    ["polyline", { points: "14.5 6.5 18 3 21 3 21 6 17.5 9.5" }],
    ["line", { x1: "5", x2: "9", y1: "14", y2: "18" }],
    ["line", { x1: "7", x2: "4", y1: "17", y2: "20" }],
    ["line", { x1: "3", x2: "5", y1: "19", y2: "21" }],
];
var Dz = [
    [
        "path",
        {
            d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
        },
    ],
];
var Fz = [
    ["path", { d: "M12 21v-6" }],
    ["path", { d: "M12 9V3" }],
    ["path", { d: "M3 15h18" }],
    ["path", { d: "M3 9h18" }],
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
];
var Az = [
    ["path", { d: "M12 15V9" }],
    ["path", { d: "M3 15h18" }],
    ["path", { d: "M3 9h18" }],
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
];
var Bz = [
    ["path", { d: "M14 14v2" }],
    ["path", { d: "M14 20v2" }],
    ["path", { d: "M14 2v2" }],
    ["path", { d: "M14 8v2" }],
    ["path", { d: "M2 15h8" }],
    ["path", { d: "M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2" }],
    ["path", { d: "M2 9h8" }],
    ["path", { d: "M22 15h-4" }],
    ["path", { d: "M22 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" }],
    ["path", { d: "M22 9h-4" }],
    ["path", { d: "M5 3v18" }],
];
var Sz = [
    ["path", { d: "M15 3v18" }],
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M21 9H3" }],
    ["path", { d: "M21 15H3" }],
];
var vz = [
    ["path", { d: "M16 5H3" }],
    ["path", { d: "M16 12H3" }],
    ["path", { d: "M16 19H3" }],
    ["path", { d: "M21 5h.01" }],
    ["path", { d: "M21 12h.01" }],
    ["path", { d: "M21 19h.01" }],
];
var yz = [
    ["path", { d: "M14 10h2" }],
    ["path", { d: "M15 22v-8" }],
    ["path", { d: "M15 2v4" }],
    ["path", { d: "M2 10h2" }],
    ["path", { d: "M20 10h2" }],
    ["path", { d: "M3 19h18" }],
    ["path", { d: "M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6" }],
    ["path", { d: "M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2" }],
    ["path", { d: "M8 10h2" }],
    ["path", { d: "M9 22v-8" }],
    ["path", { d: "M9 2v4" }],
];
var Pz = [
    ["path", { d: "M12 3v18" }],
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "M3 15h18" }],
];
var qz = [
    ["rect", { width: "10", height: "14", x: "3", y: "8", rx: "2" }],
    [
        "path",
        { d: "M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" },
    ],
    ["path", { d: "M8 18h.01" }],
];
var Cz = [
    ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", ry: "2" }],
    ["line", { x1: "12", x2: "12.01", y1: "18", y2: "18" }],
];
var hz = [
    ["circle", { cx: "7", cy: "7", r: "5" }],
    ["circle", { cx: "17", cy: "17", r: "5" }],
    ["path", { d: "M12 17h10" }],
    ["path", { d: "m3.46 10.54 7.08-7.08" }],
];
var bz = [
    [
        "path",
        {
            d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
        },
    ],
    ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }],
];
var kz = [
    [
        "path",
        {
            d: "M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z",
        },
    ],
    [
        "path",
        {
            d: "M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193",
        },
    ],
    ["circle", { cx: "10.5", cy: "6.5", r: ".5", fill: "currentColor" }],
];
var wz = [["path", { d: "M4 4v16" }]];
var fz = [
    ["path", { d: "M4 4v16" }],
    ["path", { d: "M9 4v16" }],
];
var dz = [
    ["path", { d: "M4 4v16" }],
    ["path", { d: "M9 4v16" }],
    ["path", { d: "M14 4v16" }],
];
var Mz = [
    ["path", { d: "M4 4v16" }],
    ["path", { d: "M9 4v16" }],
    ["path", { d: "M14 4v16" }],
    ["path", { d: "M19 4v16" }],
];
var tz = [
    ["path", { d: "M4 4v16" }],
    ["path", { d: "M9 4v16" }],
    ["path", { d: "M14 4v16" }],
    ["path", { d: "M19 4v16" }],
    ["path", { d: "M22 6 2 18" }],
];
var Uz = [
    ["circle", { cx: "17", cy: "4", r: "2" }],
    ["path", { d: "M15.59 5.41 5.41 15.59" }],
    ["circle", { cx: "4", cy: "17", r: "2" }],
    ["path", { d: "M12 22s-4-9-1.5-11.5S22 12 22 12" }],
];
var Lz = [
    [
        "path",
        {
            d: "m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44",
        },
    ],
    ["path", { d: "m13.56 11.747 4.332-.924" }],
    ["path", { d: "m16 21-3.105-6.21" }],
    [
        "path",
        {
            d: "M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z",
        },
    ],
    ["path", { d: "m6.158 8.633 1.114 4.456" }],
    ["path", { d: "m8 21 3.105-6.21" }],
    ["circle", { cx: "12", cy: "13", r: "2" }],
];
var Rz = [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["circle", { cx: "12", cy: "12", r: "6" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var lz = [
    ["path", { d: "M3.5 21 14 3" }],
    ["path", { d: "M20.5 21 10 3" }],
    ["path", { d: "M15.5 21 12 15l-3.5 6" }],
    ["path", { d: "M2 21h20" }],
];
var jz = [
    ["circle", { cx: "4", cy: "4", r: "2" }],
    ["path", { d: "m14 5 3-3 3 3" }],
    ["path", { d: "m14 10 3-3 3 3" }],
    ["path", { d: "M17 14V2" }],
    ["path", { d: "M17 14H7l-5 8h20Z" }],
    ["path", { d: "M8 14v8" }],
    ["path", { d: "m9 14 5 8" }],
];
var m2 = [
    [
        "path",
        {
            d: "M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3",
        },
    ],
    ["path", { d: "m16 2 6 6" }],
    ["path", { d: "M12 16H4" }],
];
var mz = [
    ["path", { d: "M12 19h8" }],
    ["path", { d: "m4 17 6-6-6-6" }],
];
var gz = [
    [
        "path",
        { d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2" },
    ],
    ["path", { d: "M8.5 2h7" }],
    ["path", { d: "M14.5 16h-5" }],
];
var uz = [
    ["path", { d: "M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2" }],
    ["path", { d: "M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2" }],
    ["path", { d: "M3 2h7" }],
    ["path", { d: "M14 2h7" }],
    ["path", { d: "M9 16H4" }],
    ["path", { d: "M20 16h-5" }],
];
var g2 = [
    ["path", { d: "M21 5H3" }],
    ["path", { d: "M17 12H7" }],
    ["path", { d: "M19 19H5" }],
];
var u2 = [
    ["path", { d: "M21 5H3" }],
    ["path", { d: "M21 12H9" }],
    ["path", { d: "M21 19H7" }],
];
var c2 = [
    ["path", { d: "M3 5h18" }],
    ["path", { d: "M3 12h18" }],
    ["path", { d: "M3 19h18" }],
];
var H = [
    ["path", { d: "M21 5H3" }],
    ["path", { d: "M15 12H3" }],
    ["path", { d: "M17 19H3" }],
];
var cz = [
    ["path", { d: "M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6" }],
    ["path", { d: "M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" }],
    ["path", { d: "M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" }],
    ["path", { d: "M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1" }],
    ["path", { d: "M9 6v12" }],
];
var nz = [
    ["path", { d: "M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1" }],
    ["path", { d: "M7 22h1a4 4 0 0 0 4-4v-1" }],
    ["path", { d: "M7 2h1a4 4 0 0 1 4 4v1" }],
];
var n2 = [
    ["path", { d: "M15 5h6" }],
    ["path", { d: "M15 12h6" }],
    ["path", { d: "M3 19h18" }],
    ["path", { d: "m3 12 3.553-7.724a.5.5 0 0 1 .894 0L11 12" }],
    ["path", { d: "M3.92 10h6.16" }],
];
var iz = [
    ["path", { d: "M17 5H3" }],
    ["path", { d: "M21 12H8" }],
    ["path", { d: "M21 19H8" }],
    ["path", { d: "M3 12v7" }],
];
var oz = [
    ["path", { d: "M21 5H3" }],
    ["path", { d: "M10 12H3" }],
    ["path", { d: "M10 19H3" }],
    ["circle", { cx: "17", cy: "15", r: "3" }],
    ["path", { d: "m21 19-1.9-1.9" }],
];
var i2 = [
    ["path", { d: "M14 21h1" }],
    ["path", { d: "M14 3h1" }],
    ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
    ["path", { d: "M21 14v1" }],
    ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
    ["path", { d: "M21 9v1" }],
    ["path", { d: "M3 14v1" }],
    ["path", { d: "M3 9v1" }],
    ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
    ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
    ["path", { d: "M7 12h10" }],
    ["path", { d: "M7 16h6" }],
    ["path", { d: "M7 8h8" }],
    ["path", { d: "M9 21h1" }],
    ["path", { d: "M9 3h1" }],
];
var rz = [
    ["path", { d: "M2 10s3-3 3-8" }],
    ["path", { d: "M22 10s-3-3-3-8" }],
    ["path", { d: "M10 2c0 4.4-3.6 8-8 8" }],
    ["path", { d: "M14 2c0 4.4 3.6 8 8 8" }],
    ["path", { d: "M2 10s2 2 2 5" }],
    ["path", { d: "M22 10s-2 2-2 5" }],
    ["path", { d: "M8 15h8" }],
    ["path", { d: "M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" }],
    ["path", { d: "M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" }],
];
var o2 = [
    ["path", { d: "m16 16-3 3 3 3" }],
    ["path", { d: "M3 12h14.5a1 1 0 0 1 0 7H13" }],
    ["path", { d: "M3 19h6" }],
    ["path", { d: "M3 5h18" }],
];
var ez = [
    ["path", { d: "m10 20-1.25-2.5L6 18" }],
    ["path", { d: "M10 4 8.75 6.5 6 6" }],
    ["path", { d: "M10.585 15H10" }],
    ["path", { d: "M2 12h6.5L10 9" }],
    ["path", { d: "M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" }],
    ["path", { d: "m4 10 1.5 2L4 14" }],
    ["path", { d: "m7 21 3-6-1.5-3" }],
    ["path", { d: "m7 3 3 6h2" }],
];
var sz = [
    ["path", { d: "M12 9a4 4 0 0 0-2 7.5" }],
    ["path", { d: "M12 3v2" }],
    ["path", { d: "m6.6 18.4-1.4 1.4" }],
    ["path", { d: "M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" }],
    ["path", { d: "M4 13H2" }],
    ["path", { d: "M6.34 7.34 4.93 5.93" }],
];
var pz = [["path", { d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" }]];
var az = [
    ["path", { d: "M17 14V2" }],
    [
        "path",
        {
            d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
        },
    ],
];
var IO = [
    ["path", { d: "M7 10v12" }],
    [
        "path",
        {
            d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
        },
    ],
];
var EO = [
    [
        "path",
        {
            d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
        },
    ],
    ["path", { d: "m9 12 2 2 4-4" }],
];
var NO = [
    [
        "path",
        {
            d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
        },
    ],
    ["path", { d: "M9 12h6" }],
];
var $O = [
    [
        "path",
        {
            d: "M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
        },
    ],
    ["path", { d: "M9 9h.01" }],
    ["path", { d: "m15 9-6 6" }],
    ["path", { d: "M15 15h.01" }],
];
var _O = [
    [
        "path",
        {
            d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
        },
    ],
    ["path", { d: "M9 12h6" }],
    ["path", { d: "M12 9v6" }],
];
var ZO = [
    [
        "path",
        {
            d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
        },
    ],
    ["path", { d: "m9.5 14.5 5-5" }],
];
var YO = [
    [
        "path",
        {
            d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
        },
    ],
    ["path", { d: "m9.5 14.5 5-5" }],
    ["path", { d: "m9.5 9.5 5 5" }],
];
var QO = [
    [
        "path",
        {
            d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",
        },
    ],
    ["path", { d: "M13 5v2" }],
    ["path", { d: "M13 17v2" }],
    ["path", { d: "M13 11v2" }],
];
var JO = [
    ["path", { d: "M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12" }],
    ["path", { d: "m12 13.5 3.75.5" }],
    ["path", { d: "m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" }],
    ["path", { d: "M6 10V8" }],
    ["path", { d: "M6 14v1" }],
    ["path", { d: "M6 19v2" }],
    ["rect", { x: "2", y: "8", width: "20", height: "13", rx: "2" }],
];
var KO = [
    ["path", { d: "m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" }],
    ["path", { d: "M6 10V8" }],
    ["path", { d: "M6 14v1" }],
    ["path", { d: "M6 19v2" }],
    ["rect", { x: "2", y: "8", width: "20", height: "13", rx: "2" }],
];
var XO = [
    ["path", { d: "M10 2h4" }],
    ["path", { d: "M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" }],
    ["path", { d: "M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M12 12v-2" }],
];
var VO = [
    ["path", { d: "M10 2h4" }],
    ["path", { d: "M12 14v-4" }],
    ["path", { d: "M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" }],
    ["path", { d: "M9 17H4v5" }],
];
var GO = [
    ["line", { x1: "10", x2: "14", y1: "2", y2: "2" }],
    ["line", { x1: "12", x2: "15", y1: "14", y2: "11" }],
    ["circle", { cx: "12", cy: "14", r: "8" }],
];
var WO = [
    ["circle", { cx: "9", cy: "12", r: "3" }],
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7" }],
];
var xO = [
    ["circle", { cx: "15", cy: "12", r: "3" }],
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7" }],
];
var HO = [
    [
        "path",
        {
            d: "M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18",
        },
    ],
    ["path", { d: "M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" }],
];
var zO = [
    ["path", { d: "M10 15h4" }],
    [
        "path",
        {
            d: "m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27",
        },
    ],
    [
        "path",
        {
            d: "m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122",
        },
    ],
    [
        "path",
        {
            d: "M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
        },
    ],
];
var OO = [
    ["path", { d: "M21 4H3" }],
    ["path", { d: "M18 8H6" }],
    ["path", { d: "M19 12H9" }],
    ["path", { d: "M16 16h-6" }],
    ["path", { d: "M11 20H9" }],
];
var TO = [
    ["ellipse", { cx: "12", cy: "11", rx: "3", ry: "2" }],
    ["ellipse", { cx: "12", cy: "12.5", rx: "10", ry: "8.5" }],
];
var DO = [
    ["path", { d: "M12 20v-6" }],
    ["path", { d: "M19.656 14H22" }],
    ["path", { d: "M2 14h12" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" }],
    ["path", { d: "M9.656 4H20a2 2 0 0 1 2 2v10.344" }],
];
var FO = [
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["path", { d: "M2 14h20" }],
    ["path", { d: "M12 20v-6" }],
];
var AO = [
    [
        "path",
        {
            d: "M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z",
        },
    ],
    ["path", { d: "M8 13v9" }],
    ["path", { d: "M16 22v-9" }],
    ["path", { d: "m9 6 1 7" }],
    ["path", { d: "m15 6-1 7" }],
    ["path", { d: "M12 6V2" }],
    ["path", { d: "M13 2h-2" }],
];
var BO = [
    ["rect", { width: "18", height: "12", x: "3", y: "8", rx: "1" }],
    ["path", { d: "M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3" }],
    ["path", { d: "M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3" }],
];
var SO = [
    [
        "path",
        {
            d: "m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20",
        },
    ],
    ["path", { d: "M16 18h-5" }],
    ["path", { d: "M18 5a1 1 0 0 0-1 1v5.573" }],
    ["path", { d: "M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" }],
    ["path", { d: "M4 11V4" }],
    ["path", { d: "M7 15h.01" }],
    ["path", { d: "M8 10.1V4" }],
    ["circle", { cx: "18", cy: "18", r: "2" }],
    ["circle", { cx: "7", cy: "15", r: "5" }],
];
var vO = [
    ["path", { d: "M16.05 10.966a5 2.5 0 0 1-8.1 0" }],
    [
        "path",
        {
            d: "m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04",
        },
    ],
    [
        "path",
        { d: "M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z" },
    ],
    ["path", { d: "M9.194 6.57a5 2.5 0 0 0 5.61 0" }],
];
var yO = [
    ["path", { d: "M2 22V12a10 10 0 1 1 20 0v10" }],
    ["path", { d: "M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8" }],
    ["path", { d: "M10 15h.01" }],
    ["path", { d: "M14 15h.01" }],
    ["path", { d: "M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z" }],
    ["path", { d: "m9 19-2 3" }],
    ["path", { d: "m15 19 2 3" }],
];
var PO = [
    ["path", { d: "M8 3.1V7a4 4 0 0 0 8 0V3.1" }],
    ["path", { d: "m9 15-1-1" }],
    ["path", { d: "m15 15 1-1" }],
    [
        "path",
        { d: "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" },
    ],
    ["path", { d: "m8 19-2 3" }],
    ["path", { d: "m16 19 2 3" }],
];
var qO = [
    ["path", { d: "M2 17 17 2" }],
    ["path", { d: "m2 14 8 8" }],
    ["path", { d: "m5 11 8 8" }],
    ["path", { d: "m8 8 8 8" }],
    ["path", { d: "m11 5 8 8" }],
    ["path", { d: "m14 2 8 8" }],
    ["path", { d: "M7 22 22 7" }],
];
var r2 = [
    ["rect", { width: "16", height: "16", x: "4", y: "3", rx: "2" }],
    ["path", { d: "M4 11h16" }],
    ["path", { d: "M12 3v8" }],
    ["path", { d: "m8 19-2 3" }],
    ["path", { d: "m18 22-2-3" }],
    ["path", { d: "M8 15h.01" }],
    ["path", { d: "M16 15h.01" }],
];
var CO = [
    ["path", { d: "M12 16v6" }],
    ["path", { d: "M14 20h-4" }],
    ["path", { d: "M18 2h4v4" }],
    ["path", { d: "m2 2 7.17 7.17" }],
    ["path", { d: "M2 5.355V2h3.357" }],
    ["path", { d: "m22 2-7.17 7.17" }],
    ["path", { d: "M8 5 5 8" }],
    ["circle", { cx: "12", cy: "12", r: "4" }],
];
var hO = [
    ["path", { d: "M10 11v6" }],
    ["path", { d: "M14 11v6" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }],
];
var bO = [
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }],
];
var kO = [
    [
        "path",
        {
            d: "M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z",
        },
    ],
    ["path", { d: "M12 19v3" }],
];
var e2 = [
    ["path", { d: "M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" }],
    [
        "path",
        {
            d: "M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3",
        },
    ],
    [
        "path",
        {
            d: "M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35",
        },
    ],
    ["path", { d: "M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" }],
];
var wO = [
    [
        "path",
        {
            d: "m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z",
        },
    ],
    ["path", { d: "M12 22v-3" }],
];
var fO = [
    [
        "path",
        { d: "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" },
    ],
    ["path", { d: "M7 16v6" }],
    ["path", { d: "M13 19v3" }],
    [
        "path",
        {
            d: "M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",
        },
    ],
];
var dO = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["rect", { width: "3", height: "9", x: "7", y: "7" }],
    ["rect", { width: "3", height: "5", x: "14", y: "7" }],
];
var MO = [
    ["path", { d: "M16 17h6v-6" }],
    ["path", { d: "m22 17-8.5-8.5-5 5L2 7" }],
];
var tO = [
    ["path", { d: "M14.828 14.828 21 21" }],
    ["path", { d: "M21 16v5h-5" }],
    ["path", { d: "m21 3-9 9-4-4-6 6" }],
    ["path", { d: "M21 8V3h-5" }],
];
var UO = [
    ["path", { d: "M16 7h6v6" }],
    ["path", { d: "m22 7-8.5 8.5-5-5L2 17" }],
];
var s2 = [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        },
    ],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }],
];
var LO = [
    ["path", { d: "M10.17 4.193a2 2 0 0 1 3.666.013" }],
    ["path", { d: "M14 21h2" }],
    ["path", { d: "m15.874 7.743 1 1.732" }],
    ["path", { d: "m18.849 12.952 1 1.732" }],
    ["path", { d: "M21.824 18.18a2 2 0 0 1-1.835 2.824" }],
    ["path", { d: "M4.024 21a2 2 0 0 1-1.839-2.839" }],
    ["path", { d: "m5.136 12.952-1 1.732" }],
    ["path", { d: "M8 21h2" }],
    ["path", { d: "m8.102 7.743-1 1.732" }],
];
var RO = [
    [
        "path",
        {
            d: "M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z",
        },
    ],
];
var lO = [
    ["path", { d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" }],
    ["path", { d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" }],
    ["path", { d: "M18 9h1.5a1 1 0 0 0 0-5H18" }],
    ["path", { d: "M4 22h16" }],
    ["path", { d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" }],
    ["path", { d: "M6 9H4.5a1 1 0 0 1 0-5H6" }],
];
var jO = [
    [
        "path",
        {
            d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z",
        },
    ],
];
var mO = [
    ["path", { d: "M14 19V7a2 2 0 0 0-2-2H9" }],
    ["path", { d: "M15 19H9" }],
    [
        "path",
        {
            d: "M19 19h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14",
        },
    ],
    ["path", { d: "M2 13v5a1 1 0 0 0 1 1h2" }],
    [
        "path",
        {
            d: "M4 3 2.15 5.15a.495.495 0 0 0 .35.86h2.15a.47.47 0 0 1 .35.86L3 9.02",
        },
    ],
    ["circle", { cx: "17", cy: "19", r: "2" }],
    ["circle", { cx: "7", cy: "19", r: "2" }],
];
var gO = [
    [
        "path",
        { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" },
    ],
    ["path", { d: "M15 18H9" }],
    [
        "path",
        {
            d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
        },
    ],
    ["circle", { cx: "17", cy: "18", r: "2" }],
    ["circle", { cx: "7", cy: "18", r: "2" }],
];
var uO = [
    ["path", { d: "M15 4 5 9" }],
    ["path", { d: "m15 8.5-10 5" }],
    ["path", { d: "M18 12a9 9 0 0 1-9 9V3" }],
];
var cO = [
    ["path", { d: "M10 12.01h.01" }],
    ["path", { d: "M18 8v4a8 8 0 0 1-1.07 4" }],
    ["circle", { cx: "10", cy: "12", r: "4" }],
    ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }],
];
var nO = [
    [
        "path",
        {
            d: "m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z",
        },
    ],
    ["path", { d: "M4.82 7.9 8 10" }],
    ["path", { d: "M15.18 7.9 12 10" }],
    ["path", { d: "M16.93 10H20a2 2 0 0 1 0 4H2" }],
];
var p2 = [
    ["path", { d: "M7 21h10" }],
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
];
var iO = [
    [
        "path",
        {
            d: "M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z",
        },
    ],
    ["path", { d: "M7 21h10" }],
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
];
var oO = [
    ["path", { d: "m17 2-5 5-5-5" }],
    ["rect", { width: "20", height: "15", x: "2", y: "7", rx: "2" }],
];
var rO = [["path", { d: "M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" }]];
var eO = [
    [
        "path",
        {
            d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
        },
    ],
];
var sO = [
    [
        "path",
        {
            d: "M14 16.5a.5.5 0 0 0 .5.5h.5a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4h.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V8a2 2 0 0 1-4 0V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5Z",
        },
    ],
];
var pO = [
    ["path", { d: "M12 4v16" }],
    ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" }],
    ["path", { d: "M9 20h6" }],
];
var aO = [
    ["path", { d: "M12 13v7a2 2 0 0 0 4 0" }],
    ["path", { d: "M12 2v2" }],
    [
        "path",
        {
            d: "M18.656 13h2.336a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-12.07-7.51",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        { d: "M5.961 5.957a10.28 10.28 0 0 0-3.922 5.769A1 1 0 0 0 3 13h10" },
    ],
];
var IT = [
    ["path", { d: "M12 13v7a2 2 0 0 0 4 0" }],
    ["path", { d: "M12 2v2" }],
    [
        "path",
        {
            d: "M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z",
        },
    ],
];
var ET = [
    ["path", { d: "M6 4v6a6 6 0 0 0 12 0V4" }],
    ["line", { x1: "4", x2: "20", y1: "20", y2: "20" }],
];
var NT = [
    ["path", { d: "M9 14 4 9l5-5" }],
    ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" }],
];
var $T = [
    ["path", { d: "M21 17a9 9 0 0 0-15-6.7L3 13" }],
    ["path", { d: "M3 7v6h6" }],
    ["circle", { cx: "12", cy: "17", r: "1" }],
];
var _T = [
    ["path", { d: "M3 7v6h6" }],
    ["path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" }],
];
var ZT = [
    ["path", { d: "M16 12h6" }],
    ["path", { d: "M8 12H2" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M12 8v2" }],
    ["path", { d: "M12 14v2" }],
    ["path", { d: "M12 20v2" }],
    ["path", { d: "m19 15 3-3-3-3" }],
    ["path", { d: "m5 9-3 3 3 3" }],
];
var YT = [
    ["path", { d: "M12 22v-6" }],
    ["path", { d: "M12 8V2" }],
    ["path", { d: "M4 12H2" }],
    ["path", { d: "M10 12H8" }],
    ["path", { d: "M16 12h-2" }],
    ["path", { d: "M22 12h-2" }],
    ["path", { d: "m15 19-3 3-3-3" }],
    ["path", { d: "m15 5-3-3-3 3" }],
];
var QT = [
    ["rect", { width: "8", height: "6", x: "5", y: "4", rx: "1" }],
    ["rect", { width: "8", height: "6", x: "11", y: "14", rx: "1" }],
];
var a2 = [
    ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }],
    ["path", { d: "M18 12h.01" }],
    ["path", { d: "M18 16h.01" }],
    [
        "path",
        {
            d: "M22 7a1 1 0 0 0-1-1h-2a2 2 0 0 1-1.143-.359L13.143 2.36a2 2 0 0 0-2.286-.001L6.143 5.64A2 2 0 0 1 5 6H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z",
        },
    ],
    ["path", { d: "M6 12h.01" }],
    ["path", { d: "M6 16h.01" }],
    ["circle", { cx: "12", cy: "10", r: "2" }],
];
var JT = [["path", { d: "M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2" }]];
var KT = [
    [
        "path",
        {
            d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",
        },
    ],
    [
        "path",
        {
            d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",
        },
    ],
    ["line", { x1: "8", x2: "8", y1: "2", y2: "5" }],
    ["line", { x1: "2", x2: "5", y1: "8", y2: "8" }],
    ["line", { x1: "16", x2: "16", y1: "19", y2: "22" }],
    ["line", { x1: "19", x2: "22", y1: "16", y2: "16" }],
];
var XT = [
    ["path", { d: "m19 5 3-3" }],
    ["path", { d: "m2 22 3-3" }],
    [
        "path",
        {
            d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z",
        },
    ],
    ["path", { d: "M7.5 13.5 10 11" }],
    ["path", { d: "M10.5 16.5 13 14" }],
    [
        "path",
        {
            d: "m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z",
        },
    ],
];
var VT = [
    ["path", { d: "M12 3v12" }],
    ["path", { d: "m17 8-5-5-5 5" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
];
var GT = [
    ["circle", { cx: "10", cy: "7", r: "1" }],
    ["circle", { cx: "4", cy: "20", r: "1" }],
    ["path", { d: "M4.7 19.3 19 5" }],
    ["path", { d: "m21 3-3 1 2 2Z" }],
    ["path", { d: "M9.26 7.68 5 12l2 5" }],
    ["path", { d: "m10 14 5 2 3.5-3.5" }],
    ["path", { d: "m18 12 1-1 1 1-1 1Z" }],
];
var WT = [
    ["path", { d: "m16 11 2 2 4-4" }],
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
];
var xT = [
    ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2" }],
    ["path", { d: "m14.305 16.53.923-.382" }],
    ["path", { d: "m15.228 13.852-.923-.383" }],
    ["path", { d: "m16.852 12.228-.383-.923" }],
    ["path", { d: "m16.852 17.772-.383.924" }],
    ["path", { d: "m19.148 12.228.383-.923" }],
    ["path", { d: "m19.53 18.696-.382-.924" }],
    ["path", { d: "m20.772 13.852.924-.383" }],
    ["path", { d: "m20.772 16.148.924.383" }],
    ["circle", { cx: "18", cy: "15", r: "3" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
];
var HT = [
    ["circle", { cx: "10", cy: "7", r: "4" }],
    ["path", { d: "M10.3 15H7a4 4 0 0 0-4 4v2" }],
    ["path", { d: "M15 15.5V14a2 2 0 0 1 4 0v1.5" }],
    ["rect", { width: "8", height: "5", x: "13", y: "16", rx: ".899" }],
];
var zT = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
    ["line", { x1: "22", x2: "16", y1: "11", y2: "11" }],
];
var OT = [
    ["path", { d: "M11.5 15H7a4 4 0 0 0-4 4v2" }],
    [
        "path",
        {
            d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
    ["circle", { cx: "10", cy: "7", r: "4" }],
];
var TT = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
    ["line", { x1: "19", x2: "19", y1: "8", y2: "14" }],
    ["line", { x1: "22", x2: "16", y1: "11", y2: "11" }],
];
var I5 = [
    ["path", { d: "M2 21a8 8 0 0 1 13.292-6" }],
    ["circle", { cx: "10", cy: "8", r: "5" }],
    ["path", { d: "m16 19 2 2 4-4" }],
];
var E5 = [
    ["path", { d: "m14.305 19.53.923-.382" }],
    ["path", { d: "m15.228 16.852-.923-.383" }],
    ["path", { d: "m16.852 15.228-.383-.923" }],
    ["path", { d: "m16.852 20.772-.383.924" }],
    ["path", { d: "m19.148 15.228.383-.923" }],
    ["path", { d: "m19.53 21.696-.382-.924" }],
    ["path", { d: "M2 21a8 8 0 0 1 10.434-7.62" }],
    ["path", { d: "m20.772 16.852.924-.383" }],
    ["path", { d: "m20.772 19.148.924.383" }],
    ["circle", { cx: "10", cy: "8", r: "5" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
];
var N5 = [
    ["path", { d: "M2 21a8 8 0 0 1 13.292-6" }],
    ["circle", { cx: "10", cy: "8", r: "5" }],
    ["path", { d: "M22 19h-6" }],
];
var DT = [
    ["path", { d: "M2 21a8 8 0 0 1 10.821-7.487" }],
    [
        "path",
        {
            d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
    ["circle", { cx: "10", cy: "8", r: "5" }],
];
var $5 = [
    ["path", { d: "M2 21a8 8 0 0 1 13.292-6" }],
    ["circle", { cx: "10", cy: "8", r: "5" }],
    ["path", { d: "M19 16v6" }],
    ["path", { d: "M22 19h-6" }],
];
var FT = [
    ["circle", { cx: "10", cy: "8", r: "5" }],
    ["path", { d: "M2 21a8 8 0 0 1 10.434-7.62" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
    ["path", { d: "m22 22-1.9-1.9" }],
];
var _5 = [
    ["path", { d: "M2 21a8 8 0 0 1 11.873-7" }],
    ["circle", { cx: "10", cy: "8", r: "5" }],
    ["path", { d: "m17 17 5 5" }],
    ["path", { d: "m22 17-5 5" }],
];
var Z5 = [
    ["circle", { cx: "12", cy: "8", r: "5" }],
    ["path", { d: "M20 21a8 8 0 0 0-16 0" }],
];
var AT = [
    ["circle", { cx: "10", cy: "7", r: "4" }],
    ["path", { d: "M10.3 15H7a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "17", cy: "17", r: "3" }],
    ["path", { d: "m21 21-1.9-1.9" }],
];
var BT = [
    [
        "path",
        {
            d: "M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z",
        },
    ],
    ["path", { d: "M8 15H7a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "10", cy: "7", r: "4" }],
];
var ST = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
    ["line", { x1: "17", x2: "22", y1: "8", y2: "13" }],
    ["line", { x1: "22", x2: "17", y1: "8", y2: "13" }],
];
var vT = [
    ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
    ["circle", { cx: "12", cy: "7", r: "4" }],
];
var Y5 = [
    ["path", { d: "M18 21a8 8 0 0 0-16 0" }],
    ["circle", { cx: "10", cy: "8", r: "5" }],
    ["path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" }],
];
var yT = [
    ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
    ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744" }],
    ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
    ["circle", { cx: "9", cy: "7", r: "4" }],
];
var Q5 = [
    [
        "path",
        { d: "m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" },
    ],
    [
        "path",
        {
            d: "M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7",
        },
    ],
    ["path", { d: "m2.1 21.8 6.4-6.3" }],
    ["path", { d: "m19 5-7 7" }],
];
var J5 = [
    ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" }],
    ["path", { d: "M7 2v20" }],
    ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" }],
];
var PT = [
    ["path", { d: "M12 2v20" }],
    ["path", { d: "M2 5h20" }],
    ["path", { d: "M3 3v2" }],
    ["path", { d: "M7 3v2" }],
    ["path", { d: "M17 3v2" }],
    ["path", { d: "M21 3v2" }],
    ["path", { d: "m19 5-7 7-7-7" }],
];
var qT = [
    ["path", { d: "M8 21s-4-3-4-9 4-9 4-9" }],
    ["path", { d: "M16 3s4 3 4 9-4 9-4 9" }],
    ["line", { x1: "15", x2: "9", y1: "9", y2: "15" }],
    ["line", { x1: "9", x2: "15", y1: "9", y2: "15" }],
];
var CT = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }],
    ["path", { d: "m7.9 7.9 2.7 2.7" }],
    ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor" }],
    ["path", { d: "m13.4 10.6 2.7-2.7" }],
    ["circle", { cx: "7.5", cy: "16.5", r: ".5", fill: "currentColor" }],
    ["path", { d: "m7.9 16.1 2.7-2.7" }],
    ["circle", { cx: "16.5", cy: "16.5", r: ".5", fill: "currentColor" }],
    ["path", { d: "m13.4 13.4 2.7 2.7" }],
    ["circle", { cx: "12", cy: "12", r: "2" }],
];
var hT = [
    ["path", { d: "M19.5 7a24 24 0 0 1 0 10" }],
    ["path", { d: "M4.5 7a24 24 0 0 0 0 10" }],
    ["path", { d: "M7 19.5a24 24 0 0 0 10 0" }],
    ["path", { d: "M7 4.5a24 24 0 0 1 10 0" }],
    ["rect", { x: "17", y: "17", width: "5", height: "5", rx: "1" }],
    ["rect", { x: "17", y: "2", width: "5", height: "5", rx: "1" }],
    ["rect", { x: "2", y: "17", width: "5", height: "5", rx: "1" }],
    ["rect", { x: "2", y: "2", width: "5", height: "5", rx: "1" }],
];
var bT = [
    ["path", { d: "M16 8q6 0 6-6-6 0-6 6" }],
    ["path", { d: "M17.41 3.59a10 10 0 1 0 3 3" }],
    ["path", { d: "M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14" }],
];
var kT = [
    ["path", { d: "M18 11c-1.5 0-2.5.5-3 2" }],
    [
        "path",
        {
            d: "M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z",
        },
    ],
    ["path", { d: "M6 11c1.5 0 2.5.5 3 2" }],
];
var wT = [
    ["path", { d: "M10 20h4" }],
    ["path", { d: "M12 16v6" }],
    ["path", { d: "M17 2h4v4" }],
    ["path", { d: "m21 2-5.46 5.46" }],
    ["circle", { cx: "12", cy: "11", r: "5" }],
];
var fT = [
    ["path", { d: "M12 15v7" }],
    ["path", { d: "M9 19h6" }],
    ["circle", { cx: "12", cy: "9", r: "6" }],
];
var dT = [
    ["path", { d: "m2 8 2 2-2 2 2 2-2 2" }],
    ["path", { d: "m22 8-2 2 2 2-2 2 2 2" }],
    ["path", { d: "M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2" }],
    ["path", { d: "M16 10.34V6c0-.55-.45-1-1-1h-4.34" }],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var MT = [
    ["path", { d: "m2 8 2 2-2 2 2 2-2 2" }],
    ["path", { d: "m22 8-2 2 2 2-2 2 2 2" }],
    ["rect", { width: "8", height: "14", x: "8", y: "5", rx: "1" }],
];
var tT = [
    [
        "path",
        {
            d: "M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196",
        },
    ],
    ["path", { d: "M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" }],
    ["path", { d: "m2 2 20 20" }],
];
var UT = [
    [
        "path",
        {
            d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
        },
    ],
    ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2" }],
];
var LT = [
    ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
    ["path", { d: "M2 8h20" }],
    ["circle", { cx: "8", cy: "14", r: "2" }],
    ["path", { d: "M8 12h8" }],
    ["circle", { cx: "16", cy: "14", r: "2" }],
];
var RT = [
    ["path", { d: "M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" }],
    ["path", { d: "M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" }],
    ["circle", { cx: "12", cy: "12", r: "1" }],
    [
        "path",
        {
            d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0",
        },
    ],
];
var lT = [
    ["circle", { cx: "6", cy: "12", r: "4" }],
    ["circle", { cx: "18", cy: "12", r: "4" }],
    ["line", { x1: "6", x2: "18", y1: "16", y2: "16" }],
];
var jT = [
    ["path", { d: "M11.1 7.1a16.55 16.55 0 0 1 10.9 4" }],
    ["path", { d: "M12 12a12.6 12.6 0 0 1-8.7 5" }],
    ["path", { d: "M16.8 13.6a16.55 16.55 0 0 1-9 7.5" }],
    ["path", { d: "M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" }],
    ["path", { d: "M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
];
var mT = [
    [
        "path",
        {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        },
    ],
    ["path", { d: "M16 9a5 5 0 0 1 0 6" }],
];
var gT = [
    [
        "path",
        {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        },
    ],
    ["path", { d: "M16 9a5 5 0 0 1 0 6" }],
    ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728" }],
];
var uT = [
    [
        "path",
        {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        },
    ],
    ["line", { x1: "22", x2: "16", y1: "9", y2: "15" }],
    ["line", { x1: "16", x2: "22", y1: "9", y2: "15" }],
];
var cT = [
    ["path", { d: "M16 9a5 5 0 0 1 .95 2.293" }],
    ["path", { d: "M19.364 5.636a9 9 0 0 1 1.889 9.96" }],
    ["path", { d: "m2 2 20 20" }],
    [
        "path",
        {
            d: "m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11",
        },
    ],
    ["path", { d: "M9.828 4.172A.686.686 0 0 1 11 4.657v.686" }],
];
var nT = [
    [
        "path",
        {
            d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        },
    ],
];
var iT = [
    ["path", { d: "m9 12 2 2 4-4" }],
    ["path", { d: "M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" }],
    ["path", { d: "M22 19H2" }],
];
var oT = [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" }],
    [
        "path",
        {
            d: "M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21",
        },
    ],
];
var K5 = [
    ["path", { d: "M17 14h.01" }],
    [
        "path",
        {
            d: "M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14",
        },
    ],
];
var rT = [
    [
        "path",
        {
            d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
        },
    ],
    ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }],
];
var eT = [
    ["path", { d: "M12 17v4" }],
    ["path", { d: "M8 21h8" }],
    ["path", { d: "m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15" }],
    ["circle", { cx: "8", cy: "9", r: "2" }],
    ["rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }],
];
var X5 = [
    [
        "path",
        {
            d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
        },
    ],
    ["path", { d: "m14 7 3 3" }],
    ["path", { d: "M5 6v4" }],
    ["path", { d: "M19 14v4" }],
    ["path", { d: "M10 2v2" }],
    ["path", { d: "M7 8H3" }],
    ["path", { d: "M21 16h-4" }],
    ["path", { d: "M11 3H9" }],
];
var sT = [
    ["path", { d: "M15 4V2" }],
    ["path", { d: "M15 16v-2" }],
    ["path", { d: "M8 9h2" }],
    ["path", { d: "M20 9h2" }],
    ["path", { d: "M17.8 11.8 19 13" }],
    ["path", { d: "M15 9h.01" }],
    ["path", { d: "M17.8 6.2 19 5" }],
    ["path", { d: "m3 21 9-9" }],
    ["path", { d: "M12.2 6.2 11 5" }],
];
var pT = [
    ["path", { d: "M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11" }],
    [
        "path",
        {
            d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z",
        },
    ],
    ["path", { d: "M6 13h12" }],
    ["path", { d: "M6 17h12" }],
];
var aT = [
    ["path", { d: "M3 6h3" }],
    ["path", { d: "M17 6h.01" }],
    ["rect", { width: "18", height: "20", x: "3", y: "2", rx: "2" }],
    ["circle", { cx: "12", cy: "13", r: "5" }],
    ["path", { d: "M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" }],
];
var ID = [
    ["path", { d: "M12 10v2.2l1.6 1" }],
    [
        "path",
        {
            d: "m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05",
        },
    ],
    [
        "path",
        {
            d: "m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05",
        },
    ],
    ["circle", { cx: "12", cy: "12", r: "6" }],
];
var ED = [
    ["path", { d: "M19 5a2 2 0 0 0-2 2v11" }],
    [
        "path",
        {
            d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
    ],
    ["path", { d: "M7 13h10" }],
    ["path", { d: "M7 9h10" }],
    ["path", { d: "M9 5a2 2 0 0 0-2 2v11" }],
];
var ND = [
    [
        "path",
        {
            d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
    ],
    [
        "path",
        {
            d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
    ],
    [
        "path",
        {
            d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
    ],
];
var $D = [
    ["circle", { cx: "12", cy: "4.5", r: "2.5" }],
    ["path", { d: "m10.2 6.3-3.9 3.9" }],
    ["circle", { cx: "4.5", cy: "12", r: "2.5" }],
    ["path", { d: "M7 12h10" }],
    ["circle", { cx: "19.5", cy: "12", r: "2.5" }],
    ["path", { d: "m13.8 17.7 3.9-3.9" }],
    ["circle", { cx: "12", cy: "19.5", r: "2.5" }],
];
var _D = [
    ["circle", { cx: "12", cy: "10", r: "8" }],
    ["circle", { cx: "12", cy: "10", r: "3" }],
    ["path", { d: "M7 22h10" }],
    ["path", { d: "M12 22v-4" }],
];
var ZD = [
    ["path", { d: "M17 17h-5c-1.09-.02-1.94.92-2.5 1.9A3 3 0 1 1 2.57 15" }],
    ["path", { d: "M9 3.4a4 4 0 0 1 6.52.66" }],
    ["path", { d: "m6 17 3.1-5.8a2.5 2.5 0 0 0 .057-2.05" }],
    ["path", { d: "M20.3 20.3a4 4 0 0 1-2.3.7" }],
    ["path", { d: "M18.6 13a4 4 0 0 1 3.357 3.414" }],
    ["path", { d: "m12 6 .6 1" }],
    ["path", { d: "m2 2 20 20" }],
];
var YD = [
    [
        "path",
        {
            d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2",
        },
    ],
    [
        "path",
        { d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" },
    ],
    ["path", { d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" }],
];
var QD = [
    ["circle", { cx: "12", cy: "5", r: "3" }],
    [
        "path",
        {
            d: "M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z",
        },
    ],
];
var JD = [
    ["path", { d: "m2 22 10-10" }],
    ["path", { d: "m16 8-1.17 1.17" }],
    [
        "path",
        {
            d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
        },
    ],
    [
        "path",
        {
            d: "m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97",
        },
    ],
    [
        "path",
        {
            d: "M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.5 3.5 0 0 1 .28 4.62",
        },
    ],
    ["path", { d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" }],
    [
        "path",
        {
            d: "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
        },
    ],
    [
        "path",
        {
            d: "m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98",
        },
    ],
    [
        "path",
        {
            d: "M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.5 3.5 0 0 0-4.62-.28",
        },
    ],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var KD = [
    ["path", { d: "M2 22 16 8" }],
    [
        "path",
        {
            d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
        },
    ],
    [
        "path",
        {
            d: "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
        },
    ],
    [
        "path",
        {
            d: "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z",
        },
    ],
    ["path", { d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" }],
    [
        "path",
        {
            d: "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
        },
    ],
    [
        "path",
        {
            d: "M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
        },
    ],
    [
        "path",
        {
            d: "M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z",
        },
    ],
];
var XD = [
    ["circle", { cx: "7", cy: "12", r: "3" }],
    ["path", { d: "M10 9v6" }],
    ["circle", { cx: "17", cy: "12", r: "3" }],
    ["path", { d: "M14 7v8" }],
    ["path", { d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" }],
];
var VD = [
    ["path", { d: "m14.305 19.53.923-.382" }],
    ["path", { d: "m15.228 16.852-.923-.383" }],
    ["path", { d: "m16.852 15.228-.383-.923" }],
    ["path", { d: "m16.852 20.772-.383.924" }],
    ["path", { d: "m19.148 15.228.383-.923" }],
    ["path", { d: "m19.53 21.696-.382-.924" }],
    ["path", { d: "M2 7.82a15 15 0 0 1 20 0" }],
    ["path", { d: "m20.772 16.852.924-.383" }],
    ["path", { d: "m20.772 19.148.924.383" }],
    ["path", { d: "M5 11.858a10 10 0 0 1 11.5-1.785" }],
    ["path", { d: "M8.5 15.429a5 5 0 0 1 2.413-1.31" }],
    ["circle", { cx: "18", cy: "18", r: "3" }],
];
var GD = [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
];
var WD = [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
];
var xD = [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69" }],
    ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643" }],
    ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764" }],
    ["path", { d: "m2 2 20 20" }],
];
var HD = [
    ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
    [
        "path",
        {
            d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
        },
    ],
    ["path", { d: "M5 12.859a10 10 0 0 1 10.5-2.222" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 3-1.406" }],
];
var zD = [
    ["path", { d: "M11.965 10.105v4L13.5 12.5a5 5 0 0 1 8 1.5" }],
    ["path", { d: "M11.965 14.105h4" }],
    ["path", { d: "M17.965 18.105h4L20.43 19.71a5 5 0 0 1-8-1.5" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
    ["path", { d: "M21.965 22.105v-4" }],
    ["path", { d: "M5 12.86a10 10 0 0 1 3-2.032" }],
    ["path", { d: "M8.5 16.429h.01" }],
];
var OD = [["path", { d: "M12 20h.01" }]];
var TD = [
    ["path", { d: "M12 20h.01" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
];
var DD = [
    ["path", { d: "M10 2v8" }],
    ["path", { d: "M12.8 21.6A2 2 0 1 0 14 18H2" }],
    ["path", { d: "M17.5 10a2.5 2.5 0 1 1 2 4H2" }],
    ["path", { d: "m6 6 4 4 4-4" }],
];
var FD = [
    ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2" }],
    ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2" }],
    ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2" }],
];
var AD = [
    ["path", { d: "M8 22h8" }],
    ["path", { d: "M7 10h3m7 0h-1.343" }],
    ["path", { d: "M12 15v7" }],
    [
        "path",
        {
            d: "M7.307 7.307A12.33 12.33 0 0 0 7 10a5 5 0 0 0 7.391 4.391M8.638 2.981C8.75 2.668 8.872 2.34 9 2h6c1.5 4 2 6 2 8 0 .407-.05.809-.145 1.198",
        },
    ],
    ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
];
var BD = [
    ["path", { d: "M8 22h8" }],
    ["path", { d: "M7 10h10" }],
    ["path", { d: "M12 15v7" }],
    [
        "path",
        {
            d: "M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z",
        },
    ],
];
var SD = [
    ["rect", { width: "8", height: "8", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4" }],
    ["rect", { width: "8", height: "8", x: "13", y: "13", rx: "2" }],
];
var vD = [
    ["path", { d: "m19 12-1.5 3" }],
    ["path", { d: "M19.63 18.81 22 20" }],
    [
        "path",
        {
            d: "M6.47 8.23a1.68 1.68 0 0 1 2.44 1.93l-.64 2.08a6.76 6.76 0 0 0 10.16 7.67l.42-.27a1 1 0 1 0-2.73-4.21l-.42.27a1.76 1.76 0 0 1-2.63-1.99l.64-2.08A6.66 6.66 0 0 0 3.94 3.9l-.7.4a1 1 0 1 0 2.55 4.34z",
        },
    ],
];
var yD = [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }],
];
var PD = [
    [
        "path",
        {
            d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
        },
    ],
];
var qD = [
    [
        "path",
        {
            d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
        },
    ],
    ["path", { d: "m10 15 5-3-5-3z" }],
];
var CD = [
    ["path", { d: "M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317" }],
    ["path", { d: "M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773" }],
    [
        "path",
        {
            d: "M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643",
        },
    ],
    ["path", { d: "m2 2 20 20" }],
];
var hD = [
    [
        "path",
        {
            d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        },
    ],
];
var bD = [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65" }],
    ["line", { x1: "11", x2: "11", y1: "8", y2: "14" }],
    ["line", { x1: "8", x2: "14", y1: "11", y2: "11" }],
];
var kD = [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65" }],
    ["line", { x1: "8", x2: "14", y1: "11", y2: "11" }],
];
var wD = ({
    icons: I = {},
    nameAttr: E = "data-lucide",
    attrs: N = {},
    root: $ = document,
} = {}) => {
    if (!Object.values(I).length)
        throw Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);
    if (typeof $ > "u")
        throw Error("`createIcons()` only works in a browser environment.");
    let _ = $.querySelectorAll(`[${E}]`);
    if (
        (Array.from(_).forEach((Z) =>
            T(Z, { nameAttr: E, icons: I, attrs: N }),
        ),
        E === "data-lucide")
    ) {
        let Z = $.querySelectorAll("[icon-name]");
        if (Z.length > 0)
            (console.warn(
                "[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide",
            ),
                Array.from(Z).forEach((Q) =>
                    T(Q, { nameAttr: "icon-name", icons: I, attrs: N }),
                ));
    }
};
wD({ icons: z });
