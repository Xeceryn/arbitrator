/** Presentation only: every action URL and follow-up request lives in HTML. */
type RequestDetail = {
    ctx: {
        sourceElement: HTMLElement;
        target?: Element | string;
        response?: { status: number };
        confirm?: string;
    };
    issueRequest?: () => void;
    dropRequest?: () => void;
};

function requestDetail(event: Event): RequestDetail {
    return (event as CustomEvent<RequestDetail>).detail;
}

function closePopover(source: Element) {
    source.closest<HTMLElement>("[popover]")?.hidePopover();
}

function restoreFocusOnClose(dialog: HTMLDialogElement, source: HTMLElement) {
    const popover = source.closest<HTMLElement>("[popover]");
    const popoverId = popover?.id;
    const dialogId = source.dataset.openDialog;
    const action = source.getAttribute("hx-get");
    dialog.addEventListener(
        "close",
        () => {
            if (source.hasAttribute("aria-expanded"))
                source.setAttribute("aria-expanded", "false");
            // Saves replace rows/identity headers. Find their live equivalent
            // after the swap instead of focusing the detached original opener.
            const equivalent = [
                ...document.querySelectorAll<HTMLElement>("[data-open-dialog]"),
            ].find(
                (candidate) =>
                    candidate.dataset.openDialog === dialogId &&
                    candidate.getAttribute("hx-get") === action &&
                    candidate.getClientRects().length > 0,
            );
            const target =
                source.isConnected && source.getClientRects().length > 0
                    ? source
                    : (equivalent ??
                      (popoverId
                          ? document.querySelector<HTMLElement>(
                                `[popovertarget="${CSS.escape(popoverId)}"]`,
                            )
                          : null));
            target?.focus({ preventScroll: true });
        },
        { once: true },
    );
}

document.addEventListener("htmx:before:request", (event) => {
    const { ctx } = requestDetail(event);
    const source = ctx.sourceElement;
    const id = source.dataset.openDialog;
    if (!id) return;
    const dialog = document.getElementById(id);
    if (!(dialog instanceof HTMLDialogElement)) return;
    const content = dialog.querySelector("[data-dialog-content]");
    const loading = dialog.querySelector<HTMLTemplateElement>(
        "[data-dialog-loading]",
    );
    if (content && loading)
        content.replaceChildren(loading.content.cloneNode(true));
    closePopover(source);
    restoreFocusOnClose(dialog, source);
    if (source.hasAttribute("aria-expanded"))
        source.setAttribute("aria-expanded", "true");
    dialog.showModal();
    dialog.setAttribute("aria-busy", "true");
});

document.addEventListener("htmx:after:swap", (event) => {
    const { ctx } = requestDetail(event);
    const target =
        typeof ctx.target === "string"
            ? document.querySelector(ctx.target)
            : ctx.target;
    if (!target) return;
    const dialog = target.closest("dialog");
    dialog?.removeAttribute("aria-busy");
    const focus =
        target.querySelector<HTMLElement>("[data-autofocus]") ??
        (ctx.sourceElement.dataset.openDialog
            ? target.querySelector<HTMLElement>(
                  "input:not([type=hidden]), select",
              )
            : null);
    if (!dialog || dialog.open) focus?.focus({ preventScroll: true });
    filterAssignments();
});

document.addEventListener("htmx:finally:request", (event) => {
    const { ctx } = requestDetail(event);
    const id = ctx.sourceElement.dataset.openDialog;
    if (id) {
        const dialog = document.getElementById(id);
        dialog?.removeAttribute("aria-busy");
        const message = dialog?.querySelector("[data-load-message]");
        if (message) {
            message.textContent =
                "Unable to load. Close this dialog and try again.";
            message.parentElement?.querySelector(".loading")?.remove();
        }
    }
    if (
        ctx.sourceElement instanceof HTMLInputElement &&
        ctx.sourceElement.hasAttribute("data-saved-checked")
    ) {
        ctx.sourceElement.dataset.savedChecked = String(
            ctx.sourceElement.checked,
        );
    }
});

document.addEventListener("htmx:error", (event) => {
    const { ctx } = requestDetail(event);
    const input = ctx.sourceElement;
    if (
        input instanceof HTMLInputElement &&
        input.hasAttribute("data-saved-checked")
    ) {
        input.checked = input.dataset.savedChecked === "true";
    }
    document.body.dispatchEvent(
        new CustomEvent("make-toast", {
            bubbles: true,
            detail: {
                level: "error",
                message:
                    "Connection lost. Your change was not saved. Try again.",
            },
        }),
    );
});

document.addEventListener("htmx:confirm", (event) => {
    const detail = requestDetail(event);
    const source = detail.ctx.sourceElement;
    const dialog = document.getElementById("confirm-removal");
    if (
        !(dialog instanceof HTMLDialogElement) ||
        !detail.issueRequest ||
        !detail.dropRequest
    )
        return;
    event.preventDefault();
    if (dialog.open) {
        detail.dropRequest();
        return;
    }
    const title = dialog.querySelector("#confirm-removal-title");
    const description = dialog.querySelector("#confirm-removal-description");
    const confirm =
        dialog.querySelector<HTMLButtonElement>('[value="confirm"]');
    if (title)
        title.textContent = source.dataset.confirmTitle ?? "Remove assignment?";
    if (description)
        description.textContent =
            detail.ctx.confirm ?? "This cannot be undone.";
    if (confirm)
        confirm.textContent =
            source.dataset.confirmLabel ?? "Remove assignment";
    closePopover(source);
    restoreFocusOnClose(dialog, source);
    dialog.returnValue = "cancel";
    dialog.addEventListener(
        "close",
        () => {
            if (dialog.returnValue === "confirm" && source.isConnected)
                detail.issueRequest?.();
            else detail.dropRequest?.();
        },
        { once: true },
    );
    dialog.showModal();
});

document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (target.closest("[popover] button, [popover] a")) closePopover(target);
});

function filterAssignments() {
    const input = document.getElementById("assignment-filter");
    if (!(input instanceof HTMLInputElement)) return;
    const query = input.value.trim().toLowerCase();
    let total = 0;
    let shown = 0;
    document
        .querySelectorAll<HTMLElement>("[data-assignment-name]")
        .forEach((row) => {
            total++;
            row.hidden = !(row.dataset.assignmentName ?? "").includes(query);
            if (!row.hidden) shown++;
        });
    const empty = document.getElementById("assignment-no-match");
    if (empty) empty.hidden = total === 0 || shown > 0;
}

document.addEventListener("input", (event) => {
    if (
        event.target instanceof HTMLElement &&
        event.target.id === "assignment-filter"
    )
        filterAssignments();
});

document.body.addEventListener(
    "assignment-exchange-removed",
    filterAssignments,
);
