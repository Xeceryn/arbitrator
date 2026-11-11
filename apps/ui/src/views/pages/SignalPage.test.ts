import { describe, expect, test } from "bun:test";

import {
    isSignalRoute,
    parseRoutes,
    SIGNAL_ROUTES,
    type SignalRoute,
} from "./SignalPage";

/**
 * The route filter travels in the URL as repeated `route=<key>` params
 * (`?route=idr-usdt&route=usdt-idr`). Parsing is deliberately lenient: an
 * unknown or stale key must not take the whole board down, it is just dropped.
 */
describe("parseRoutes", () => {
    test("no param means every route", () => {
        expect(parseRoutes([])).toEqual([]);
    });

    test("keeps the requested routes in the canonical order", () => {
        expect(parseRoutes(["usdt-usdt", "idr-usdt"])).toEqual([
            "idr-usdt",
            "usdt-usdt",
        ]);
    });

    test("drops unknown keys instead of failing", () => {
        expect(parseRoutes(["idr-idr", "idr-usd", ""])).toEqual(["idr-idr"]);
    });

    test("dedupes repeated params", () => {
        expect(parseRoutes(["usdt-idr", "usdt-idr"])).toEqual(["usdt-idr"]);
    });

    test("all four routes round-trip", () => {
        const all = SIGNAL_ROUTES.map((route) => route.key);
        expect(parseRoutes(all)).toEqual(all);
    });
});

describe("SIGNAL_ROUTES", () => {
    test("route D is IDR to IDR", () => {
        expect(SIGNAL_ROUTES).toContainEqual({
            key: "idr-idr",
            letter: "D",
            label: "IDR → IDR",
        });
    });
});

describe("isSignalRoute", () => {
    test("accepts the four keys only", () => {
        const keys: SignalRoute[] = [
            "idr-usdt",
            "usdt-idr",
            "usdt-usdt",
            "idr-idr",
        ];
        for (const key of keys) expect(isSignalRoute(key)).toBe(true);
        for (const other of ["IDR-USDT", "idr_usdt", "usdt", ""]) {
            expect(isSignalRoute(other)).toBe(false);
        }
    });
});
