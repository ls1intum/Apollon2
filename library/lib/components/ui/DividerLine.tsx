import React from "react"

interface DividerLineProps {
  width?: string | number
  height?: string | number
  style?: React.CSSProperties
}

export const DividerLine: React.FC<DividerLineProps> = ({
  width = "100%",
  height = "1px",
  style,
}) => (
  <div
    style={{
      width: width,
      height: height,
      background: "var(--apollon2-primary-contrast)",
      margin: "8px 0",
      ...style,
    }}
  />
)
