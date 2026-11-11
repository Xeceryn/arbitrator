import { describe, expect, test } from "bun:test";

import { signalColorClass } from "./signal";

describe("signalColorClass", () => {
    test("maps every buy/sell base-currency pair to its card class", () => {
        expect(signalColorClass("idr", "usdt")).toBe("signal-idr-usdt");
        expect(signalColorClass("usdt", "idr")).toBe("signal-usdt-idr");
        expect(signalColorClass("usdt", "usdt")).toBe("signal-usdt-usdt");
        // Route D: only reachable now that two IDR-quoted venues (Indodax and
        // Pintu) can both list the same coin.
        expect(signalColorClass("idr", "idr")).toBe("signal-idr-idr");
    });
});
