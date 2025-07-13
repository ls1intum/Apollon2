import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { SVGAttributes } from "react"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

type Props = SVGComponentProps & {
  width: number
  height: number
  name: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
  showAssessmentResults?: boolean
}

export const ActivityObjectNodeSVG: React.FC<Props> = ({
  id,
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
}) => {
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const nodeScore = assessments[id]?.score
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <g>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke="black"
          strokeWidth={LINE_WIDTH}
          fill="white"
        />

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fontWeight="bold"
        >
          {name}
        </CustomText>
      </g>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-5} score={nodeScore} />
      )}
    </svg>
  )
}
