import { LINE_WIDTH } from "@/constants"
import { FC } from "react"

interface SeparationLineProps {
  y: number
  width: number
}

export const SeparationLine: FC<SeparationLineProps> = ({ y, width }) => (
  <line
    x1="0"
    x2={width}
    y1={y}
    y2={y}
    stroke="black"
    strokeWidth={LINE_WIDTH}
  />
)
