import {
  MARKER_PADDING,
  DOTTED_ARROW_MARKER_PADDING,
  ARROW_MARKER_PADDING,
  RHOMBUS_MARKER_PADDING,
  TRIANGLE_MARKER_PADDING,
} from "@/constants"
import { Position } from "@xyflow/react"
/**
 * Adjusts the target coordinates based on the position and marker padding.
 *
 * @param targetX - X coordinate of the target
 * @param targetY - Y coordinate of the target
 * @param targetPosition - Position of the target (left, right, top, bottom)
 * @param targetPadding - Padding to adjust the position
 * @returns Adjusted targetX and targetY
 */
export const adjustTargetCoordinates = (
  targetX: number,
  targetY: number,
  targetPosition: Position,
  markerPadding: number
): { targetX: number; targetY: number } => {
  console.log(targetX, targetY, markerPadding, targetPosition)
  if (targetPosition === "left") {
    targetX -= markerPadding
  } else if (targetPosition === "right") {
    targetX += markerPadding
  } else if (targetPosition === "top") {
    targetY -= markerPadding
  } else if (targetPosition === "bottom") {
    targetY += markerPadding
  }
  return { targetX, targetY }
}

/**
 * Adjusts the source coordinates based on the position and marker padding.
 *
 * @param sourceX - X coordinate of the source
 * @param sourceY - Y coordinate of the source
 * @param sourcePosition - Position of the source (left, right, top, bottom)
 * @param sourcePadding - Padding to adjust the position
 * @returns Adjusted sourceX and sourceY
 */
export const adjustSourceCoordinates = (
  sourceX: number,
  sourceY: number,
  sourcePosition: Position,
  sourcePadding: number
): { sourceX: number; sourceY: number } => {
  if (sourcePosition === "left") {
    sourceX += sourcePadding
  } else if (sourcePosition === "right") {
    sourceX -= sourcePadding
  } else if (sourcePosition === "top") {
    sourceY += sourcePadding
  } else if (sourcePosition === "bottom") {
    sourceY -= sourcePadding
  }
  return { sourceX, sourceY }
}

/**
 * Calculates the toolbar position based on the source and target coordinates.
 *
 * @param adjustedSourceCoordinates - The source coordinates with properties `sourceX` and `sourceY`.
 * @param adjustedTargetCoordinates - The target coordinates with properties `targetX` and `targetY`.
 * @returns The toolbar position with `x` and `y` properties.
 */
export function getToolbarPosition(
  adjustedSourceCoordinates: { sourceX: number; sourceY: number },
  adjustedTargetCoordinates: { targetX: number; targetY: number }
): { x: number; y: number } {
  const x =
    (adjustedSourceCoordinates.sourceX + adjustedTargetCoordinates.targetX) /
      2 +
    40
  const y =
    (adjustedSourceCoordinates.sourceY + adjustedTargetCoordinates.targetY) /
      2 -
    80

  return { x, y }
}

interface TextPlacement {
  roleX: number
  roleY: number
  multiplicityX: number
  multiplicityY: number
}

export const calculateTextPlacement = (
  x: number,
  y: number,
  position: Position
): TextPlacement => {
  let roleX = x,
    roleY = y
  let multiplicityX = x,
    multiplicityY = y

  switch (position) {
    case "top":
      roleX = x - 10 // Shift role slightly to the left
      roleY = y - 15 // Move role above the marker
      multiplicityX = x + 10 // Shift multiplicity to the right
      multiplicityY = y - 15 // Keep multiplicity above the marker
      break
    case "right":
      roleX = x + 15 // Move role to the right
      roleY = y - 10 // Place role above the marker
      multiplicityX = x + 15 // Move multiplicity to the right
      multiplicityY = y + 15 // Place multiplicity below the marker
      break
    case "bottom":
      roleX = x - 10 // Shift role slightly to the left
      roleY = y + 15 // Move role below the marker
      multiplicityX = x + 10 // Shift multiplicity to the right
      multiplicityY = y + 15 // Keep multiplicity below the marker
      break
    case "left":
      roleX = x - 15 // Move role to the left
      roleY = y - 10 // Place role above the marker
      multiplicityX = x - 15 // Move multiplicity to the left
      multiplicityY = y + 15 // Place multiplicity below the marker
      break
  }

  return {
    roleX,
    roleY,
    multiplicityX,
    multiplicityY,
  }
}

export const calculateEdgeLabels = (
  x: number,
  y: number,
  Position: Position
): {
  roleX: number
  roleY: number
  multiplicityX: number
  multiplicityY: number
} => {
  let roleX = x
  let roleY = y
  let multiplicityX = x
  let multiplicityY = y
  if (Position === "left") {
    roleX = x - 8 // Move role to the left
    roleY = y - 10 // Place role above the marker
    multiplicityX = x - 8 // Move multiplicity to the left
    multiplicityY = y + 18 // Place multiplicity below the marker
  } else if (Position === "right") {
    roleX = x + 8 // Move role to the right
    roleY = y - 10 // Place role above the marker
    multiplicityX = x + 8 // Move multiplicity to the right
    multiplicityY = y + 18 // Place multiplicity below the marker
  } else if (Position === "top") {
    roleX = x - 10 // Shift role slightly to the left
    roleY = y - 3 // Move role below the marker
    multiplicityX = x + 10 // Shift multiplicity to the right
    multiplicityY = y - 3 // Keep multiplicity below the marker
  } else if (Position === "bottom") {
    roleX = x - 10 // Move role to the left
    roleY = y + 10 // Place role above the marker
    multiplicityX = x + 10 // Move multiplicity to the left
    multiplicityY = y + 10 // Place multiplicity below the marker
  }
  return { roleX, roleY, multiplicityX, multiplicityY }
}

export interface EdgeMarkerStyles {
  markerEnd?: string
  markerPadding?: number
  strokeDashArray?: string
}

export function getEdgeMarkerStyles(edgeType: string): EdgeMarkerStyles {
  switch (edgeType) {
    case "ClassBidirectional":
      return {
        markerPadding: MARKER_PADDING,
      }
    case "ClassUnidirectional":
      return {
        markerPadding: ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
      }
    case "ClassAggregation":
      return {
        markerPadding: RHOMBUS_MARKER_PADDING,
        markerEnd: "url(#white-rhombus)",
      }
    case "ClassComposition":
      return {
        markerPadding: RHOMBUS_MARKER_PADDING,
        markerEnd: "url(#black-rhombus)",
      }
    case "ClassInheritance":
      return {
        markerPadding: TRIANGLE_MARKER_PADDING,
        markerEnd: "url(#white-triangle)",
      }
    case "ClassDependency":
      return {
        markerPadding: DOTTED_ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "8",
      }
    case "ClassRealization":
      return {
        markerPadding: TRIANGLE_MARKER_PADDING,
        markerEnd: "url(#white-triangle)",
        strokeDashArray: "8",
      }
    default:
      return {
        markerPadding: MARKER_PADDING,
      }
  }
}
