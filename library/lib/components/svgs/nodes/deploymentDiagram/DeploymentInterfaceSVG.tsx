import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
}

export const DeploymentInterfaceSVG: React.FC<Props> = ({
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
        <circle
          cx={width / 2}
          cy={height / 2}
          r={width / 2}
          strokeWidth={LINE_WIDTH}
          stroke="var(--apollon-primary-contrast)"
          fill="var(--apollon-background)"
        />

        {/* Name Text */}
        <CustomText
          x={width + 2}
          y={-10}
          textAnchor="start"
          fontWeight="bold"
          dominantBaseline="hanging"
        >
          {name}
        </CustomText>
      </g>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
