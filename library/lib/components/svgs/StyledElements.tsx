import { LINE_WIDTH } from "@/constants"
import React from "react"

export const StyledRect: React.FC<React.SVGProps<SVGRectElement>> = ({
  stroke = "var(--apollon2-primary-contrast)",
  fill = "var(--apollon2-background)",
  ...props
}) => {
  return (
    <rect stroke={stroke} fill={fill} strokeWidth={LINE_WIDTH} {...props} />
  )
}
