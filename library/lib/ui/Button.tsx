import React from "react"

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "contained" | "outlined" | "text"
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success"
  size?: "small" | "medium" | "large"
  className?: string
  style?: React.CSSProperties
  type?: "button" | "submit" | "reset"
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = "contained",
  color = "primary",
  size = "medium",
  className = "",
  style = {},
  type = "button",
}) => {
  const baseStyles: React.CSSProperties = {
    padding:
      size === "small"
        ? "4px 8px"
        : size === "large"
          ? "12px 24px"
          : "8px 16px",
    fontSize: size === "small" ? "12px" : size === "large" ? "16px" : "14px",
    border: "none",
    borderRadius: "4px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
    outline: "none",
    opacity: disabled ? 0.6 : 1,
    ...style,
  }

  const getVariantStyles = (): React.CSSProperties => {
    const colors = {
      primary: "#1976d2",
      secondary: "#dc004e",
      error: "#d32f2f",
      warning: "#ed6c02",
      info: "#0288d1",
      success: "#2e7d32",
    }

    const bgColor = colors[color]

    switch (variant) {
      case "contained":
        return {
          backgroundColor: bgColor,
          color: "white",
        }
      case "outlined":
        return {
          backgroundColor: "transparent",
          color: bgColor,
          border: `1px solid ${bgColor}`,
        }
      case "text":
        return {
          backgroundColor: "transparent",
          color: bgColor,
        }
      default:
        return {}
    }
  }

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick()
    }
  }

  return (
    <button
      type={type}
      className={className}
      style={{ ...baseStyles, ...getVariantStyles() }}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
