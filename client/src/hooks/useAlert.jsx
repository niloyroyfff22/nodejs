import { useState } from "preact/hooks";
import AlertModal from "../components/AlertModal";

export function useAlert() {
    const [alert, setAlert] = useState({
        open: false,
        title: "",
        message: ""
    });

    function show(message, title = "Alert") {
        setAlert({
            open: true,
            title,
            message
        });
    }

    function close() {
        setAlert(prev => ({ ...prev, open: false }));
    }

    const AlertComponent = (
        <AlertModal
            open={alert.open}
            title={alert.title}
            message={alert.message}
            onClose={close}
        />
    );

    return { show, AlertComponent };
}
