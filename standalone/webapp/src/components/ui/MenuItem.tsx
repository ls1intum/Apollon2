import React from "react"

export interface MenuItemProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLLIElement>) => void
  onDoubleClick?: (event: React.MouseEvent<HTMLLIElement>) => void
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
  selected?: boolean
}

export const MenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  onDoubleClick,
  className = "",
  style,
  disabled = false,
  selected = false,
}) => {
  const backgroundColor = selected ? "rgba(25, 118, 210, 0.08)" : "transparent"

  return (
    <li
      className={`menu-item ${className}`}
      onClick={disabled ? undefined : onClick}
      onDoubleClick={disabled ? undefined : onDoubleClick}
      style={{
        listStyle: "none",
        display: "flex",
        alignItems: "center",
        padding: "6px 16px",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? "rgba(0, 0, 0, 0.26)" : "rgba(0, 0, 0, 0.87)",
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
        minHeight: "48px",
        transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        backgroundColor,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !selected) {
          e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.04)"
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = backgroundColor
        }
      }}
    >
      {children}
    </li>
  )
}
