import { ClassNodeElement } from "@/types"
import { CustomText } from "./CustomText"
import { FC } from "react"
import AssessmentIcon from "../AssessmentIcon"
import { FeedbackDropzone } from "@/components/wrapper/FeedbackDropzone"
import { AssessmentSelectableElement } from "@/components/AssessmentSelectableElement"

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
          <AssessmentSelectableElement
            key={item.id}
            elementId={item.id}
            width={width}
            itemHeight={itemHeight}
            yOffset={y}
          >
            <FeedbackDropzone elementId={item.id}>
              <rect
                x={0}
                y={y}
                width={width}
                height={itemHeight}
                fill="transparent"
              />
              <CustomText
                x={padding}
                y={15 + index * itemHeight}
                dominantBaseline="middle"
                textAnchor="start"
                font={font}
              >
                {item.name}
              </CustomText>
            </FeedbackDropzone>
            {showAssessmentResults && typeof item.score === "number" && (
              <AssessmentIcon score={item.score} x={iconX} y={iconY} />
            )}
          </AssessmentSelectableElement>
        )
      })}
    </g>
  )
}
