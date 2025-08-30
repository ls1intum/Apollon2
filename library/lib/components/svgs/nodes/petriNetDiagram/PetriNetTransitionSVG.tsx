import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"
import { CustomText } from "../CustomText"
import { LINE_WIDTH } from "@/constants"

interface Props extends SVGComponentProps {
  name: string
}

export const PetriNetTransitionSVG: React.FC<Props> = ({
  id,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  width,
  height,
  name,
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
        fill="white"
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />

      <CustomText
        x={width / 2}
        y={-20}
        textAnchor="middle"
        fontWeight="600"
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
