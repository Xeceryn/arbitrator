class Toast {
    /**
     * A class representing a Toast notification.
     */
    constructor(
        public level: "info" | "success" | "warning" | "error",
        public message: string,
    ) {}

    private makeToastContainerButton() {
        const toastNotificationContainer = document.createElement("div");
        toastNotificationContainer.classList.add("alert");
        toastNotificationContainer.classList.add(`alert-${this.level}`);
        toastNotificationContainer.addEventListener("click", () =>
            toastNotificationContainer.remove(),
        );
        return toastNotificationContainer;
    }

    private makeToastContentElement() {
        const messageContainer = document.createElement("span");
        messageContainer.textContent = this.message;
        return messageContainer;
    }

    /**
     * Presents the toast notification at the end of the given container.
     */
    show(containerQuerySelector = "#toast-container") {
        const toast = this.makeToastContainerButton();
        const toastContent = this.makeToastContentElement();
        toast.appendChild(toastContent);

        const toastContainer = document.querySelector(containerQuerySelector)!;
        toastContainer.appendChild(toast);

        return toast;
    }
}

type ToastEvent = CustomEvent<{
    level: "info" | "success" | "warning" | "error";
    message: string;
}>;

function onMakeToast(event: ToastEvent) {
    const toast = new Toast(event.detail.level, event.detail.message);
    const showedToast = toast.show();
    showedToast.onclick = () => showedToast.remove();

    setTimeout(() => {
        showedToast.remove();
    }, 4000);
}

// @ts-expect-error idk
document.addEventListener("make-toast", onMakeToast);
