import type { PropsWithChildren } from "@kitajs/html";

import {
    ChainIcon,
    CoinsIcon,
    ExchangeIcon,
    ServerIcon,
    SignalIcon,
} from "./icons";

/** On the collapsed rail these items show an icon and a tooltip. */
const navItemClass = "is-drawer-close:tooltip is-drawer-close:tooltip-right";

/**
 * A page-level link. These deliberately do **not** use htmx: switching pages is
 * a normal navigation, so the browser loads the full document (layout, navbar,
 * drawer state) instead of swapping `#main-content` in place. Fragments inside a
 * page keep using htmx.
 */
const SideBarItem = ({
    title,
    path,
    children,
}: PropsWithChildren<{ title: string; path: string }>) => (
    <li>
        <a
            href={`/${path}`}
            class={navItemClass}
            data-tip={title}
            onclick="document.getElementById('coin_assignment_dialog')?.close()"
        >
            {children}
            <span class="is-drawer-close:hidden" safe>
                {title}
            </span>
        </a>
    </li>
);

/**
 * The navigation rail. Collapses to icons on desktop (`is-drawer-close`),
 * expands to labels (`is-drawer-open`). The drawer wrapper lives in
 * `BaseLayout`.
 */
export const Sidebar = () => (
    <div class="flex min-h-full flex-col items-start bg-base-100 is-drawer-close:w-14 is-drawer-open:w-64">
        <ul class="menu w-full grow">
            <li>
                <a href="/" class={navItemClass} data-tip="Arbitrator">
                    <img
                        class="mask mask-squircle size-5"
                        src="/public/favicon.ico"
                        alt=""
                    />
                    <span class="is-drawer-close:hidden font-semibold">
                        Arbitrator
                    </span>
                </a>
            </li>
            <SideBarItem title="Cryptocurrency Management" path="coins">
                <CoinsIcon />
            </SideBarItem>
            <SideBarItem title="Exchange Management" path="markets">
                <ExchangeIcon />
            </SideBarItem>
            <SideBarItem title="Worker Orchestration" path="workers">
                <ServerIcon />
            </SideBarItem>
            <SideBarItem title="Signals" path="signals">
                <SignalIcon />
            </SideBarItem>
            <SideBarItem title="Chain Management" path="chain">
                <ChainIcon />
            </SideBarItem>
        </ul>
    </div>
);
