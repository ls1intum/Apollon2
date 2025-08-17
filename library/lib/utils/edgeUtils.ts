import {
  MARKER_PADDING,
  DOTTED_ARROW_MARKER_PADDING,
  ARROW_MARKER_PADDING,
  RHOMBUS_MARKER_PADDING,
  TRIANGLE_MARKER_PADDING,
  USECASE_PADDING,
} from "@/constants"
import { IPoint } from "@/edges/Connection"
import { DiagramEdgeType, UMLDiagramType } from "@/typings"
import { Position, Rect, XYPosition, ConnectionLineType } from "@xyflow/react"

/**
 * Adjusts the target coordinates based on the position and marker padding.
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
      roleX = x - 10
      roleY = y - 15
      multiplicityX = x + 10
      multiplicityY = y - 15
      break
    case "right":
      roleX = x + 15
      roleY = y - 10
      multiplicityX = x + 15
      multiplicityY = y + 15
      break
    case "bottom":
      roleX = x - 10
      roleY = y + 15
      multiplicityX = x + 10
      multiplicityY = y + 15
      break
    case "left":
      roleX = x - 15
      roleY = y - 10
      multiplicityX = x - 15
      multiplicityY = y + 15
      break
  }

  return {
    roleX,
    roleY,
    multiplicityX,
    multiplicityY,
  }
}

export const calculateDynamicEdgeLabels = (
  x: number,
  y: number,
  direction: string
) => {
  const offset = 10
  const textOffset = 15

  switch (direction) {
    case "top": {
      const topYOffset = -5
      return {
        roleX: x - offset,
        roleY: y + topYOffset,
        roleTextAnchor: "end" as const,
        multiplicityX: x + offset,
        multiplicityY: y + topYOffset,
        multiplicityTextAnchor: "start" as const,
      }
    }
    case "bottom": {
      const bottomYOffset = textOffset
      return {
        roleX: x - offset,
        roleY: y + bottomYOffset,
        roleTextAnchor: "end" as const,
        multiplicityX: x + offset,
        multiplicityY: y + bottomYOffset,
        multiplicityTextAnchor: "start" as const,
      }
    }
    case "left": {
      const leftXOffset = -5
      return {
        roleX: x + leftXOffset,
        roleY: y - offset,
        roleTextAnchor: "end" as const,
        multiplicityX: x + leftXOffset,
        multiplicityY: y + 20,
        multiplicityTextAnchor: "end" as const,
      }
    }
    case "right": {
      return {
        roleX: x + 5,
        roleY: y - offset,
        roleTextAnchor: "start" as const,
        multiplicityX: x + 5,
        multiplicityY: y + 20,
        multiplicityTextAnchor: "start" as const,
      }
    }
    default: {
      return {
        roleX: x,
        roleY: y - offset,
        roleTextAnchor: "middle" as const,
        multiplicityX: x,
        multiplicityY: y + offset,
        multiplicityTextAnchor: "middle" as const,
      }
    }
  }
}

export interface EdgeMarkerStyles {
  markerEnd?: string
  markerPadding?: number
  strokeDashArray?: string
  offset?: number
}

export function getEdgeMarkerStyles(edgeType: string): EdgeMarkerStyles {
  switch (edgeType) {
    case "ClassBidirectional":
    case "DeploymentAssociation":
      return {
        markerPadding: MARKER_PADDING,
        strokeDashArray: "0",
        offset: 0,
      }
    case "ActivityControlFlow":
    case "ClassUnidirectional":
      return {
        markerPadding: ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "0",
        offset: 11.5,
      }
    case "ClassAggregation":
      return {
        markerPadding: RHOMBUS_MARKER_PADDING,
        markerEnd: "url(#white-rhombus)",
        strokeDashArray: "0",
        offset: 14.5,
      }
    case "ClassComposition":
      return {
        markerPadding: RHOMBUS_MARKER_PADDING,
        markerEnd: "url(#black-rhombus)",
        strokeDashArray: "0",
        offset: 14.5,
      }
    case "ClassInheritance":
      return {
        markerPadding: TRIANGLE_MARKER_PADDING,
        markerEnd: "url(#white-triangle)",
        strokeDashArray: "0",
        offset: 11,
      }
    case "ComponentDependency":
    case "ClassDependency":
    case "DeploymentDependency":
      return {
        markerPadding: DOTTED_ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "8",
        offset: 11.5,
      }
    case "ClassRealization":
      return {
        markerPadding: TRIANGLE_MARKER_PADDING,
        markerEnd: "url(#white-triangle)",
        strokeDashArray: "8",
        offset: 11,
      }
    case "BPMNSequenceFlow":
      return {
        markerPadding: ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "0",
      }
    case "BPMNMessageFlow":
      return {
        markerPadding: ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "8",
      }
    case "BPMNAssociationFlow":
      return {
        markerPadding: MARKER_PADDING,
        strokeDashArray: "8",
      }
    case "BPMNDataAssociationFlow":
      return {
        markerPadding: ARROW_MARKER_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "8",
      }
    case "UseCaseAssociation":
      return {
        markerPadding: 0,
        strokeDashArray: "0",
        offset: 0,
      }
    case "UseCaseInclude":
      return {
        markerPadding: USECASE_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "4",
        offset: 10,
      }
    case "UseCaseExtend":
      return {
        markerPadding: USECASE_PADDING,
        markerEnd: "url(#black-arrow)",
        strokeDashArray: "4",
        offset: 10,
      }
    case "UseCaseGeneralization":
      return {
        markerPadding: USECASE_PADDING,
        markerEnd: "url(#white-triangle)",
        strokeDashArray: "0",
        offset: 10,
      }

    case "ComponentProvidedInterface":
    case "DeploymentProvidedInterface":
      return {
        markerPadding: -2,
        strokeDashArray: "0", // Plain line like association
        offset: 0,
      }
    case "ComponentRequiredInterface":
    case "DeploymentRequiredInterface":
      return {
        markerPadding: 2,
        markerEnd: "url(#required-interface)",
        strokeDashArray: "0",
        offset: 0,
      }
    case "ComponentRequiredQuarterInterface":
    case "DeploymentRequiredQuarterInterface":
      return {
        markerPadding: 2,
        markerEnd: "url(#required-interface-quarter)",
        strokeDashArray: "0",
        offset: 0,
      }
    case "ComponentRequiredThreeQuarterInterface":
    case "DeploymentRequiredThreeQuarterInterface":
      return {
        markerPadding: 2,
        markerEnd: "url(#required-interface-threequarter)",
        strokeDashArray: "0",
        offset: 0,
      }
    default:
      return {
        markerPadding: MARKER_PADDING,
        strokeDashArray: "0",
        offset: 0,
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

export function findClosestHandleForInterface(
  point: XYPosition,
  rect: Rect
): string {
  const points: { label: string; position: XYPosition }[] = [
    { label: "top", position: { x: rect.x + rect.width / 2, y: rect.y } },

    {
      label: "bottom",
      position: { x: rect.x + rect.width / 2, y: rect.y + rect.height },
    },

    { label: "left", position: { x: rect.x, y: rect.y + rect.height / 2 } },

    {
      label: "right",
      position: { x: rect.x + rect.width, y: rect.y + rect.height / 2 },
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

/**
 * Helper function to get handle position on ellipse perimeter
 */
export function getEllipseHandlePosition(
  centerX: number,
  centerY: number,
  radiusX: number,
  radiusY: number,
  handle: string
): { x: number; y: number } {
  const angleMap: { [key: string]: number } = {
    right: 0,
    "bottom-right": Math.PI / 4,
    bottom: Math.PI / 2,
    "bottom-left": (3 * Math.PI) / 4,
    left: Math.PI,
    "top-left": (5 * Math.PI) / 4,
    top: (3 * Math.PI) / 2,
    "top-right": (7 * Math.PI) / 4,
  }

  const angle = angleMap[handle] ?? 0

  return {
    x: centerX + radiusX * Math.cos(angle),
    y: centerY + radiusY * Math.sin(angle),
  }
}

export function calculateOverlayPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  type: string
): string {
  if (
    type == "UseCaseInclude" ||
    type == "UseCaseExtend" ||
    type == "UseCaseGeneralization"
  ) {
    const { offset } = getEdgeMarkerStyles(type)
    const markerOffset = offset ?? 0
    const dx = targetX - sourceX
    const dy = targetY - sourceY
    const length = Math.sqrt(dx * dx + dy * dy)

    const normalizedDx = dx / length
    const normalizedDy = dy / length
    const adjustedTargetX = targetX + normalizedDx * markerOffset
    const adjustedTargetY = targetY + normalizedDy * markerOffset
    return `M ${sourceX},${sourceY} L ${adjustedTargetX},${adjustedTargetY}`
  }
  return `M ${sourceX},${sourceY} L ${targetX},${targetY}`
}

export function calculateStraightPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  type: string
): string {
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const length = Math.sqrt(dx * dx + dy * dy)

  if (length === 0) {
    return `M ${sourceX},${sourceY} L ${targetX},${targetY}`
  }

  if (type === "UseCaseInclude" || type == "UseCaseExtend") {
    const startX = sourceX
    const startY = sourceY
    const endX = targetX
    const endY = targetY
    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    const normalizedDx = dx / length
    const normalizedDy = dy / length
    const gapSize = 40

    const gapStartX = midX - normalizedDx * gapSize
    const gapStartY = midY - normalizedDy * gapSize
    const gapEndX = midX + normalizedDx * gapSize
    const gapEndY = midY + normalizedDy * gapSize

    return `M ${startX},${startY} L ${gapStartX},${gapStartY} M ${gapEndX},${gapEndY} L ${endX},${endY}`
  }

  // For all other edge types, just create a straight line
  return `M ${sourceX},${sourceY} L ${targetX},${targetY}`
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
  offset: number,
  targetPosition: "top" | "bottom" | "left" | "right"
): string {
  if (points.length === 0) return ""

  const lastPoint = points[points.length - 1]
  let extendedX = lastPoint.x
  let extendedY = lastPoint.y
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

export const getDefaultEdgeType = (
  diagramType: UMLDiagramType
): DiagramEdgeType => {
  switch (diagramType) {
    case "ClassDiagram":
    case "BPMN":
      return "ClassUnidirectional"
    case "ActivityDiagram":
      return "ActivityControlFlow"

    case "UseCaseDiagram":
      return "UseCaseAssociation"
    case "ComponentDiagram":
      return "ComponentDependency"
    case "DeploymentDiagram":
      return "DeploymentAssociation"
    default:
      return "ClassUnidirectional"
  }
}

/**
 * Determines the appropriate connection line type based on the diagram type
 * @param diagramType - The type of diagram being rendered
 * @returns The corresponding ConnectionLineType
 */
export function getConnectionLineType(
  diagramType: UMLDiagramType
): ConnectionLineType {
  switch (diagramType) {
    case "UseCaseDiagram":
      return ConnectionLineType.Straight

    default:
      return ConnectionLineType.Step
  }
}
