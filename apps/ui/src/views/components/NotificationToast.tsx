type Props = {
    level: "info" | "success" | "warning" | "error";
    message: string;
};

export const NotificationToast = (props: Props) => {
    return (
        <div _="on load wait 1s then remove me" class={`alert alert-secondary`}>
            <span>
                {props.level.toUpperCase() as "safe"}: {props.message as "safe"}
            </span>
        </div>
    );
};
