import {
  MARKER_PADDING,
  DOTTED_ARROW_MARKER_PADDING,
  ARROW_MARKER_PADDING,
  RHOMBUS_MARKER_PADDING,
  TRIANGLE_MARKER_PADDING,
} from "@/constants"
import { IPoint } from "@/edges/Connection"
import { Position, Rect, XYPosition } from "@xyflow/react"
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
        strokeDashArray: "0",
      }
    case "ClassUnidirectional":
      return {
        markerPadding: ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "0",
      }
    case "ClassAggregation":
      return {
        markerPadding: RHOMBUS_MARKER_PADDING,
        markerEnd: "url(#white-rhombus)",
        strokeDashArray: "0",
      }
    case "ClassComposition":
      return {
        markerPadding: RHOMBUS_MARKER_PADDING,
        markerEnd: "url(#black-rhombus)",
        strokeDashArray: "0",
      }
    case "ClassInheritance":
      return {
        markerPadding: TRIANGLE_MARKER_PADDING,
        markerEnd: "url(#white-triangle)",
        strokeDashArray: "0",
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
        strokeDashArray: "0",
      }
  }
}

function distance(p1: XYPosition, p2: XYPosition): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
}

export function findClosestHandle(point: XYPosition, rect: Rect): string {
  const points: { label: string; position: XYPosition }[] = [
    { label: "top-left", position: { x: rect.x + rect.width / 3, y: rect.y } },
    { label: "top", position: { x: rect.x + rect.width / 2, y: rect.y } },
    {
      label: "top-right",
      position: { x: rect.x + (2 / 3) * rect.width, y: rect.y },
    },

    {
      label: "bottom-left",
      position: { x: rect.x + rect.width / 3, y: rect.y + rect.height },
    },
    {
      label: "bottom",
      position: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
    },
    {
      label: "bottom-right",
      position: { x: rect.x + (2 / 3) * rect.width, y: rect.y + rect.height },
    },

    { label: "left-top", position: { x: rect.x, y: rect.y + rect.height / 3 } },
    { label: "left", position: { x: rect.x, y: rect.y + rect.height / 2 } },
    {
      label: "left-bottom",
      position: { x: rect.x, y: rect.y + (2 / 3) * rect.height },
    },

    {
      label: "right-top",
      position: { x: rect.x + rect.width, y: rect.y + rect.height / 3 },
    },
    {
      label: "right",
      position: { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
    },
    {
      label: "right-bottom",
      position: { x: rect.x + rect.width, y: rect.y + (2 / 3) * rect.height },
    },
  ]

  let closest = points[0]
  let minDist = distance(point, points[0].position)

  for (const p of points) {
    const d = distance(point, p.position)
    if (d < minDist) {
      minDist = d
      closest = p
    }
  }

  return closest.label
}

export function simplifySvgPath(path: string, decimals: number = 2): string {
  const round = (num: number) => Number(num.toFixed(decimals))

  const withSpaces = path.replace(/([MLQ])(?=[-0-9])/gi, "$1 ")
  const cleaned = withSpaces.replace(/,/g, " ").trim()
  const tokens = cleaned.split(/\s+/)
  const outputTokens: string[] = []
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i].toUpperCase()
    if (token === "M" || token === "L") {
      const x = parseFloat(tokens[i + 1])
      const y = parseFloat(tokens[i + 2])
      if (!isNaN(x) && !isNaN(y)) {
        outputTokens.push(token, round(x).toString(), round(y).toString())
      }
      i += 3
    } else if (token === "Q") {
      const cx = parseFloat(tokens[i + 1])
      const cy = parseFloat(tokens[i + 2])
      const ex = parseFloat(tokens[i + 3])
      const ey = parseFloat(tokens[i + 4])
      if (cx === ex && cy === ey) {
        outputTokens.push("L", round(ex).toString(), round(ey).toString())
      } else {
        outputTokens.push(
          "Q",
          round(cx).toString(),
          round(cy).toString(),
          round(ex).toString(),
          round(ey).toString()
        )
      }
      i += 5
    } else {
      const x = parseFloat(tokens[i])
      const y = parseFloat(tokens[i + 1])
      if (!isNaN(x) && !isNaN(y)) {
        outputTokens.push(round(x).toString(), round(y).toString())
      }
      i += 2
    }
  }
  return outputTokens.join(" ")
}

export function simplifyPoints(points: IPoint[]): IPoint[] {
  if (points.length < 3) return points
  const result: IPoint[] = [points[0]]

  for (let i = 1; i < points.length - 1; i++) {
    const prev = result[result.length - 1]
    const curr = points[i]
    const next = points[i + 1]
    if (prev.x === curr.x && curr.x === next.x) {
      continue
    }
    if (prev.y === curr.y && curr.y === next.y) {
      continue
    }
    result.push(curr)
  }
  result.push(points[points.length - 1])
  return result
}

export function parseSvgPath(path: string): IPoint[] {
  const tokens = simplifySvgPath(path).replace(/,/g, " ").trim().split(/\s+/)
  const points: IPoint[] = []
  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]
    if (token === "M" || token === "L") {
      const x = parseFloat(tokens[i + 1])
      const y = parseFloat(tokens[i + 2])
      if (!isNaN(x) && !isNaN(y)) {
        points.push({ x, y })
      }
      i += 3
    } else {
      const x = parseFloat(tokens[i])
      const y = parseFloat(tokens[i + 1])
      if (!isNaN(x) && !isNaN(y)) {
        points.push({ x, y })
      }
      i += 2
    }
  }
  return simplifyPoints(points)
}

export function calculateInnerMidpoints(
  points: IPoint[],
  decimals: number = 2
): IPoint[] {
  const round = (num: number) => Number(num.toFixed(decimals))
  const midpoints: IPoint[] = []
  if (points.length < 4) return midpoints
  for (let i = 1; i < points.length - 2; i++) {
    const p1 = points[i]
    const p2 = points[i + 1]
    midpoints.push({ x: round((p1.x + p2.x) / 2), y: round((p1.y + p2.y) / 2) })
  }
  return midpoints
}

export function removeDuplicatePoints(points: IPoint[]): IPoint[] {
  if (points.length === 0) return points
  const filtered: IPoint[] = [points[0]]
  for (let i = 1; i < points.length; i++) {
    const prev = filtered[filtered.length - 1]
    const current = points[i]
    if (current.x !== prev.x || current.y !== prev.y) {
      filtered.push(current)
    }
  }
  return filtered
}

export function getMarkerSegmentPath(
  points: IPoint[],
  markerPadding: number,
  targetPosition: "top" | "bottom" | "left" | "right"
  // type: string,
): string {
  if (points.length === 0) return ""

  const lastPoint = points[points.length - 1]
  let extendedX = lastPoint.x
  let extendedY = lastPoint.y
  const offset = markerPadding === -5 ? 0 : markerPadding === 6 ? 10 : 15
  switch (targetPosition) {
    case "top":
      extendedY = lastPoint.y + offset
      break
    case "bottom":
      extendedY = lastPoint.y - offset
      break
    case "left":
      extendedX = lastPoint.x + offset
      break
    case "right":
      extendedX = lastPoint.x - offset
      break
    default:
      break
  }

  return `M ${lastPoint.x} ${lastPoint.y} L ${extendedX} ${extendedY}`
}
