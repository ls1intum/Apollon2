import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
}

export const UseCaseActorNodeSVG: React.FC<Props> = ({
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
      viewBox="0 0 90 140"
      overflow="visible"
      {...svgAttributes}
    >
      <g>
        <g strokeWidth={LINE_WIDTH} stroke="black">
          <circle cx="45" cy="25" r="15" fill="white" />
          <line x1="45" y1="40" x2="45" y2="80" />
          <line x1="15" y1="55" x2="75" y2="55" />
          <line x1="45" y1="80" x2="15" y2="110" />
          <line x1="45" y1="80" x2="75" y2="110" />
        </g>

        <CustomText
          x={45}
          y={130}
          textAnchor="middle"
          fontWeight="bold"
          dominantBaseline="middle"
          pointerEvents="none"
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
