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
        <g>
          {/* Top face */}
          <path
            d={`M 0 8 l 8 -8 H ${width} l -8 8 Z`}
            stroke="black"
            strokeWidth={LINE_WIDTH}
            fill="white"
          />
          {/* Right face */}
          <path
            d={`M ${width} 0 V ${height - 8} l -8 8 V 8 Z`}
            stroke="black"
            strokeWidth={LINE_WIDTH}
            fill="white"
          />
          {/* Front face */}
          <rect
            x="0"
            y="8"
            width={width - 8}
            height={height - 8}
            stroke="black"
            strokeWidth={LINE_WIDTH}
            fill="white"
          />
        </g>

        {/* Name Text */}
        <CustomText
          x="50%"
          y={30}
          textAnchor="middle"
          fontWeight="bold"
          dominantBaseline="middle"
        >
          {isComponentHeaderShown && stereotype.length > 0 ? (
            <>
              <tspan x="50%" dy="-8" fontSize="85%">
                {`«${stereotype}»`}
              </tspan>
              <tspan x="50%" dy="18" textDecoration="underline">
                {name}
              </tspan>
            </>
          ) : (
            <tspan x="50%" dy="0" textDecoration="underline">
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
