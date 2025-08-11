import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
}

export const DeploymentArtifactSVG: React.FC<Props> = ({
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
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke="black"
          strokeWidth={LINE_WIDTH}
          fill="white"
        />

        {/* Artifact Icon - Document-like representation */}
        <g transform={`translate(${width - 25}, 5)`}>
          <rect
            x="0"
            y="0"
            width="15"
            height="20"
            stroke="black"
            strokeWidth="1"
            fill="white"
          />
          <polygon
            points="15,0 20,5 15,5"
            stroke="black"
            strokeWidth="1"
            fill="white"
          />
          <line x1="2" y1="8" x2="13" y2="8" stroke="black" strokeWidth="0.5" />
          <line
            x1="2"
            y1="12"
            x2="13"
            y2="12"
            stroke="black"
            strokeWidth="0.5"
          />
          <line
            x1="2"
            y1="16"
            x2="10"
            y2="16"
            stroke="black"
            strokeWidth="0.5"
          />
        </g>

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="central"
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
