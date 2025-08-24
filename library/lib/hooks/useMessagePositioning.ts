import { useMemo, useState, useEffect } from "react"
import { MessageData } from "../edges/EdgeProps"

type ArrowDirection = "Up" | "Down" | "Left" | "Right"

interface MessagePositioningResult {
  forwardMessages: MessageData[]
  backwardMessages: MessageData[]
  sourceArrowDirection: ArrowDirection
  targetArrowDirection: ArrowDirection
  forwardArrowRotation: number
  backwardArrowRotation: number
  forwardArrowBoxPosition: { x: number; y: number }
  forwardLabelBoxPosition: { x: number; y: number }
  backwardArrowBoxPosition: { x: number; y: number }
  backwardLabelBoxPosition: { x: number; y: number }
  isPositioned: boolean
}

/**
 * Custom hook for calculating message positioning logic for communication diagram edges
 * @param displayMessages Array of messages with direction information
 * @param isMiddlePathHorizontal Whether the edge path is horizontal
 * @returns Positioning data for forward and backward messages
 */
export const useMessagePositioning = (
  displayMessages: MessageData[],
  isMiddlePathHorizontal: boolean
): MessagePositioningResult => {
  const [isPositioned, setIsPositioned] = useState(false)

  const positioningData = useMemo(() => {
    // Group messages by direction
    const forwardMessages = displayMessages.filter(
      (msg) => msg.direction === "forward"
    )
    const backwardMessages = displayMessages.filter(
      (msg) => msg.direction === "backward"
    )

    // Direction-based positioning following the old version's logic
    const isHorizontalEdge = isMiddlePathHorizontal
    let sourceArrowDirection: ArrowDirection
    let targetArrowDirection: ArrowDirection
    let forwardArrowRotation = 0
    let backwardArrowRotation = 180

    if (isHorizontalEdge) {
      // Horizontal path: arrows point left/right
      sourceArrowDirection = "Right" // Forward messages (source -> target)
      targetArrowDirection = "Left" // Backward messages (target -> source)
    } else {
      // Vertical path: arrows point up/down
      sourceArrowDirection = "Down" // Forward messages (source -> target)
      targetArrowDirection = "Up" // Backward messages (target -> source)
    }

    const arrowSize = { width: 16, height: 16 }

    let forwardArrowBoxPosition: { x: number; y: number }
    let forwardLabelBoxPosition: { x: number; y: number }
    let backwardArrowBoxPosition: { x: number; y: number }
    let backwardLabelBoxPosition: { x: number; y: number }

    if (sourceArrowDirection === "Right") {
      // Forward: ⟶ messages (horizontal edge, top side)
      forwardArrowBoxPosition = { x: 0, y: -arrowSize.height }
      forwardLabelBoxPosition = { x: 25, y: -arrowSize.height } // 25px offset to the right from arrow
    } else if (sourceArrowDirection === "Down") {
      // Forward: ↓ messages (vertical edge, right side)
      forwardArrowBoxPosition = { x: arrowSize.width, y: 0 }
      forwardLabelBoxPosition = { x: arrowSize.width + 25, y: 0 } // 25px offset to the right from arrow
    } else {
      // sourceArrowDirection === "Up" (this case doesn't exist in current logic, but keeping for completeness)
      // Forward: ↑ messages (vertical edge, left side)
      forwardArrowBoxPosition = { x: -arrowSize.width, y: 0 }
      forwardLabelBoxPosition = { x: -arrowSize.width - 25, y: 0 } // 25px offset to the left from arrow
    }

    if (targetArrowDirection === "Left") {
      // Backward: ⟵ messages (horizontal edge, bottom side)
      backwardArrowBoxPosition = { x: 0, y: arrowSize.height }
      backwardLabelBoxPosition = { x: 25, y: arrowSize.height } // 25px offset to the right from arrow
    } else if (targetArrowDirection === "Up") {
      // Backward: ↑ messages (vertical edge, left side)
      backwardArrowBoxPosition = { x: -arrowSize.width, y: 0 }
      backwardLabelBoxPosition = { x: -arrowSize.width - 25, y: 0 } // 25px offset to the left from arrow
    } else {
      // targetArrowDirection === "Down"
      // Backward: ↓ messages (vertical edge, right side)
      backwardArrowBoxPosition = { x: arrowSize.width, y: 0 }
      backwardLabelBoxPosition = { x: arrowSize.width + 25, y: 0 } // 25px offset to the right from arrow
    }

    forwardArrowRotation =
      sourceArrowDirection === "Right"
        ? 0
        : sourceArrowDirection === "Down"
          ? 90
          : -90

    backwardArrowRotation =
      targetArrowDirection === "Left"
        ? 180
        : targetArrowDirection === "Up"
          ? -90
          : 90

    return {
      forwardMessages,
      backwardMessages,
      sourceArrowDirection,
      targetArrowDirection,
      forwardArrowRotation,
      backwardArrowRotation,
      forwardArrowBoxPosition,
      forwardLabelBoxPosition,
      backwardArrowBoxPosition,
      backwardLabelBoxPosition,
    }
  }, [displayMessages, isMiddlePathHorizontal])

  useEffect(() => {
    if (displayMessages && displayMessages.length > 0) {
      const timeout = setTimeout(() => {
        setIsPositioned(true)
      }, 0)

      return () => clearTimeout(timeout)
    } else {
      setIsPositioned(false)
    }
  }, [displayMessages, isMiddlePathHorizontal])

  return {
    ...positioningData,
    isPositioned,
  }
}
