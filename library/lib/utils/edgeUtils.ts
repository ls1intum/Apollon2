import { Position } from "@xyflow/react";

/**
 * Adjusts the target coordinates based on the position and marker padding.
 *
 * @param targetX - X coordinate of the target
 * @param targetY - Y coordinate of the target
 * @param targetPosition - Position of the target (left, right, top, bottom)
 * @param markerPadding - Padding to adjust the position
 * @returns Adjusted targetX and targetY
 */
export const adjustEdgeCoordinates = (
  targetX: number,
  targetY: number,
  targetPosition: Position,
  markerPadding: number
): { targetX: number; targetY: number } => {
  if (targetPosition === "left") {
    targetX -= markerPadding;
  } else if (targetPosition === "right") {
    targetX += markerPadding;
  } else if (targetPosition === "top") {
    targetY -= markerPadding;
  } else if (targetPosition === "bottom") {
    targetY += markerPadding;
  }
  return { targetX, targetY };
};
