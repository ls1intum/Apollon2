import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
  isComponentHeaderShown: boolean
  stereotype: string
}

export const DeploymentNodeSVG: React.FC<Props> = ({
  id,
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  isComponentHeaderShown,
  stereotype,
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

        {/* Deployment Node Icon - Simple cube representation */}
        <g transform={`translate(${width - 35}, 5)`}>
          <rect
            x="0"
            y="5"
            width="20"
            height="15"
            stroke="black"
            strokeWidth="1"
            fill="white"
          />
          <polygon
            points="20,5 25,0 25,15 20,20"
            stroke="black"
            strokeWidth="1"
            fill="lightgray"
          />
          <polygon
            points="0,5 5,0 25,0 20,5"
            stroke="black"
            strokeWidth="1"
            fill="lightgray"
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
          {isComponentHeaderShown ? (
            <>
              <tspan x={width / 2} dy="-0.6em">
                {`<<${stereotype}>>`}
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
        <AssessmentIcon x={width - 15} y={-5} score={nodeScore} />
      )}
    </svg>
  )
}
