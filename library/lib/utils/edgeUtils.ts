import { Position } from "@xyflow/react"
import { getPositionOnCanvas } from "./nodeUtils";

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


import { XYPosition, type Edge, type Node } from "@xyflow/react";

/**
 * Calculates the position of an edge on the canvas.
 *
 * @param edge - The edge whose position is to be calculated.
 * @param allNodes - The list of all nodes in the graph.
 * @returns The center position of the edge on the canvas.
 */
export const getEdgePositionOnCanvas = (
  edge: Edge,
  allNodes: Node[]
): XYPosition => {
  const sourceNode = allNodes.find((node) => node.id === edge.source);
  const targetNode = allNodes.find((node) => node.id === edge.target);

  if (!sourceNode || !targetNode) {
    throw new Error(`Source or target node not found for edge ${edge.id}`);
  }

  // Get positions of source and target nodes on the canvas
  const sourcePosition = getPositionOnCanvas(sourceNode, allNodes);
  const targetPosition = getPositionOnCanvas(targetNode, allNodes);

  // Calculate the center of the edge
  const centerX = (sourcePosition.x + targetPosition.x) / 2;
  const centerY = (sourcePosition.y + targetPosition.y) / 2;

  return { x: centerX, y: centerY };
};
