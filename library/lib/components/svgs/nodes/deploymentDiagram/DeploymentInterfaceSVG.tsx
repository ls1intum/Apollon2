import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"
import { DefaultNodeProps } from "@/types"
import { getCustomColorsFromData } from "@/utils/layoutUtils"

interface Props extends SVGComponentProps {
  data: DefaultNodeProps
}

export const DeploymentInterfaceSVG: React.FC<Props> = ({
  id,
  width,
  height,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  data,
}) => {
  const { name } = data
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const nodeScore = assessments[id]?.score
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)
  const { fillColor, strokeColor, textColor } = getCustomColorsFromData(data)

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
          stroke={strokeColor}
          fill={fillColor}
        />

        {/* Name Text */}
        <CustomText
          x={width + 2}
          y={-10}
          textAnchor="start"
          fontWeight="bold"
          dominantBaseline="hanging"
          fill={textColor}
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
