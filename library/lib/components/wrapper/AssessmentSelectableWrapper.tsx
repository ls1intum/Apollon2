import React from "react"
import { useAssessmentSelection } from "@/hooks/useAssessmentSelection"

interface AssessmentSelectableWrapperProps {
  elementId: string
  children: React.ReactNode
  asElement?: "div" | "g"
}

/**
 * Wrapper component that adds assessment selection capabilities to any element
 */
export const AssessmentSelectableWrapper: React.FC<
  AssessmentSelectableWrapperProps
> = ({ elementId, children, asElement = "div" }) => {
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

  if (asElement == "g") {
    const gStyle = {
      cursor: "pointer",
      ...(isSelected && {
        stroke: "rgba(25, 118, 210, 0.2)",
      }),
      ...(isHighlighted &&
        !isSelected && {
          stroke: "rgba(25, 118, 210, 0.5)",
        }),
    }

    return (
      <g
        style={gStyle}
        onPointerDown={handleElementClick}
        onMouseEnter={handleElementMouseEnter}
        onMouseLeave={handleElementMouseLeave}
      >
        {children}
      </g>
    )
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
