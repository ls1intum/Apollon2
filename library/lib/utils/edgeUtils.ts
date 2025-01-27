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
