import React from "react"
import { Box } from "./ui"

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
  <Box
    sx={{
      width: width,
      height: height,
      background: "black",
      my: 1,
      ...style,
    }}
  />
)
