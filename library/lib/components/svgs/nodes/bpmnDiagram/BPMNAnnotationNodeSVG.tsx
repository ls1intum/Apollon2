import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { SVGComponentProps } from "@/types/SVG"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"

export const BPMNAnnotationNodeSVG: React.FC<
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
        d={`M20,0 L10,0 A 10 10 280 0 0 0 10 L0,${height - 10} A 10 10 180 0 0 10 ${height} L20, ${height}`}
        strokeWidth={LINE_WIDTH}
        stroke="var(--apollon2-primary-contrast)"
        fill="none"
      />
      <CustomText
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        fontWeight="bold"
      >
        {name}
      </CustomText>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
