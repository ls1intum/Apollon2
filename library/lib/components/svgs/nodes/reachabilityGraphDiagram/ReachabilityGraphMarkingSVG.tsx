import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

type ReachabilityGraphMarkingSVGProps = SVGComponentProps & {
  name: string
  isInitialMarking?: boolean
}

export const ReachabilityGraphMarkingSVG: React.FC<
  ReachabilityGraphMarkingSVGProps
> = ({
  id,
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  isInitialMarking,
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
          rx={10}
          ry={10}
        />

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={20}
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="hanging"
        >
          {name}
        </CustomText>

        {isInitialMarking && (
          <polyline
            points="-50,-50 -5,-5"
            strokeWidth="1"
            markerEnd="url(#black-arrow)"
            stroke="black"
            fill="none"
          />
        )}
      </g>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-5} score={nodeScore} />
      )}
    </svg>
  )
}
