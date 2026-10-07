var f = Object.create;
var { getPrototypeOf: S, defineProperty: l, getOwnPropertyNames: A } = Object;
var b = Object.prototype.hasOwnProperty;
var E = (a, t, e) => {
    e = a != null ? f(S(a)) : {};
    let c =
        t || !a || !a.__esModule
            ? l(e, "default", { value: a, enumerable: !0 })
            : e;
    for (let o of A(a))
        if (!b.call(c, o)) l(c, o, { get: () => a[o], enumerable: !0 });
    return c;
};
var v = (a, t) => () => (t || a((t = { exports: {} }).exports, t), t.exports);
var y = (a, t) => {
    for (var e in t)
        l(a, e, {
            get: t[e],
            enumerable: !0,
            configurable: !0,
            set: (c) => (t[e] = () => c),
        });
};
var i = v((r, s) => {
    function d() {
        var a = document.querySelector("[data-toggle-theme]"),
            t = a ? a.getAttribute("data-key") : null;
        if (
            ((function (e = localStorage.getItem(t ? t : "theme")) {
                if (localStorage.getItem(t ? t : "theme")) {
                    if (
                        (document.documentElement.setAttribute("data-theme", e),
                        a)
                    )
                        [
                            ...document.querySelectorAll("[data-toggle-theme]"),
                        ].forEach((c) => {
                            c.classList.add(a.getAttribute("data-act-class"));
                        });
                }
            })(),
            a)
        )
            [...document.querySelectorAll("[data-toggle-theme]")].forEach(
                (e) => {
                    e.addEventListener("click", function () {
                        var c = e.getAttribute("data-toggle-theme");
                        if (c) {
                            var o = c.split(",");
                            if (
                                document.documentElement.getAttribute(
                                    "data-theme",
                                ) == o[0]
                            )
                                if (o.length == 1)
                                    (document.documentElement.removeAttribute(
                                        "data-theme",
                                    ),
                                        localStorage.removeItem(
                                            t ? t : "theme",
                                        ));
                                else
                                    (document.documentElement.setAttribute(
                                        "data-theme",
                                        o[1],
                                    ),
                                        localStorage.setItem(
                                            t ? t : "theme",
                                            o[1],
                                        ));
                            else
                                (document.documentElement.setAttribute(
                                    "data-theme",
                                    o[0],
                                ),
                                    localStorage.setItem(
                                        t ? t : "theme",
                                        o[0],
                                    ));
                        }
                        [
                            ...document.querySelectorAll("[data-toggle-theme]"),
                        ].forEach((h) => {
                            h.classList.toggle(
                                this.getAttribute("data-act-class"),
                            );
                        });
                    });
                },
            );
    }
    function m() {
        var a = document.querySelector("[data-set-theme='']"),
            t = a ? a.getAttribute("data-key") : null;
        ((function (e = localStorage.getItem(t ? t : "theme")) {
            if (e != null && e != "")
                if (
                    localStorage.getItem(t ? t : "theme") &&
                    localStorage.getItem(t ? t : "theme") != ""
                ) {
                    document.documentElement.setAttribute("data-theme", e);
                    var c = document.querySelector(
                        "[data-set-theme='" + e.toString() + "']",
                    );
                    if (c) {
                        if (
                            ([
                                ...document.querySelectorAll(
                                    "[data-set-theme]",
                                ),
                            ].forEach((o) => {
                                o.classList.remove(
                                    o.getAttribute("data-act-class"),
                                );
                            }),
                            c.getAttribute("data-act-class"))
                        )
                            c.classList.add(c.getAttribute("data-act-class"));
                    }
                } else {
                    var c = document.querySelector("[data-set-theme='']");
                    if (c.getAttribute("data-act-class"))
                        c.classList.add(c.getAttribute("data-act-class"));
                }
        })(),
            [...document.querySelectorAll("[data-set-theme]")].forEach((e) => {
                e.addEventListener("click", function () {
                    if (
                        (document.documentElement.setAttribute(
                            "data-theme",
                            this.getAttribute("data-set-theme"),
                        ),
                        localStorage.setItem(
                            t ? t : "theme",
                            document.documentElement.getAttribute("data-theme"),
                        ),
                        [
                            ...document.querySelectorAll("[data-set-theme]"),
                        ].forEach((c) => {
                            c.classList.remove(
                                c.getAttribute("data-act-class"),
                            );
                        }),
                        e.getAttribute("data-act-class"))
                    )
                        e.classList.add(e.getAttribute("data-act-class"));
                });
            }));
    }
    function u() {
        var a = document.querySelector("select[data-choose-theme]"),
            t = a ? a.getAttribute("data-key") : null;
        if (
            ((function (e = localStorage.getItem(t ? t : "theme")) {
                if (localStorage.getItem(t ? t : "theme")) {
                    document.documentElement.setAttribute("data-theme", e);
                    var c = document.querySelector(
                        "select[data-choose-theme] [value='" +
                            e.toString() +
                            "']",
                    );
                    if (c)
                        [
                            ...document.querySelectorAll(
                                "select[data-choose-theme] [value='" +
                                    e.toString() +
                                    "']",
                            ),
                        ].forEach((o) => {
                            o.selected = !0;
                        });
                }
            })(),
            a)
        )
            [...document.querySelectorAll("select[data-choose-theme]")].forEach(
                (e) => {
                    e.addEventListener("change", function () {
                        (document.documentElement.setAttribute(
                            "data-theme",
                            this.value,
                        ),
                            localStorage.setItem(
                                t ? t : "theme",
                                document.documentElement.getAttribute(
                                    "data-theme",
                                ),
                            ),
                            [
                                ...document.querySelectorAll(
                                    "select[data-choose-theme] [value='" +
                                        localStorage.getItem(t ? t : "theme") +
                                        "']",
                                ),
                            ].forEach((c) => {
                                c.selected = !0;
                            }));
                    });
                },
            );
    }
    function n(a = !0) {
        if (a === !0)
            document.addEventListener("DOMContentLoaded", function (t) {
                (d(), u(), m());
            });
        else (d(), u(), m());
    }
    if (typeof r < "u") s.exports = { themeChange: n };
    else n();
});
var g = E(i(), 1);
g.themeChange();
