import React from "react"

export interface ToolbarProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  disableGutters?: boolean
}

export const Toolbar: React.FC<ToolbarProps> = ({
  children,
  className = "",
  style,
  disableGutters = false,
}) => {
  return (
    <div
      className={`toolbar ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        padding: disableGutters ? "0" : "0 16px",
        minHeight: "64px",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
