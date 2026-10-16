import type { PropsWithChildren } from "@kitajs/html";

import { XIcon } from "../views/components/icons";
import { Navbar } from "../views/components/Navbar";
import { Sidebar } from "../views/components/Sidebar";

type Props = PropsWithChildren<{
    title?: string;
    heading?: string;
}>;

export const BaseLayout = async ({
    title = "E9 - Arbitrator",
    heading,
    children,
}: Props) => {
    return (
        <>
            {`<!DOCTYPE html>`}
            <html lang="en" data-theme="dark">
                <head>
                    <meta charset="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    <title safe>{title}</title>
                    <link
                        rel="preconnect"
                        href="https://s2.coinmarketcap.com"
                    />

                    <link rel="icon" href="/public/favicon.ico" />

                    <link
                        rel="preload"
                        href="/public/css/styles.css"
                        as="style"
                    />
                    <link
                        rel="stylesheet"
                        href="/public/css/styles.css"
                        as="style"
                    />

                    <link
                        rel="preload"
                        href="/public/js/htmx.min.js"
                        as="script"
                    />
                    <script src="/public/js/htmx.min.js"></script>

                    <link
                        rel="preload"
                        href="/public/js/hx-ws.min.js"
                        as="script"
                    />
                    <script src="/public/js/hx-ws.min.js"></script>

                    <link
                        rel="preload"
                        href="/public/js/theme-change.js"
                        as="script"
                    />
                    <script src="/public/js/theme-change.js"></script>

                    <link
                        rel="preload"
                        href="/public/dist/scripts.js"
                        as="script"
                    />
                    <script src="/public/dist/scripts.js"></script>

                    <link
                        rel="preload"
                        href="/public/dist/notification-toast.js"
                        as="script"
                    />
                    <script src="/public/dist/notification-toast.js"></script>

                    <link
                        rel="preload"
                        href="/public/dist/copy-to-clipboard.js"
                        as="script"
                    />
                    <script src="/public/dist/copy-to-clipboard.js"></script>

                    <link
                        rel="preload"
                        href="/public/dist/drawer-state.js"
                        as="script"
                    />
                    <script src="/public/dist/drawer-state.js"></script>

                    <link
                        rel="preload"
                        href="/public/dist/dropdown.js"
                        as="script"
                    />
                    <script src="/public/dist/dropdown.js"></script>

                    <link
                        rel="preload"
                        href="/public/dist/signal-board.js"
                        as="script"
                    />
                    <script src="/public/dist/signal-board.js"></script>
                </head>
                <body
                    hx-indicator:inherited=".progress"
                    class="bg-base-200 text-base-content antialiased"
                >
                    <a
                        href="#main-content"
                        class="sr-only focus:not-sr-only focus:absolute focus:inset-s-4 focus:top-4 focus:z-50 focus:rounded-btn focus:bg-base-100 focus:px-4 focus:py-2 focus:shadow-lg"
                    >
                        Skip to content
                    </a>

                    <div class="drawer lg:drawer-open">
                        <input
                            id="left-drawer"
                            type="checkbox"
                            class="drawer-toggle inline"
                        />

                        <div class="drawer-content flex min-h-screen flex-col">
                            <progress class="progress w-full"></progress>
                            <Navbar heading={heading} />
                            <main
                                id="main-content"
                                class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
                            >
                                {children}
                            </main>
                            <footer class="footer footer-center sm:footer-horizontal border-t border-base-300 bg-base-100 px-4 py-6 text-sm text-base-content/70">
                                <aside>
                                    <p>
                                        Copyright © BedokCorp{" "}
                                        {new Date().getFullYear()} · Built with
                                        ❤️ by{" "}
                                        <a
                                            class="link link-hover font-medium"
                                            href="https://sulthonuladib.dev"
                                        >
                                            Sulthonul Adib
                                        </a>
                                    </p>
                                </aside>
                            </footer>
                        </div>

                        <div class="drawer-side is-drawer-close:overflow-visible z-30">
                            <label
                                for="left-drawer"
                                class="drawer-overlay"
                                aria-label="Close menu"
                            ></label>
                            <Sidebar />
                        </div>
                    </div>

                    {/* Assignment manager: a centered modal with a fixed header and a
              scrollable body. `max-w-3xl!` overrides daisyUI's modal-box width. */}
                    <dialog
                        id="coin_assignment_dialog"
                        class="modal modal-middle"
                        aria-labelledby="coin_assignment_header"
                    >
                        <div class="modal-box flex max-w-3xl! flex-col overflow-hidden">
                            <header class="flex items-center gap-3 border-b border-base-300 pb-4">
                                <div
                                    id="coin_assignment_header"
                                    class="flex min-w-0 flex-1 items-center gap-3"
                                >
                                    <h2 class="text-lg font-semibold">
                                        Assignments
                                    </h2>
                                </div>
                                <span
                                    id="coin-assignment-indicator"
                                    class="htmx-indicator loading loading-spinner loading-sm"
                                ></span>
                                <form method="dialog">
                                    <button
                                        type="submit"
                                        class="btn btn-square btn-ghost btn-sm"
                                        aria-label="Close assignments"
                                    >
                                        <XIcon />
                                    </button>
                                </form>
                            </header>
                            <div
                                id="coin_assignment_panel"
                                class="min-h-0 flex-1 overflow-y-auto pt-4"
                            ></div>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button>close</button>
                        </form>
                    </dialog>

                    <div
                        id="toast-container"
                        class="toast toast-end toast-bottom z-50"
                    ></div>
                </body>
            </html>
        </>
    );
};
