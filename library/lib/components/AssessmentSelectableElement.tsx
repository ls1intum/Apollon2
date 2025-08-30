import { useAssessmentSelection } from "@/hooks"
import { FC } from "react"

// Assessment selectable wrapper for SVG elements
interface AssessmentSelectableElementProps {
  elementId: string
  width: number
  itemHeight: number
  yOffset?: number
  children: React.ReactNode
}

export const AssessmentSelectableElement: FC<
  AssessmentSelectableElementProps
> = ({ elementId, width, itemHeight, yOffset = 0, children }) => {
  const {
    isSelected,
    isHighlighted,
    showAssessmentInteraction,
    handleElementClick,
    handleElementMouseEnter,
    handleElementMouseLeave,
  } = useAssessmentSelection(elementId)

  if (!showAssessmentInteraction) {
    return <g>{children}</g>
  }

  const handleSVGClick = (e: React.PointerEvent<SVGGElement>) => {
    handleElementClick(e as React.PointerEvent<Element>)
  }

  return (
    <g
      style={{
        cursor: showAssessmentInteraction ? "pointer" : "default",
      }}
      onPointerDown={handleSVGClick}
      onMouseEnter={handleElementMouseEnter}
      onMouseLeave={handleElementMouseLeave}
    >
      {children}
      {/* Selection highlight overlay - rendered after children to be on top */}
      {(isSelected || isHighlighted) && (
        <rect
          x={0}
          y={yOffset}
          width={width}
          height={itemHeight}
          fill={
            isSelected ? "rgba(25, 118, 210, 0.2)" : "rgba(25, 118, 210, 0.1)"
          }
          stroke={isSelected ? "#1976d2" : "rgba(25, 118, 210, 0.5)"}
          strokeWidth={isSelected ? 2 : 1}
          rx={2}
          pointerEvents="none"
        />
      )}
    </g>
  )
}
