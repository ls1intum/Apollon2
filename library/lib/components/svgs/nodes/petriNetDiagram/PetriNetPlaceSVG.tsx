import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"
import { CustomText } from "../CustomText"
import { LINE_WIDTH } from "@/constants"

interface Props extends SVGComponentProps {
  name: string
  tokens: number
  capacity: number | "Infinity"
}

export const PetriNetPlaceSVG: React.FC<Props> = ({
  id,
  svgAttributes,
  transformScale,
  showAssessmentResults = false,
  name,
  tokens,
  capacity,
  width,
  height,
}) => {
  const assessments = useDiagramStore(useShallow((state) => state.assessments))
  const nodeScore = assessments[id]?.score
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  const centerX = width / 2
  const centerY = height / 2

  const renderTokens = () => {
    if (tokens === 0) return null

    if (tokens <= 5) {
      // Show individual dots for small numbers
      const tokenPositions = []
      if (tokens === 1) {
        tokenPositions.push({ x: centerX, y: centerY })
      } else if (tokens === 2) {
        tokenPositions.push({ x: centerX, y: 13.25 })
        tokenPositions.push({ x: centerX, y: 46.75 })
      } else if (tokens === 3) {
        tokenPositions.push({ x: 15.06, y: 21.37 })
        tokenPositions.push({ x: 44.93, y: 21.37 })
        tokenPositions.push({ x: centerX, y: 47.25 })
      } else if (tokens === 4) {
        tokenPositions.push({ x: centerX, y: 12.25 })
        tokenPositions.push({ x: centerX, y: 47.75 })
        tokenPositions.push({ x: 12.25, y: centerY })
        tokenPositions.push({ x: 47.75, y: centerY })
      } else if (tokens === 5) {
        tokenPositions.push({ x: 19.27, y: 15.24 })
        tokenPositions.push({ x: 40.72, y: 15.24 })
        tokenPositions.push({ x: 47.35, y: 35.64 })
        tokenPositions.push({ x: 12.65, y: 35.64 })
        tokenPositions.push({ x: centerX, y: 48.25 })
      }

      return tokenPositions.map((pos, index) => (
        <circle
          key={index}
          cx={pos.x}
          cy={pos.y}
          r="9.25"
          fill="var(--apollon2-primary-contrast)"
        />
      ))
    } else {
      // Show number for larger values
      return (
        <CustomText fontWeight="bold" x={centerX} y={centerY}>
          {tokens}
        </CustomText>
      )
    }
  }

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <circle
        cx={centerX}
        cy={centerY}
        r={width / 2}
        stroke="var(--apollon2-primary-contrast)"
        fill="var(--apollon2-background)"
        strokeWidth={LINE_WIDTH}
      />

      {typeof capacity === "number" && (
        <CustomText x={width + 8} y={-8} textAnchor="middle">
          C={capacity}
        </CustomText>
      )}

      <CustomText
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontWeight="600"
        dominantBaseline="central"
      >
        {name}
      </CustomText>

      {renderTokens()}

      {showAssessmentResults && (
        <AssessmentIcon x={width - 15} y={-15} score={nodeScore} />
      )}
    </svg>
  )
}
