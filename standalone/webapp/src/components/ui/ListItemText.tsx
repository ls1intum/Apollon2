import React from "react"

export interface ListItemTextProps {
  primary?: React.ReactNode
  secondary?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  inset?: boolean
}

export const ListItemText: React.FC<ListItemTextProps> = ({
  primary,
  secondary,
  className = "",
  style,
  children,
  inset = false,
}) => {
  return (
    <div
      className={`list-item-text ${className}`}
      style={{
        flex: "1 1 auto",
        minWidth: 0,
        marginLeft: inset ? 24 : 0,
        ...style,
      }}
    >
      {children && (
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "rgba(0, 0, 0, 0.87)",
            display: "block",
          }}
        >
          {children}
        </span>
      )}
      {primary && (
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "rgba(0, 0, 0, 0.87)",
            display: "block",
          }}
        >
          {primary}
        </span>
      )}
      {secondary && (
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: 400,
            lineHeight: 1.43,
            color: "rgba(0, 0, 0, 0.6)",
            display: "block",
          }}
        >
          {secondary}
        </span>
      )}
    </div>
  )
}
