import { useCallback, useEffect, useRef, useState } from "react"
import { BaseEdge, getSmoothStepPath, useReactFlow } from "@xyflow/react"
import { EdgePopover } from "@/components"
import {
  STEP_BOARDER_RADIUS,
  MARKER_PADDING,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import {
  adjustSourceCoordinates,
  adjustTargetCoordinates,
  getToolbarPosition,
  calculateEdgeLabels,
} from "@/utils"
import { useToolbar } from "@/hooks"
import { ExtendedEdgeProps } from "./EdgeProps"
import { CustomEdgeToolbar } from "@/components"
import { getEdgeMarkerStyles } from "@/utils"
import { IPoint, tryFindStraightPath, pointsToSvgPath } from "./Connection"

// Utilss
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
  const tokens = path.replace(/,/g, " ").trim().split(/\s+/)
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
//Utils End

export const GenericEdge = ({
  id,
  selected,
  type,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: ExtendedEdgeProps) => {
  // const {
  //   handleSourceRoleChange,
  //   handleSourceMultiplicityChange,
  //   handleTargetRoleChange,
  //   handleTargetMultiplicityChange,
  //   handleEdgeTypeChange,
  //   handleSwap,
  // } = useEdgePopOver({ id, selected: Boolean(selected) })
  const draggingIndexRef = useRef<number>()
  const dragOffsetRef = useRef<IPoint>({x:0, y:0})
  const { handleDelete } = useToolbar({ id })
  const [edgePopoverAnchor, setEdgePopoverAnchor] =
    useState<HTMLElement | null>(null)
  const { updateEdge, getNode } = useReactFlow()

  const { markerPadding, markerEnd, strokeDashArray } =
    getEdgeMarkerStyles(type)
  const padding = markerPadding ?? MARKER_PADDING
  const adjustedTargetCoordinates = adjustTargetCoordinates(
    targetX,
    targetY,
    targetPosition,
    padding
  )
  const adjustedSourceCoordinates = adjustSourceCoordinates(
    sourceX,
    sourceY,
    sourcePosition,
    SOURCE_CONNECTION_POINT_PADDING
  )

  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.targetX,
    targetY: adjustedTargetCoordinates.targetY,
    targetPosition,
    borderRadius: STEP_BOARDER_RADIUS,
  })

  const toolbarPosition = getToolbarPosition(
    adjustedSourceCoordinates,
    adjustedTargetCoordinates
  )

  const handleEditIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setEdgePopoverAnchor(event.currentTarget)
  }

  const {
    roleX: sourceRoleX,
    roleY: sourceRoleY,
    multiplicityX: sourceMultiplicityX,
    multiplicityY: sourceMultiplicityY,
  } = calculateEdgeLabels(sourceX, sourceY, sourcePosition)

  const {
    roleX: targetRoleX,
    roleY: targetRoleY,
    multiplicityX: targetMultiplicityX,
    multiplicityY: targetMultiplicityY,
  } = calculateEdgeLabels(targetX, targetY, targetPosition)

  const sourceNode = getNode(source)!
  const targetNode = getNode(target)!
  console.log(
    "source, target",
    adjustedSourceCoordinates.sourceX,
    adjustedSourceCoordinates.sourceY,
    adjustedTargetCoordinates.targetX,
    adjustedTargetCoordinates.targetY
  )

  const simplifiedpath = simplifySvgPath(edgePath)
  const straightPath = tryFindStraightPath(
    {
      position: { x: sourceNode.position.x, y: sourceNode.position.y },
      width: sourceNode.width ?? 100,
      height: sourceNode.height ?? 160,
      direction: sourcePosition,
    },
    {
      position: { x: targetNode.position.x, y: targetNode.position.y },
      width: targetNode.width ?? 100,
      height: targetNode.height ?? 160,
      direction: targetPosition,
    }
  )

  //const currentPath = straightPath !== null ? straightPath : edgePath;
  //console.log("Current", currentPath)
  const parsedPath = parseSvgPath(simplifiedpath)
  const initialPoints = removeDuplicatePoints(parsedPath)
  const [points, setPoints] = useState<IPoint[]>(initialPoints)

  //const midpoints = calculateInnerMidpoints(removedPath)
  //console.log("Midpoints", midpoints)

  //console.log("Parsed svg path", parsedPath)
  //console.log("Remove", initialPoints)

  console.log("POINTS", points)

  useEffect(() => {
    const newPoints = removeDuplicatePoints(parseSvgPath(simplifiedpath))
    setPoints(newPoints)
  }, [simplifiedpath])

  const midpoints = calculateInnerMidpoints(points)

  const currentPath =
    straightPath !== null ? straightPath : pointsToSvgPath(points)

  // const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
  //   x: 0,
  //   y: 0,
  // })

  const handleMouseDown = (event: React.MouseEvent, index: number) => {
    console.log("Handle mouse down", event)
    const currentMidpoint = midpoints[index]
    const offsetX = event.clientX - currentMidpoint.x
    const offsetY = event.clientY - currentMidpoint.y

    draggingIndexRef.current = index
    dragOffsetRef.current = { x: offsetX, y: offsetY }
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp, { once: true })
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const draggingIndex = draggingIndexRef.current
      console.log("handle mouse move", event, draggingIndex, dragOffsetRef.current)

      if (draggingIndex === undefined) return
      const newX = event.clientX - dragOffsetRef.current.x
      const newY = event.clientY - dragOffsetRef.current.y
      console.log("new values", newX, newY)
      const startIdx = draggingIndex + 1
      const endIdx = draggingIndex + 2
      const newPoints = [...points]
      const linePosition = newPoints[startIdx].x == newPoints[endIdx].x ? "vertical" : "horizontal"
      switch (linePosition) {
        case 'horizontal':
          newPoints[startIdx] = { x: points[startIdx].x, y: newY }
          newPoints[endIdx] = { x: points[endIdx].x, y: newY }
          break;
        case 'vertical':
          newPoints[startIdx] = { x: newX, y: points[startIdx].y }
          newPoints[endIdx] = { x: newX, y: points[endIdx].y }
          break;
        default:
          break;
      }
      
      setPoints(newPoints)
      console.log("New points", newPoints)
      updateEdge(id, { data: { ...data, customPoints: newPoints } })
    },
    [dragOffsetRef.current, points, updateEdge, id, data]
  )

  const handleMouseUp = useCallback(() => {
    draggingIndexRef.current = undefined
    document.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])
  return (
    <>
    <g className="edge-container">
      {/* Render the visible edge (stays black) */}
      <BaseEdge
        id={id}
        path={currentPath}
        markerEnd={markerEnd}
        pointerEvents="none"
        strokeDasharray={strokeDashArray}
      />

      {/* Invisible overlay to capture pointer events */}
      <path
        className="edge-overlay"
        d={currentPath}
        fill="none"
        strokeWidth={12}
        pointerEvents="stroke"
        style={{ transition: "stroke 0.2s ease-in-out" }}
      />
      {midpoints.map((point, idx) => (
        <circle
          className="edge-handle"
          pointerEvents={"all"}
          key={idx}
          cx={point.x}
          cy={point.y}
          r={10}
          fill="lightgray"
          stroke="none"
          style={{ cursor: "grab" }}
          onMouseDown={(e) => handleMouseDown(e, idx)}
        />
      ))}
    </g>
      {selected && (
        <CustomEdgeToolbar
          x={toolbarPosition.x}
          y={toolbarPosition.y}
          onEditClick={handleEditIconClick}
          onDeleteClick={handleDelete}
        />
      )}

      {/* Render the popover for editing edge properties */}
      <EdgePopover
        source={source}
        target={target}
        edgeId={id}
        selected={Boolean(selected)}
        anchorEl={edgePopoverAnchor}
        open={Boolean(edgePopoverAnchor)}
        onClose={() => {
          setEdgePopoverAnchor(null)
          updateEdge(id, { selected: false })
        }}
      />

      {/* Render labels directly on the SVG */}

      {data?.sourceRole && (
        <text
          x={sourceRoleX}
          y={sourceRoleY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.sourceRole}
        </text>
      )}
      {data?.sourceMultiplicity && (
        <text
          x={sourceMultiplicityX}
          y={sourceMultiplicityY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.sourceMultiplicity}
        </text>
      )}

      {data?.targetRole && (
        <text
          x={targetRoleX}
          y={targetRoleY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.targetRole}
        </text>
      )}
      {data?.targetMultiplicity && (
        <text
          x={targetMultiplicityX}
          y={targetMultiplicityY}
          textAnchor="middle"
          style={{ fontSize: "16px", fill: "black", userSelect: "none" }}
        >
          {data?.targetMultiplicity}
        </text>
      )}
    </>
  )
}
