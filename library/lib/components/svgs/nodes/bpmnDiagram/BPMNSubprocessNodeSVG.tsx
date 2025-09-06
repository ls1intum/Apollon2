import { CustomText, StyledRect } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { useDiagramStore } from "@/store"
import { SVGComponentProps } from "@/types/SVG"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"

export const BPMNSubprocessNodeSVG: React.FC<
  SVGComponentProps & {
    name: string
    variant?: "subprocess" | "transaction" | "call"
  }
> = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  variant = "subprocess",
  id,
  showAssessmentResults = false,
}) => {
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const nodeScore = assessments[id]?.score
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)
  const isTransaction = variant === "transaction"
  const isCall = variant === "call"
  const isSubprocess = !isTransaction && !isCall

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      {/* Transaction: double border */}
      {isTransaction && (
        <>
          <StyledRect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={10}
            ry={10}
          />
          <StyledRect
            x={3}
            y={3}
            width={width - 6}
            height={height - 6}
            rx={7}
            ry={7}
          />
        </>
      )}
      {/* Call Activity: single thick border */}
      {isCall && (
        <StyledRect
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={LINE_WIDTH * 3}
          rx={10}
          ry={10}
        />
      )}
      {/* Subprocess: single border + plus box */}
      {isSubprocess && (
        <>
          <StyledRect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={10}
            ry={10}
          />
          {/* Plus box marker */}
          <rect
            x={width / 2 - 7}
            y={height - 14}
            width={14}
            height={14}
            fill="none"
            stroke="var(--apollon2-primary-contrast)"
          />
          <line
            x1={width / 2 - 4}
            y1={height - 7}
            x2={width / 2 + 4}
            y2={height - 7}
            stroke="var(--apollon2-primary-contrast)"
          />
          <line
            x1={width / 2}
            y1={height - 11}
            x2={width / 2}
            y2={height - 3}
            stroke="var(--apollon2-primary-contrast)"
          />
        </>
      )}
      <CustomText
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        fontWeight="bold"
      >
        {name}
      </CustomText>

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
