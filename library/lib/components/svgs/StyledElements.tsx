import { LINE_WIDTH } from "@/constants"
import React from "react"

export const StyledRect: React.FC<React.SVGProps<SVGRectElement>> = (props) => {
  return (
    <rect
      stroke="var(--apollon2-primary-contrast)"
      fill="var(--apollon2-background)"
      strokeWidth={LINE_WIDTH}
      {...props}
    />
  )
}
