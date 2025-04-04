import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import { IPoint, pointsToSvgPath, tryFindStraightPath } from "./Connection"
import {
  simplifySvgPath,
  removeDuplicatePoints,
  parseSvgPath,
  calculateInnerMidpoints,
  getMarkerSegmentPath,
} from "@/utils/edgeUtils"

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
  // Refs for dragging adjustments.
  const draggingIndexRef = useRef<number>()
  const dragOffsetRef = useRef<IPoint>({ x: 0, y: 0 })

  const { handleDelete } = useToolbar({ id })
  const [edgePopoverAnchor, setEdgePopoverAnchor] =
    useState<HTMLElement | null>(null)
  const { updateEdge, getNode } = useReactFlow()

  const { markerPadding, markerEnd, strokeDashArray } =
    getEdgeMarkerStyles(type)
  const padding = markerPadding ?? MARKER_PADDING

  // Adjust source and target coordinates based on positions and paddings.
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

  // Generate the smooth step edge path.
  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.targetX,
    targetY: adjustedTargetCoordinates.targetY,
    targetPosition,
    borderRadius: STEP_BOARDER_RADIUS,
  })

  // Toolbar position computed from adjusted coordinates.
  const toolbarPosition = getToolbarPosition(
    adjustedSourceCoordinates,
    adjustedTargetCoordinates
  )

  const handleEditIconClick = (event: React.MouseEvent<HTMLElement>) => {
    setEdgePopoverAnchor(event.currentTarget)
  }

  // Calculate edge labels for source and target.
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

  // Attempt to compute a straight path (if the nodes are aligned appropriately).
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
    },
    padding
  )

  //Create a basePath that uses the straightPath if available, otherwise the edgePath.
  const basePath = straightPath !== null ? straightPath : edgePath

  //Compute the default points based on the current basePath.
  const computedPoints = useMemo(() => {
    const simplifiedPath = simplifySvgPath(basePath)
    const parsed = parseSvgPath(simplifiedPath)
    return removeDuplicatePoints(parsed)
  }, [basePath])

  //Maintain customPoints for any user adjustments (during dragging).
  const [customPoints, setCustomPoints] = useState<IPoint[]>([])

  //When edgePath changes (nodes are dragged), clear customPoints.
  useEffect(() => {
    if (customPoints.length > 0) {
      setCustomPoints([])
    }
  }, [edgePath])

  //Active points: use customPoints if available; otherwise, use computedPoints.
  const activePoints = customPoints.length ? customPoints : computedPoints

  //Generate the current SVG path based on activePoints.
  const currentPath = pointsToSvgPath(activePoints)
  const midpoints = calculateInnerMidpoints(activePoints)
  const markerSegmentPath = getMarkerSegmentPath(
    activePoints,
    padding,
    targetPosition
  )

  const handlePointerDown = (event: React.MouseEvent, index: number) => {
    const currentMidpoint = midpoints[index]
    const offsetX = event.clientX - currentMidpoint.x
    const offsetY = event.clientY - currentMidpoint.y
    draggingIndexRef.current = index
    dragOffsetRef.current = { x: offsetX, y: offsetY }
    document.addEventListener("pointermove", handlePointerMove)
    document.addEventListener("pointerup", handlePointerUp, { once: true })
  }

  const handlePointerMove = useCallback(
    (event: MouseEvent) => {
      const draggingIndex = draggingIndexRef.current
      if (draggingIndex === undefined) return

      const newX = event.clientX - dragOffsetRef.current.x
      const newY = event.clientY - dragOffsetRef.current.y

      // Assuming the relevant segment is between points (draggingIndex+1) and (draggingIndex+2)
      const startIdx = draggingIndex + 1
      const endIdx = draggingIndex + 2
      const newPoints = [...activePoints]
      const linePosition =
        newPoints[startIdx].x === newPoints[endIdx].x
          ? "vertical"
          : "horizontal"
      if (linePosition === "horizontal") {
        newPoints[startIdx] = { x: newPoints[startIdx].x, y: newY }
        newPoints[endIdx] = { x: newPoints[endIdx].x, y: newY }
      } else if (linePosition === "vertical") {
        newPoints[startIdx] = { x: newX, y: newPoints[startIdx].y }
        newPoints[endIdx] = { x: newX, y: newPoints[endIdx].y }
      }
      // Update customPoints to reflect the drag adjustment.
      setCustomPoints(newPoints)
      updateEdge(id, { data: { ...data, customPoints: newPoints } })
    },
    [activePoints, updateEdge, id, data]
  )

  const handlePointerUp = useCallback(() => {
    draggingIndexRef.current = undefined
    document.removeEventListener("pointermove", handlePointerMove)
  }, [handlePointerMove])

  return (
    <>
      <g className="edge-container">
        {/* Render the visible edge */}
        <BaseEdge
          id={id}
          path={currentPath}
          markerEnd={markerEnd}
          pointerEvents="none"
          strokeDasharray={strokeDashArray}
        />

        {/* Invisible overlay for pointer events */}
        <path
          className="edge-overlay"
          d={currentPath}
          fill="none"
          strokeWidth={12}
          pointerEvents="stroke"
        />

        {type !== "ClassBidirectional" && (
          <path
            className="edge-marker-highlight"
            d={markerSegmentPath}
            fill="none"
            strokeWidth={12}
            pointerEvents="stroke"
          />
        )}

        {midpoints.map((point, idx) => (
          <circle
            className="edge-circle"
            pointerEvents="all"
            key={idx}
            cx={point.x}
            cy={point.y}
            r={10}
            fill="lightgray"
            stroke="none"
            style={{ cursor: "grab" }}
            onPointerDown={(e) => handlePointerDown(e, idx)}
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
