import React from "react"

export interface AlertProps {
  severity?: "error" | "warning" | "info" | "success"
  children: React.ReactNode
  onClose?: () => void
  className?: string
  style?: React.CSSProperties
}

export const Alert: React.FC<AlertProps> = ({
  severity = "info",
  children,
  onClose,
  className = "",
  style,
}) => {
  const getBackgroundColor = () => {
    switch (severity) {
      case "error":
        return "#fdeded"
      case "warning":
        return "#fff4e5"
      case "info":
        return "#e3f2fd"
      case "success":
        return "#e8f5e8"
      default:
        return "#e3f2fd"
    }
  }

  const getTextColor = () => {
    switch (severity) {
      case "error":
        return "#5f2120"
      case "warning":
        return "#663c00"
      case "info":
        return "#01579b"
      case "success":
        return "#1e4620"
      default:
        return "#01579b"
    }
  }

  const getBorderColor = () => {
    switch (severity) {
      case "error":
        return "#e57373"
      case "warning":
        return "#ffb74d"
      case "info":
        return "#64b5f6"
      case "success":
        return "#81c784"
      default:
        return "#64b5f6"
    }
  }

  return (
    <div
      className={`alert alert-${severity} ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "6px 16px",
        borderRadius: "4px",
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        border: `1px solid ${getBorderColor()}`,
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
        ...style,
      }}
    >
      <div style={{ flex: 1 }}>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            padding: "4px",
            marginLeft: "12px",
            borderRadius: "4px",
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
