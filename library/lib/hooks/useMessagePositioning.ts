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
  isHorizontalEdge?: boolean
}

export const useMessagePositioning = (
  displayMessages: MessageData[],
  sourcePosition: { x: number; y: number },
  targetPosition: { x: number; y: number },
  pathMiddlePosition: { x: number; y: number },
  edgePoints?: Array<{ x: number; y: number }> // Add edge points parameter
): MessagePositioningResult => {
  const [isPositioned, setIsPositioned] = useState(false)

  const positioningData = useMemo(() => {
    // Group messages by direction
    const forwardMessages = displayMessages.filter(
      (msg) => msg.direction === "target"
    )
    const backwardMessages = displayMessages.filter(
      (msg) => msg.direction === "source"
    )

    // Calculate edge direction from the middle segment
    const calculateMiddleSegmentDirection = (
      points?: Array<{ x: number; y: number }>,
      fallbackSource?: { x: number; y: number },
      fallbackTarget?: { x: number; y: number }
    ) => {
      let isHorizontalEdge = false
      if (points && points.length >= 2) {
        // Find the middle point index
        const middleIndex = Math.floor(points.length / 2) - 1
        const middlePoint = points[middleIndex]
        const nextPoint = points[Math.min(middleIndex + 1, points.length - 1)]

        // If we're at the last point, use the previous point instead
        const referencePoint =
          middleIndex === points.length - 1
            ? points[Math.max(middleIndex - 1, 0)]
            : nextPoint
        const dx = Math.abs(referencePoint.x - middlePoint.x)
        const dy = Math.abs(referencePoint.y - middlePoint.y)
        isHorizontalEdge = dx > dy
      } else {
        // Fallback to source/target comparison if no points available
        if (fallbackSource && fallbackTarget) {
          const dx = Math.abs(fallbackTarget.x - fallbackSource.x)
          const dy = Math.abs(fallbackTarget.y - fallbackSource.y)
          isHorizontalEdge = dx > dy
        }
      }

      return isHorizontalEdge
    }

    const isHorizontalEdge = calculateMiddleSegmentDirection(
      edgePoints,
      sourcePosition,
      targetPosition
    )

    // Calculate arrow directions based on which node is which relative to the middle
    const sourceIsLeft = sourcePosition.x < targetPosition.x
    const sourceIsAbove = sourcePosition.y < targetPosition.y

    let sourceArrowDirection: ArrowDirection
    let targetArrowDirection: ArrowDirection

    if (isHorizontalEdge) {
      sourceArrowDirection = sourceIsLeft ? "Left" : "Right"
      targetArrowDirection = sourceIsLeft ? "Right" : "Left"
    } else {
      sourceArrowDirection = sourceIsAbove ? "Up" : "Down"
      targetArrowDirection = sourceIsAbove ? "Down" : "Up"
    }

    const calculateRotation = (direction: ArrowDirection): number => {
      switch (direction) {
        case "Right":
          return 0
        case "Left":
          return 180
        case "Down":
          return 90
        case "Up":
          return -90
        default:
          return 0
      }
    }

    const forwardArrowRotation = calculateRotation(targetArrowDirection)
    const backwardArrowRotation = calculateRotation(sourceArrowDirection)

    const baseOffset = 30
    const labelOffset = 25

    // Position labels and arrows based on actual middle segment orientation
    let forwardArrowBoxPosition: { x: number; y: number }
    let forwardLabelBoxPosition: { x: number; y: number }
    let backwardArrowBoxPosition: { x: number; y: number }
    let backwardLabelBoxPosition: { x: number; y: number }

    if (isHorizontalEdge) {
      // Horizontal middle segment: messages above and below
      forwardArrowBoxPosition = { x: 0, y: -baseOffset }
      forwardLabelBoxPosition = { x: labelOffset, y: -baseOffset }

      backwardArrowBoxPosition = { x: 0, y: baseOffset }
      backwardLabelBoxPosition = { x: labelOffset, y: baseOffset }
    } else {
      // Vertical middle segment: messages left and right
      forwardArrowBoxPosition = { x: baseOffset, y: 0 }
      forwardLabelBoxPosition = { x: baseOffset + labelOffset, y: 0 }

      backwardArrowBoxPosition = { x: -baseOffset, y: 0 }
      backwardLabelBoxPosition = { x: -baseOffset - labelOffset, y: 0 }
    }

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
      isHorizontalEdge,
    }
  }, [
    displayMessages,
    sourcePosition,
    targetPosition,
    pathMiddlePosition,
    edgePoints,
  ])

  useEffect(() => {
    if (displayMessages && displayMessages.length > 0) {
      const timeout = setTimeout(() => {
        setIsPositioned(true)
      }, 0)

      return () => clearTimeout(timeout)
    } else {
      setIsPositioned(false)
    }
  }, [
    displayMessages,
    sourcePosition,
    targetPosition,
    pathMiddlePosition,
    edgePoints,
  ])

  return {
    ...positioningData,
    isPositioned,
  }
}
