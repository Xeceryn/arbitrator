import { type PropsWithChildren } from "@kitajs/html";

import { SidebarToggleIcon } from "./icons";
import { PageHeading } from "./PageHeading";

export enum ActiveNav {
    Home = "Home",
    Features = "Features",
    Docs = "Docs",
}

const themes = [
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
    "caramellatte",
    "abyss",
    "silk",
];

const ThemeItem = ({ name }: { name: string }) => {
    return (
        <button
            type="button"
            class="outline-base-content text-start outline-offset-4 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-primary theme-changer"
            data-act-class="[&amp;_svg]:visible"
            data-set-theme={name}
        >
            <span
                class="bg-base-100 rounded-btn text-base-content block w-full cursor-pointer font-sans"
                data-theme={name}
            >
                <span class="grid grid-cols-5 grid-rows-3">
                    <span class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            class="invisible h-3 w-3 shrink-0"
                        >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                        </svg>
                        <span class="grow text-sm" safe>
                            {name}
                        </span>
                        <span class="flex h-full shrink-0 flex-wrap gap-1">
                            <span class="bg-primary rounded-badge w-2"></span>
                            <span class="bg-secondary rounded-badge w-2"></span>
                            <span class="bg-accent rounded-badge w-2"></span>
                            <span class="bg-neutral rounded-badge w-2"></span>
                        </span>
                    </span>
                </span>
            </span>
        </button>
    );
};

const ThemeDropdown = () => (
    <details class="dropdown dropdown-end [&:not([open])>.dropdown-content]:hidden">
        <summary class="btn btn-ghost" aria-label="Change theme">
            <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="h-5 w-5 stroke-current"
                aria-hidden="true"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                ></path>
            </svg>
            <span class="hidden font-normal md:inline">Theme</span>
        </summary>
        <ul class="dropdown-content menu bg-base-200 rounded-box z-50 mt-2 max-h-[calc(100vh-6rem)] w-56 flex-nowrap overflow-y-auto border border-base-300 p-2 shadow-2xl">
            {themes.map((theme) => (
                <li>
                    <ThemeItem name={theme} />
                </li>
            ))}
        </ul>
    </details>
);

/**
 * Global top bar. The page heading comes from `BaseLayout`; this is chrome.
 */
export function Navbar({
    heading,
    children,
}: PropsWithChildren<{ heading?: string }> = {}) {
    return (
        <header class="navbar sticky top-0 z-20 min-h-14 gap-2 border-b border-base-300 bg-base-100/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <label
                for="left-drawer"
                aria-label="Toggle sidebar"
                class="btn btn-square btn-ghost drawer-button"
            >
                <SidebarToggleIcon />
            </label>
            <div class="flex flex-1 items-center gap-2">
                {heading ? <PageHeading heading={heading} /> : null}
                {children}
            </div>
            <ThemeDropdown />
        </header>
    );
}
