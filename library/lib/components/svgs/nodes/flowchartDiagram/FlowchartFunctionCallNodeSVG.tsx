import { CustomText, StyledRect } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
}
export const FlowchartFunctionCallNodeSVG: React.FC<Props> = ({
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
        {/* Rectangle with double left and right borders for predefined process */}
        <StyledRect x={0} y={0} width={width} height={height} />

        {/* Left vertical line */}
        <line
          x1={10}
          y1={0}
          x2={10}
          y2={height}
          stroke="var(--apollon-primary-contrast)"
          strokeWidth={LINE_WIDTH}
        />

        {/* Right vertical line */}
        <line
          x1={width - 10}
          y1={0}
          x2={width - 10}
          y2={height}
          stroke="var(--apollon-primary-contrast)"
          strokeWidth={LINE_WIDTH}
        />

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="central"
        >
          <tspan x={width / 2} dy="0">
            {name}
          </tspan>
        </CustomText>
      </g>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
