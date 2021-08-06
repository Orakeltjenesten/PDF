import { AlertColor } from "@material-ui/core";
import { createContext , ReactNode, useContext, useState } from "react";

interface AlertContextProps {
    message: string;
    severity: AlertColor;
    visible: boolean;
    showPopup: (message: string, severity: AlertColor) => void;
    hidePopup: () => void;
}

const AlertContext = createContext<AlertContextProps>({message: "", severity: "info", visible: false, showPopup: (message: string, severity: AlertColor) => {}, hidePopup: () => {}});


const AlertContextWrapper = ({children }: {children: ReactNode}) => {
    const [message, setMessage] = useState<string>("");
    const [severity, setSeverity] = useState<AlertColor>("info");
    const [visible, setVisible] = useState<boolean>(false);
    
    function show(message: string, severity: AlertColor) {
        setMessage(message);
        setSeverity(severity);
        setVisible(true);
    }

    function hide() {
        setVisible(false);
    }
    return (
        <AlertContext.Provider value={{message: message, severity: severity, visible: visible, showPopup: show, hidePopup: hide}}>
            {children}
        </AlertContext.Provider>
    )
}

const useAlert = () => {
    const {showPopup, hidePopup} = useContext(AlertContext);
    return {showPopup, hidePopup}
}

const beAlert = () => {
    const {message, severity, visible, hidePopup} = useContext(AlertContext);
    return {message, severity, visible, hidePopup}
}

 
export { AlertContext, AlertContextWrapper, useAlert, beAlert};