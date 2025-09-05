import { LINE_WIDTH } from "@/constants"
import React from "react"

export const StyledRect: React.FC<React.SVGProps<SVGRectElement>> = (props) => {
  return (
    <rect
      stroke="var(--apollon-primary-contrast)"
      fill="var(--apollon-background)"
      strokeWidth={LINE_WIDTH}
      {...props}
    />
  )
}
