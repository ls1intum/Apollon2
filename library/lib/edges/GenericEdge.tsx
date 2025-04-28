import { useCallback, useMemo, useEffect, useRef, useState } from "react"
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
  getPositionOnCanvas,
} from "@/utils"
import { useToolbar } from "@/hooks"
import { ExtendedEdgeProps } from "./EdgeProps"
import { CustomEdgeToolbar } from "@/components"
import { getEdgeMarkerStyles } from "@/utils"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

// Extend the props to include markerEnd and markerPadding.
import { IPoint, pointsToSvgPath, tryFindStraightPath } from "./Connection"
import { useReconnect } from "@/hooks/useReconnect"
import {
  simplifySvgPath,
  removeDuplicatePoints,
  parseSvgPath,
  calculateInnerMidpoints,
  getMarkerSegmentPath,
  findClosestHandle,
} from "@/utils/edgeUtils"

export const GenericEdge = ({
  id,
  type,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceHandleId,
  targetHandleId,
  data,
}: ExtendedEdgeProps) => {
  // Refs for dragging adjustments to minimize re-renders
  const draggingIndexRef = useRef<number | null>(null)
  const dragOffsetRef = useRef<IPoint>({ x: 0, y: 0 })
  const isReconnectingRef = useRef<boolean>(false)
  const reconnectOffsetRef = useRef<IPoint>({ x: 0, y: 0 })
  const reconnectingEndRef = useRef<"source" | "target" | null>(null)

  const { handleDelete } = useToolbar({ id })
  const [edgePopoverAnchor, setEdgePopoverAnchor] =
    useState<HTMLElement | null>(null)

  const interactiveElementId = useDiagramStore(
    useShallow((state) => state.interactiveElementId)
  )
  const selected = interactiveElementId === id
  const { getNode, getEdges, screenToFlowPosition, getNodes } = useReactFlow()
  const [customPoints, setCustomPoints] = useState<IPoint[]>([])
  const { onReconnect } = useReconnect()
  const setEdges = useDiagramStore((state) => state.setEdges)

  const { markerPadding, markerEnd, strokeDashArray } =
    getEdgeMarkerStyles(type)
  const padding = markerPadding ?? MARKER_PADDING

  // Memoize expensive computations with careful dependency tracking
  const sourceNode = getNode(source)!
  const targetNode = getNode(target)!
  const allNodes = getNodes()

  const sourceAbsolutePosition = useMemo(() => {
    if (!sourceNode) return { x: sourceX, y: sourceY }
    return getPositionOnCanvas(sourceNode, allNodes)
  }, [sourceNode, allNodes, sourceX, sourceY])

  const targetAbsolutePosition = useMemo(() => {
    if (!targetNode) return { x: targetX, y: targetY }
    return getPositionOnCanvas(targetNode, allNodes)
  }, [targetNode, allNodes, targetX, targetY])

  // Attempt to compute a straight path
  const straightPathPoints = tryFindStraightPath(
    {
      position: { x: sourceAbsolutePosition.x, y: sourceAbsolutePosition.y },
      width: sourceNode.width ?? 100,
      height: sourceNode.height ?? 160,
      direction: sourcePosition,
    },
    {
      position: { x: targetAbsolutePosition.x, y: targetAbsolutePosition.y },
      width: targetNode.width ?? 100,
      height: targetNode.height ?? 160,
      direction: targetPosition,
    },
    padding
  )

  // Adjust source and target coordinates
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

  // Generate the smooth step edge path
  const [edgePath] = getSmoothStepPath({
    sourceX: adjustedSourceCoordinates.sourceX,
    sourceY: adjustedSourceCoordinates.sourceY,
    sourcePosition,
    targetX: adjustedTargetCoordinates.targetX,
    targetY: adjustedTargetCoordinates.targetY,
    targetPosition,
    borderRadius: STEP_BOARDER_RADIUS,
  })
  // Toolbar position
  const toolbarPosition = getToolbarPosition(
    adjustedSourceCoordinates,
    adjustedTargetCoordinates
  )

  // Create a basePath that uses the straightPath if available, otherwise the edgePath
  const basePath = useMemo(
    () =>
      straightPathPoints !== null
        ? pointsToSvgPath(straightPathPoints)
        : edgePath,
    [straightPathPoints, edgePath]
  )

  // Compute the default points based on the current basePath
  const computedPoints = useMemo(() => {
    const simplifiedPath = simplifySvgPath(basePath)
    const parsed = parseSvgPath(simplifiedPath)
    return removeDuplicatePoints(parsed)
  }, [basePath])

  // When edgePath changes (nodes are dragged), clear customPoints
  useEffect(() => {
    if (customPoints.length > 0) {
      setCustomPoints([])
    }
  }, [edgePath])

  // Active points: use customPoints if available; otherwise, use computedPoints
  const activePoints = useMemo(
    () => (customPoints.length ? customPoints : computedPoints),
    [customPoints, computedPoints]
  )

  const currentPath = useMemo(
    () => pointsToSvgPath(activePoints),
    [activePoints]
  )
  const midpoints = useMemo(
    () => calculateInnerMidpoints(activePoints),
    [activePoints]
  )
  const markerSegmentPath = useMemo(
    () => getMarkerSegmentPath(activePoints, padding, targetPosition),
    [activePoints, padding, targetPosition, type]
  )
  const fullHighlightPath = useMemo(() => {
    return `${currentPath} ${markerSegmentPath}`
  }, [currentPath, markerSegmentPath])

  const finalPointsRef = useRef<IPoint[]>([])
  const handlePointerDown = useCallback(
    (event: React.PointerEvent, index: number) => {
      const currentMidpoint = midpoints[index]
      const offsetX = event.clientX - currentMidpoint.x
      const offsetY = event.clientY - currentMidpoint.y
      draggingIndexRef.current = index
      dragOffsetRef.current = { x: offsetX, y: offsetY }

      const handlePointerMove = (moveEvent: PointerEvent) => {
        if (draggingIndexRef.current === null) return

        const newX = moveEvent.clientX - dragOffsetRef.current.x
        const newY = moveEvent.clientY - dragOffsetRef.current.y

        const startIdx = draggingIndexRef.current + 1
        const endIdx = draggingIndexRef.current + 2
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

        // Update both the state and the ref
        setCustomPoints(newPoints)
        finalPointsRef.current = newPoints
      }
      const currentEdges = getEdges()
      // Find this edge in the current edges
      const currentEdge = currentEdges.find((edge) => edge.id === id)
      const handlePointerUp = () => {
        if (finalPointsRef.current.length > 0) {
          if (currentEdge) {
            const updatedEdge = {
              ...currentEdge,
              data: {
                ...currentEdge.data,
                points: finalPointsRef.current,
              },
            }
            setEdges((edges) =>
              edges.map((edge) => (edge.id === id ? updatedEdge : edge))
            )
          }
        }

        draggingIndexRef.current = null
        document.removeEventListener("pointermove", handlePointerMove)
      }

      document.addEventListener("pointermove", handlePointerMove)
      document.addEventListener("pointerup", handlePointerUp, { once: true })
    },
    [midpoints, activePoints, id, data, setEdges]
  )

  // Memoized drop position getter
  const getDropPosition = useCallback(
    (event: PointerEvent) => {
      return screenToFlowPosition(
        { x: event.clientX, y: event.clientY },
        { snapToGrid: false }
      )
    },
    [screenToFlowPosition]
  )
  const handleEndpointPointerDown = useCallback(
    (e: React.PointerEvent, endType: "source" | "target") => {
      if (straightPathPoints === null) return
      e.stopPropagation()

      isReconnectingRef.current = true
      reconnectingEndRef.current = endType

      const endpoint =
        endType === "source"
          ? activePoints[0]
          : activePoints[activePoints.length - 1]

      reconnectOffsetRef.current = {
        x: e.clientX - endpoint.x,
        y: e.clientY - endpoint.y,
      }

      document.addEventListener("pointermove", handleEndpointPointerMove)
      document.addEventListener("pointerup", handleEndpointPointerUp, {
        once: true,
      })
    },
    [
      straightPathPoints,
      activePoints,
      source,
      target,
      sourceHandleId,
      targetHandleId,
      sourceNode,
      targetNode,
      id,
      onReconnect,
      getEdges,
      getDropPosition,
    ]
  )

  const handleEndpointPointerMove = (moveEvent: PointerEvent) => {
    if (!isReconnectingRef.current) return

    const endpoint = screenToFlowPosition({
      x: moveEvent.clientX,
      y: moveEvent.clientY,
    })

    const newPoints = [...activePoints]

    if (reconnectingEndRef.current === "source") {
      newPoints[0] = endpoint
    } else {
      newPoints[newPoints.length - 1] = endpoint
    }

    setCustomPoints(newPoints)
  }
  useEffect(() => {
    if (data?.points) {
      setCustomPoints(data.points)
    }
  }, [data?.points])

  const handleEndpointPointerUp = (upEvent: PointerEvent) => {
    const isReconnectingSource = reconnectingEndRef.current === "source"

    isReconnectingRef.current = false
    document.removeEventListener("pointermove", handleEndpointPointerMove)
    document.removeEventListener("pointerup", handleEndpointPointerUp)

    const dropPosition = getDropPosition(upEvent)

    const nodes = getNodes()

    const nodeAtPosition = nodes.find((node) => {
      const x = node.position?.x || 0
      const y = node.position?.y || 0
      const width = node.width || 100
      const height = node.height || 160

      return (
        dropPosition.x > x &&
        dropPosition.x < x + width &&
        dropPosition.y > y &&
        dropPosition.y < y + height
      )
    })

    // If not hovering over a node, abort reconnection
    if (!nodeAtPosition) {
      reconnectingEndRef.current = null
      setCustomPoints([]) // Reset custom points
      return
    }

    const newHandle = findClosestHandle(dropPosition, {
      x: nodeAtPosition.position.x,
      y: nodeAtPosition.position.y,
      width: nodeAtPosition.width!,
      height: nodeAtPosition.height!,
    })

    const newConnection = isReconnectingSource
      ? {
          source: nodeAtPosition.id,
          target: target,
          sourceHandle: newHandle,
          targetHandle: targetHandleId as string,
        }
      : {
          source: source,
          target: nodeAtPosition.id,
          sourceHandle: sourceHandleId as string,
          targetHandle: newHandle,
        }

    const oldEdge = getEdges().find((edge) => edge.id === id)
    if (oldEdge) {
      onReconnect(oldEdge, newConnection)
    }

    reconnectingEndRef.current = null
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

  const sourcePoint = activePoints[0]
  const targetPoint = activePoints[activePoints.length - 1]

  return (
    <>
      <g className="edge-container">
        <BaseEdge
          id={id}
          path={currentPath}
          markerEnd={isReconnectingRef.current ? undefined : markerEnd}
          pointerEvents="none"
          style={{
            stroke: isReconnectingRef.current ? "#b1b1b7" : "black",
            strokeDasharray: isReconnectingRef.current ? "0" : strokeDashArray,
          }}
        />

        <path
          className="edge-overlay"
          d={fullHighlightPath}
          fill="none"
          strokeWidth={12}
          pointerEvents="stroke"
          style={{
            opacity: isReconnectingRef.current ? 0 : 0.4,
          }}
        />

        {/* Source endpoint marker grab - for reconnecting the source end */}
        <circle
          className="source-edge-marker-grab"
          cx={sourcePoint.x}
          cy={sourcePoint.y}
          r={20}
          fill="transparent"
          pointerEvents="all"
          onPointerDown={(e) => handleEndpointPointerDown(e, "source")}
          style={{ cursor: "all-scroll" }}
        />

        {/* Target endpoint marker grab - for reconnecting the target end */}
        <circle
          className="target-edge-marker-grab"
          cx={targetPoint.x}
          cy={targetPoint.y}
          r={20}
          fill="transparent"
          pointerEvents="all"
          onPointerDown={(e) => handleEndpointPointerDown(e, "target")}
          style={{ cursor: "all-scroll" }}
        />

        {midpoints.map((point, midPointIndex) => (
          <circle
            className="edge-circle"
            pointerEvents="all"
            key={`${id}-midpoint-${midPointIndex}`}
            cx={point.x}
            cy={point.y}
            r={10}
            fill="lightgray"
            stroke="none"
            style={{ cursor: "grab" }}
            onPointerDown={(e) => handlePointerDown(e, midPointIndex)}
          />
        ))}
      </g>

      {selected && (
        <CustomEdgeToolbar
          x={toolbarPosition.x}
          y={toolbarPosition.y}
          onEditClick={(event: React.MouseEvent<HTMLElement>) =>
            setEdgePopoverAnchor(event.currentTarget)
          }
          onDeleteClick={handleDelete}
        />
      )}

      <EdgePopover
        source={source}
        target={target}
        edgeId={id}
        selected={selected!}
        anchorEl={edgePopoverAnchor}
        open={Boolean(edgePopoverAnchor)}
        onClose={() => setEdgePopoverAnchor(null)}
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
