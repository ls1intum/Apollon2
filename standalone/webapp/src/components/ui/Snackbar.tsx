import React from "react"

export interface SnackbarProps {
  open: boolean
  onClose: () => void
  autoHideDuration?: number
  message?: React.ReactNode
  children?: React.ReactNode
  anchorOrigin?: {
    vertical: "top" | "bottom"
    horizontal: "left" | "center" | "right"
  }
  className?: string
  style?: React.CSSProperties
}

export interface SnackbarOrigin {
  vertical: "top" | "bottom"
  horizontal: "left" | "center" | "right"
}

export const Snackbar: React.FC<SnackbarProps> = ({
  open,
  onClose,
  autoHideDuration = 6000,
  message,
  children,
  anchorOrigin = { vertical: "bottom", horizontal: "left" },
  className = "",
  style,
}) => {
  React.useEffect(() => {
    if (open && autoHideDuration) {
      const timer = setTimeout(onClose, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [open, autoHideDuration, onClose])

  if (!open) {
    return null
  }

  const getPositionStyles = () => {
    const styles: React.CSSProperties = {
      position: "fixed",
      zIndex: 1400,
    }

    switch (anchorOrigin.vertical) {
      case "top":
        styles.top = "24px"
        break
      case "bottom":
        styles.bottom = "24px"
        break
    }

    switch (anchorOrigin.horizontal) {
      case "left":
        styles.left = "24px"
        break
      case "center":
        styles.left = "50%"
        styles.transform = "translateX(-50%)"
        break
      case "right":
        styles.right = "24px"
        break
    }

    return styles
  }

  return (
    <div
      className={`snackbar ${className}`}
      style={{
        ...getPositionStyles(),
        ...style,
      }}
    >
      <div
        style={{
          backgroundColor: "#323232",
          color: "white",
          borderRadius: "4px",
          padding: "6px 16px",
          display: "flex",
          alignItems: "center",
          minWidth: "288px",
          maxWidth: "568px",
          boxShadow:
            "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
        }}
      >
        {children || message}
      </div>
    </div>
  )
}
