import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

export type PackageSVGProps = SVGComponentProps & {
  name: string
}

const leftTopBoxHeight = 10
const padding = 5

export const PackageSVG: React.FC<PackageSVGProps> = ({
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
        {/* Left-Top Box */}
        <rect
          x={0}
          y={0}
          width={40}
          height={leftTopBoxHeight}
          stroke="black"
          strokeWidth={LINE_WIDTH}
          fill="white"
        />

        {/* Main Box */}
        <rect
          x={0}
          y={leftTopBoxHeight}
          width={width}
          height={height - leftTopBoxHeight}
          stroke="black"
          strokeWidth={LINE_WIDTH}
          fill="white"
        />

        {/* Name Text */}
        <CustomText
          x={width / 2}
          y={leftTopBoxHeight + padding}
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="hanging"
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
