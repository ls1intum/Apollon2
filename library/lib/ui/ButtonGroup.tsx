import React from "react"

interface ButtonGroupProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  orientation?: "horizontal" | "vertical"
  size?: "small" | "medium" | "large"
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className = "",
  style = {},
  orientation = "horizontal",
}) => {
  const baseStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: orientation === "vertical" ? "column" : "row",
    gap: "1px",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "4px",
    padding: "1px",
    ...style,
  }

  return (
    <div className={`button-group ${className}`} style={baseStyles}>
      {children}
    </div>
  )
}
