import React, { FC } from "react"
import { Snackbar, SnackbarOrigin } from "../ui"
import { Alert } from "../ui"

interface SnackbarMessageProps {
  open: boolean
  message: string | null
  severity?: "error" | "success" | "warning" | "info"
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void
  autoHideDuration?: number
  anchorOrigin?: SnackbarOrigin
}

export const SnackbarMessage: FC<SnackbarMessageProps> = ({
  open,
  message,
  severity = "error",
  onClose,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: "top", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert onClose={onClose} severity={severity} style={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
