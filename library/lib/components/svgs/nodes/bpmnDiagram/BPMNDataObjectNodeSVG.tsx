import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { SVGComponentProps } from "@/types/SVG"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"

export const BPMNDataObjectNodeSVG: React.FC<
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

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <path
        d={`M0,0 L0,${height} L${width},${height} L${width},15 L${width - 15},0 L${width - 15},15 L${width},15 L${width - 15},0 L0,0`}
        strokeWidth={LINE_WIDTH}
        stroke="var(--apollon2-primary-contrast)"
        fill="var(--apollon2-background)"
      />
      <CustomText
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontSize={14}
        dominantBaseline="hanging"
      >
        {name}
      </CustomText>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
