import React from "react"
import { useAssessmentSelection } from "@/hooks/useAssessmentSelection"

interface AssessmentSelectableWrapperProps {
  elementId: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Wrapper component that adds assessment selection capabilities to any element
 */
export const AssessmentSelectableWrapper: React.FC<
  AssessmentSelectableWrapperProps
> = ({ elementId, children, style = {} }) => {
  const {
    isSelected,
    isHighlighted,
    showAssessmentInteraction,
    handleElementClick,
    handleElementMouseEnter,
    handleElementMouseLeave,
  } = useAssessmentSelection(elementId)

  if (!showAssessmentInteraction) {
    return <>{children}</>
  }

  const combinedStyle: React.CSSProperties = {
    ...style,
    cursor: "pointer",
    ...(isSelected && {
      backgroundColor: "rgba(25, 118, 210, 0.2)",
      border: "2px solid #1976d2",
    }),
    ...(isHighlighted &&
      !isSelected && {
        backgroundColor: "rgba(25, 118, 210, 0.5)",
        border: "2px solid #1976d2",
      }),
  }

  return (
    <div
      style={combinedStyle}
      onPointerDown={handleElementClick}
      onMouseEnter={handleElementMouseEnter}
      onMouseLeave={handleElementMouseLeave}
    >
      {children}
    </div>
  )
}
