import { CustomText, StyledRect } from "@/components"
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
        <StyledRect x={0} y={0} width={width} height={height} />

        {/* Artifact Icon - Document-like representation */}
        <g transform={`translate(${width - 25}, 7)`}>
          <path
            d="M 0 0 L 13 0 L 19.2 7.25 L 19.2 24 L 0 24 L 0 0 Z"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            stroke="var(--apollon2-primary-contrast)"
            fill="var(--apollon2-background)"
          ></path>
          <path
            d="M 13 0 L 13 7.25 L 19.2 7.25"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            stroke="var(--apollon2-primary-contrast)"
            fill="none"
          ></path>
        </g>

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={25}
          textAnchor="middle"
          fontWeight="bold"
          dominantBaseline="middle"
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
