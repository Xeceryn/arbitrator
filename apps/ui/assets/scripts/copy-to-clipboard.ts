/**
 * Click-to-copy for any element carrying `data-copy`.
 *
 * Uses event delegation so it keeps working after htmx morphs the signal board.
 * The copied value defaults to the element's `data-copy` attribute and falls
 * back to its text content. Keyboard activation (Enter / Space) matches the
 * button role used by the copyable badges.
 */

type ToastLevel = "info" | "success" | "warning" | "error";

function toast(level: ToastLevel, message: string) {
    document.dispatchEvent(
        new CustomEvent("make-toast", { detail: { level, message } }),
    );
}

async function writeClipboard(value: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        // Insecure context or denied permission: fall back to a temp textarea.
        try {
            const textarea = document.createElement("textarea");
            textarea.value = value;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            const ok = document.execCommand("copy");
            textarea.remove();
            return ok;
        } catch {
            return false;
        }
    }
}

async function copyElement(element: HTMLElement): Promise<void> {
    const value = (element.dataset.copy || element.textContent || "").trim();
    if (!value) return;

    if (await writeClipboard(value)) {
        toast("success", `Copied ${value}`);
    } else {
        toast("error", "Copy failed");
    }
}

document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const copyable = target.closest<HTMLElement>("[data-copy]");
    if (!copyable) return;

    void copyElement(copyable);
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches("[data-copy]")) return;

    event.preventDefault();
    void copyElement(target);
});
