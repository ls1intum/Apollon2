// connection.ts
/**
 * This file provides a simplified connection path computation.
 * It calculates port positions based solely on a node's width and height.
 */

import { ARROW_MARKER_PADDING, MARKER_PADDING } from "@/constants"
import { Position } from "@xyflow/react"

export interface IPoint {
  x: number
  y: number
}

export interface NodeBounds {
  x: number
  y: number
  width: number
  height: number
}

export function getPortsForElement(
  bounds: NodeBounds
): Record<Position, IPoint> {
  return {
    [Position.Top]: { x: bounds.width / 2, y: 0 },
    [Position.Right]: { x: bounds.width, y: bounds.height / 2 },
    [Position.Bottom]: { x: bounds.width / 2, y: bounds.height },
    [Position.Left]: { x: 0, y: bounds.height / 2 },
  }
}

export function computeOverlap(
  range1: [number, number],
  range2: [number, number]
): [number, number] | null {
  const [from1, to1] = range1
  const [from2, to2] = range2

  const largerFrom = Math.max(from1, from2)
  const smallerTo = Math.min(to1, to2)

  return largerFrom <= smallerTo ? [largerFrom, smallerTo] : null
}

export function pointsToSvgPath(points: IPoint[]): string {
  if (points.length === 0) return ""
  const pathCommands = [`M ${points[0].x} ${points[0].y}`]

  for (let i = 1; i < points.length; i++) {
    pathCommands.push(`L ${points[i].x} ${points[i].y}`)
  }
  return pathCommands.join(" ")
}
export function tryFindStraightPath(
  source: {
    position: { x: number; y: number }
    width: number
    height: number
    direction: Position
  },
  target: {
    position: { x: number; y: number }
    width: number
    height: number
    direction: Position
  },
  targetPadding: number
): IPoint[] | null {
  const offset = targetPadding === MARKER_PADDING ? 0 : targetPadding === ARROW_MARKER_PADDING ? 10 : 15
  const OVERLAP_THRESHOLD = 40
  const sourceHandleEdge = source.direction
  const targetHandleEdge = target.direction

  // Right -> Left case
  if (
    sourceHandleEdge === Position.Right &&
    targetHandleEdge === Position.Left &&
    target.position.x >= source.position.x + source.width
  ) {
    const overlapY = computeOverlap(
      [
        source.position.y,
        source.position.y + Math.max(OVERLAP_THRESHOLD, source.height),
      ],
      [
        target.position.y,
        target.position.y + Math.max(OVERLAP_THRESHOLD, target.height),
      ]
    )

    if (overlapY !== null && overlapY[1] - overlapY[0] >= OVERLAP_THRESHOLD) {
      const middleY = (overlapY[0] + overlapY[1]) / 2
      const start: IPoint = {
        x: source.position.x + source.width,
        y: middleY,
      }
      const end: IPoint = {
        x: target.position.x - offset,
        y: middleY,
      }
      return [start, end]
    }
  }

  // Left -> Right case
  if (
    sourceHandleEdge === Position.Left &&
    targetHandleEdge === Position.Right &&
    source.position.x >= target.position.x + target.width
  ) {
    const overlapY = computeOverlap(
      [
        source.position.y,
        source.position.y + Math.max(OVERLAP_THRESHOLD, source.height),
      ],
      [
        target.position.y,
        target.position.y + Math.max(OVERLAP_THRESHOLD, target.height),
      ]
    )

    if (overlapY !== null && overlapY[1] - overlapY[0] >= OVERLAP_THRESHOLD) {
      const middleY = (overlapY[0] + overlapY[1]) / 2
      const start: IPoint = {
        x: source.position.x,
        y: middleY,
      }

      const end: IPoint = {
        x: target.position.x + target.width + offset,
        y: middleY,
      }
      return [start, end]
    }
  }

  // Bottom -> Top case
  if (
    sourceHandleEdge === Position.Bottom &&
    targetHandleEdge === Position.Top &&
    target.position.y >= source.position.y + source.height
  ) {
    const overlapX = computeOverlap(
      [source.position.x, source.position.x + source.width],
      [target.position.x, target.position.x + target.width]
    )

    if (overlapX !== null && overlapX[1] - overlapX[0] >= OVERLAP_THRESHOLD) {
      const middleX = (overlapX[0] + overlapX[1]) / 2
      const start: IPoint = {
        x: middleX,
        y: source.position.y + source.height,
      }

      const end: IPoint = {
        x: middleX,
        y: target.position.y - offset,
      }
      return [start, end]
    }
  }

  // Top -> Bottom case
  if (
    sourceHandleEdge === Position.Top &&
    targetHandleEdge === Position.Bottom &&
    source.position.y >= target.position.y + target.height
  ) {
    const overlapX = computeOverlap(
      [source.position.x, source.position.x + source.width],
      [target.position.x, target.position.x + target.width]
    )

    if (overlapX !== null && overlapX[1] - overlapX[0] >= OVERLAP_THRESHOLD) {
      const middleX = (overlapX[0] + overlapX[1]) / 2
      const start: IPoint = {
        x: middleX,
        y: source.position.y,
      }

      const end: IPoint = {
        x: middleX,
        y: target.position.y + target.height + offset,
      }
      return [start, end]
    }
  }

  return null
}
