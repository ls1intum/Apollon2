import React from "react"

export interface IconButtonProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  style?: React.CSSProperties
  size?: "small" | "medium" | "large"
  disabled?: boolean
  color?: string
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  className = "",
  style,
  size = "medium",
  disabled = false,
  color = "inherit",
}) => {
  const sizeStyles = {
    small: { padding: "4px", fontSize: "1rem" },
    medium: { padding: "8px", fontSize: "1.25rem" },
    large: { padding: "12px", fontSize: "1.5rem" },
  }

  return (
    <button
      className={`icon-button ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        border: "none",
        background: "transparent",
        borderRadius: "50%",
        cursor: disabled ? "not-allowed" : "pointer",
        color: color === "inherit" ? "inherit" : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        opacity: disabled ? 0.6 : 1,
        ...sizeStyles[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = "transparent"
        }
      }}
    >
      {children}
    </button>
  )
}
