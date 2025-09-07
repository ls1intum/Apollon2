import { IPoint } from "@/edges/types"

export const calculateOffsets = (
  arrowBoxPosition: { x: number; y: number },
  labelBoxPosition: { x: number; y: number },
  arrowDirection: "Up" | "Down" | "Left" | "Right",
  index: number
) => {
  const arrowOffset = {
    x: arrowBoxPosition.x,
    y: arrowBoxPosition.y,
  }

  let labelOffset: { x: number; y: number }

  if (arrowDirection === "Right") {
    // ⟶ messages: stack upward (negative y)
    labelOffset = {
      x: labelBoxPosition.x,
      y: labelBoxPosition.y - index * 16,
    }
  } else if (arrowDirection === "Left") {
    // ⟵ messages: stack downward (positive y)
    labelOffset = {
      x: labelBoxPosition.x,
      y: labelBoxPosition.y + index * 16,
    }
  } else {
    // ↑ or ↓ messages: stack downward (positive y)
    labelOffset = {
      x: labelBoxPosition.x,
      y: labelBoxPosition.y + index * 16,
    }
  }

  return { arrowOffset, labelOffset }
}

interface CalculateMiddleSegmentDirectionProps {
  edgePoints?: IPoint[]
  sourcePosition?: IPoint
  targetPosition?: IPoint
}

export const calculateMiddleSegmentDirection = ({
  edgePoints,
  sourcePosition,
  targetPosition,
}: CalculateMiddleSegmentDirectionProps): {
  isHorizontalEdge: boolean
  direction: "horizontal" | "vertical"
  isVerticalEdge: boolean
} => {
  let isHorizontalEdge = false
  console.log(
    "Edge Points:",
    edgePoints,
    "Source Position:",
    sourcePosition,
    "Target Position:",
    targetPosition
  )
  if (edgePoints && edgePoints.length >= 2) {
    // Find the middle point index
    const middleIndex = Math.floor(edgePoints.length / 2) - 1
    const middlePoint = edgePoints[middleIndex]
    const nextPoint =
      edgePoints[Math.min(middleIndex + 1, edgePoints.length - 1)]

    // If we're at the last point, use the previous point instead
    const referencePoint =
      middleIndex === edgePoints.length - 1
        ? edgePoints[Math.max(middleIndex - 1, 0)]
        : nextPoint

    const dx = Math.abs(referencePoint.x - middlePoint.x)
    const dy = Math.abs(referencePoint.y - middlePoint.y)
    isHorizontalEdge = dx > dy
    console.log(
      "Edge Points:",
      edgePoints,
      "Middle Index:",
      middleIndex,
      "Middle Point:",
      middlePoint,
      "dx:",
      dx,
      "dy:",
      dy
    )
  } else if (sourcePosition && targetPosition) {
    // Fallback to source/target comparison if no points available
    const dx = Math.abs(targetPosition.x - sourcePosition.x)
    const dy = Math.abs(targetPosition.y - sourcePosition.y)
    isHorizontalEdge = dx > dy
  }
  console.log("isHorizontalEdge:", isHorizontalEdge)
  return {
    isHorizontalEdge,
    direction: isHorizontalEdge ? "horizontal" : "vertical",
    isVerticalEdge: !isHorizontalEdge,
  }
}
