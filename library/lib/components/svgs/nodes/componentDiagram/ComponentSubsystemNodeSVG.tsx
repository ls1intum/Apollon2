import { CustomText, StyledRect } from "@/components"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
  isComponentSubsystemHeaderShown: boolean
}

export const ComponentSubsystemNodeSVG: React.FC<Props> = ({
  id,
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  isComponentSubsystemHeaderShown,
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

        {/* right top book */}
        <g transform={`translate(${width - 32}, 8)`}>
          <path
            d="M 4.8 0 L 24 0 L 24 24 L 4.8 24 L 4.8 19.2 L 0 19.2 L 0 14.4 L 4.8 14.4 L 4.8 9.6 L 0 9.6 L 0 4.8 L 4.8 4.8 Z"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            stroke="var(--apollon2-primary-contrast)"
            fill="var(--apollon2-background)"
          ></path>
          <path
            d="M 4.8 4.8 L 9.6 4.8 L 9.6 9.6 L 4.8 9.6 M 4.8 14.4 L 9.6 14.4 L 9.6 19.2 L 4.8 19.2"
            strokeWidth="1.2"
            strokeMiterlimit="10"
            stroke="var(--apollon2-primary-contrast)"
            fill="none"
          ></path>
        </g>

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={30}
          textAnchor="middle"
          fontWeight="bold"
          dominantBaseline="central"
        >
          {isComponentSubsystemHeaderShown ? (
            <>
              <tspan x={width / 2} dy="-0.6em" fontSize="0.8em">
                {"«subsystem»"}
              </tspan>
              <tspan x={width / 2} dy="1.2em">
                {name}
              </tspan>
            </>
          ) : (
            <tspan x={width / 2} dy="0">
              {name}
            </tspan>
          )}
        </CustomText>
      </g>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
