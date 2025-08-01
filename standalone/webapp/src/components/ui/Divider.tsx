import React from "react"

export interface DividerProps {
  orientation?: "horizontal" | "vertical"
  className?: string
  style?: React.CSSProperties
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  className = "",
  style,
}) => {
  const isHorizontal = orientation === "horizontal"

  return (
    <div
      className={`divider divider-${orientation} ${className}`}
      style={{
        border: "none",
        backgroundColor: "rgba(0, 0, 0, 0.12)",
        ...(isHorizontal
          ? { height: "1px", width: "100%", margin: "8px 0" }
          : { width: "1px", height: "100%", margin: "0 8px" }),
        ...style,
      }}
    />
  )
}
