import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"
import { DefaultNodeProps } from "@/types"

interface ActivityForkNodeHorizontalSVGProps extends SVGComponentProps {
  data: DefaultNodeProps
}

export const ActivityForkNodeHorizontalSVG: React.FC<
  ActivityForkNodeHorizontalSVGProps
> = ({
  id,
  width,
  height,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  data,
}) => {
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const nodeScore = assessments[id]?.score
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  const fillColor = data.fillColor || "var(--apollon2-primary-contrast)"
  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <rect x={0} y={0} width={width} height={height} fill={fillColor} />

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
