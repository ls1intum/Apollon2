import { CustomText, StyledRect } from "@/components"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"
import { ReachabilityGraphMarkingProps } from "@/types"
import { getCustomColorsFromData } from "@/index"

type ReachabilityGraphMarkingSVGProps = SVGComponentProps & {
  data: ReachabilityGraphMarkingProps
}

export const ReachabilityGraphMarkingSVG: React.FC<
  ReachabilityGraphMarkingSVGProps
> = ({
  id,
  width,
  height,
  data,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
}) => {
  const { name, isInitialMarking } = data
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const nodeScore = assessments[id]?.score
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  const { fillColor, strokeColor, textColor } = getCustomColorsFromData(data)

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <g>
        <StyledRect
          x={0}
          y={0}
          width={width}
          height={height}
          rx={10}
          ry={10}
          fill={fillColor}
          stroke={strokeColor}
        />

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="hanging"
          fill={textColor}
        >
          {name}
        </CustomText>

        {isInitialMarking && (
          <polyline
            points="-50,-50 -5,-5"
            strokeWidth="1"
            color={strokeColor}
            markerEnd="url(#black-arrow)"
            stroke={strokeColor}
            fill="none"
          />
        )}
      </g>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
