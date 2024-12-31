import React from "react"

interface DividerProps {
  style?: React.CSSProperties
}

export const Divider: React.FC<DividerProps> = ({ style }) => {
  return (
    <div
      style={{
        height: "2px",
        width: "100%",
        backgroundColor: "#000",
        ...style,
      }}
    />
  )
}
