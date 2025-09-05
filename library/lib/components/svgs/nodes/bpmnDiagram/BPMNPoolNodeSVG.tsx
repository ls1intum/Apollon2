import { CustomText, StyledRect } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { SVGComponentProps } from "@/types/SVG"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"

export const BPMNPoolNodeSVG: React.FC<
  SVGComponentProps & { name: string }
> = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  id,
  showAssessmentResults = false,
}) => {
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const nodeScore = assessments[id]?.score
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  const headerWidth = 40

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      {/* Pool outer border */}
      <StyledRect x={0} y={0} width={width} height={height} />

      {/* Pool header separator line */}
      <line
        x1={headerWidth}
        y1={0}
        x2={headerWidth}
        y2={height}
        stroke="var(--apollon-primary-contrast)"
        strokeWidth={LINE_WIDTH}
      />

      {/* Pool name in header */}
      <CustomText
        x={headerWidth / 2}
        y={height / 2}
        textAnchor="middle"
        transform={`rotate(-90, ${headerWidth / 2}, ${height / 2})`}
      >
        {name}
      </CustomText>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
