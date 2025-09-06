import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { SVGComponentProps } from "@/types/SVG"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"

export const BPMNDataStoreNodeSVG: React.FC<
  SVGComponentProps & { name: string }
> = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  id,
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
      <path
        d={`M 0 10 L 0 ${height - 10} A ${width / 2} 10 0 0 0 ${width} ${
          height - 10
        } L ${width} 10 A ${width / 2} 10 180 0 0 0 10`}
        strokeWidth={LINE_WIDTH}
        stroke="var(--apollon2-primary-contrast)"
        fill="var(--apollon2-background)"
      />
      <path
        d={`M 0 30 A ${width / 2} 10 0 0 0 ${width} 30`}
        strokeWidth={LINE_WIDTH}
        stroke="var(--apollon2-primary-contrast)"
        fill="none"
      />
      <path
        d={`M 0 20 A ${width / 2} 10 0 0 0 ${width} 20`}
        stroke="var(--apollon2-primary-contrast)"
        strokeWidth={LINE_WIDTH}
        fill="none"
      />
      <path
        d={`M 0 10 A ${width / 2} 10 0 0 0 ${width} 10`}
        stroke="var(--apollon2-primary-contrast)"
        strokeWidth={LINE_WIDTH}
        fill="none"
      />
      <CustomText
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontSize={14}
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
