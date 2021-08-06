import { Alert, AlertColor, Snackbar } from "@material-ui/core"
import React from "react"
import { AlertContext, AlertContextWrapper, beAlert } from "../hooks/AlertContext"

export const PopupNotification = () => {
    const {message, severity, visible, hidePopup} = beAlert();
    return (
        <AlertContext.Consumer>
            {() => (
                <Snackbar anchorOrigin={{vertical: "bottom", horizontal: "center"}} open={visible} autoHideDuration={5000} onClose={hidePopup}>
                    <Alert severity={severity}>{message}</Alert>
                </Snackbar>
            )}
        </AlertContext.Consumer>
    )
}