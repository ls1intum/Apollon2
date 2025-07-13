import { useDiagramStore } from "@/store"
import { SVGAttributes } from "react"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

export type ActivityInitialNodeSVGProps = SVGComponentProps & {
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
  showAssessmentResults?: boolean
}

export const ActivityInitialNodeSVG: React.FC<ActivityInitialNodeSVGProps> = ({
  id,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  width,
  height,
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
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="black"
        rx={width / 2}
        ry={height / 2}
      />

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-5} score={nodeScore} />
      )}
    </svg>
  )
}
