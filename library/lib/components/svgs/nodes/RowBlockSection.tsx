import { ClassNodeElement } from "@/types"
import { CustomText } from "./CustomText"
import { FC } from "react"
import AssessmentIcon from "../AssessmentIcon"

interface RowBlockSectionProps {
  items: (ClassNodeElement & { score?: number })[]
  padding: number
  itemHeight: number
  width: number
  font: string
  offsetFromTop: number
  showAssessmentResults?: boolean
}
export const RowBlockSection: FC<RowBlockSectionProps> = ({
  items,
  padding,
  itemHeight,
  font,
  offsetFromTop,
  width,
  showAssessmentResults = false,
}) => {
  return (
    <g transform={`translate(0, ${offsetFromTop})`}>
      {items.map((item, index) => {
        const y = index * itemHeight
        const iconY = y - 12
        const iconX = width - 15

        return (
          <g key={item.id} id={item.id}>
            <CustomText
              key={item.id}
              x={padding}
              y={15 + index * itemHeight}
              dominantBaseline="middle"
              textAnchor="start"
              font={font}
            >
              {item.name}
            </CustomText>

            {showAssessmentResults && typeof item.score === "number" && (
              <AssessmentIcon score={item.score} x={iconX} y={iconY} />
            )}
          </g>
        )
      })}
    </g>
  )
}
