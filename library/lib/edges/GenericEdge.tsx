import { useCallback, useMemo, useEffect, useRef, useState } from "react"
import { BaseEdge, getSmoothStepPath, useReactFlow } from "@xyflow/react"
import {
  STEP_BOARDER_RADIUS,
  MARKER_PADDING,
  SOURCE_CONNECTION_POINT_PADDING,
} from "@/constants"
import {
  adjustSourceCoordinates,
  adjustTargetCoordinates,
  getPositionOnCanvas,
} from "@/utils"
import { useToolbar } from "@/hooks"
import { ExtendedEdgeProps } from "./EdgeProps"
import { CustomEdgeToolbar } from "@/components"
import { getEdgeMarkerStyles } from "@/utils"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { IPoint, pointsToSvgPath, tryFindStraightPath } from "./Connection"
import { useReconnect } from "@/hooks/useReconnect"
import {
  simplifySvgPath,
  removeDuplicatePoints,
  parseSvgPath,
  calculateInnerMidpoints,
  getMarkerSegmentPath,
  findClosestHandle,
  calculateDynamicEdgeLabels,
} from "@/utils/edgeUtils"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import AssessmentIcon from "@/components/svgs/AssessmentIcon"
import { EdgeLabel } from "@/components/EdgeLabel"
import { DiagramEdgeType } from "."

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
  const draggingIndexRef = useRef<number | null>(null)
  const dragOffsetRef = useRef<IPoint>({ x: 0, y: 0 })
  const isReconnectingRef = useRef<boolean>(false)
  const reconnectOffsetRef = useRef<IPoint>({ x: 0, y: 0 })
  const reconnectingEndRef = useRef<"source" | "target" | null>(null)
  const pathRef = useRef<SVGPathElement | null>(null)
  const anchorRef = useRef<SVGSVGElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const [pathMiddlePosition, setPathMiddlePosition] = useState<IPoint>({
    x: 0,
    y: 0,
  })
  const [isMiddlePathHorizontal, setIsMiddlePathHorizontal] =
    useState<boolean>(true)

  // Add state for temporary reconnection points
  const [tempReconnectPoints, setTempReconnectPoints] = useState<
    IPoint[] | null
  >(null)

  const { handleDelete } = useToolbar({ id })
  const { getNode, getEdges, screenToFlowPosition, getNodes } = useReactFlow()
  const [customPoints, setCustomPoints] = useState<IPoint[]>([])
  const onReconnect = useReconnect()
  const { setEdges, assessments } = useDiagramStore(
    useShallow((state) => ({
      setEdges: state.setEdges,
      assessments: state.assessments,
    }))
  )

  const { markerPadding, markerEnd, strokeDashArray } =
    getEdgeMarkerStyles(type)
  const padding = markerPadding ?? MARKER_PADDING
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
    offset: 30,
  })

  const basePath = useMemo(
    () =>
      straightPathPoints !== null
        ? pointsToSvgPath(straightPathPoints)
        : edgePath,
    [straightPathPoints, edgePath]
  )

  const computedPoints = useMemo(() => {
    const simplifiedPath = simplifySvgPath(basePath)
    const parsed = parseSvgPath(simplifiedPath)
    let result = removeDuplicatePoints(parsed)

    if (result.length === 2 && !isDiagramModifiable) {
      result = result.map((point) => ({
        ...point,
        y: point.y + 20,
      }))
    }
    return result
  }, [basePath, isDiagramModifiable])

  const prevNodePositionsRef = useRef<{
    source: { x: number; y: number; parentId?: string }
    target: { x: number; y: number; parentId?: string }
  }>({
    source: {
      x: sourceNode.position.x,
      y: sourceNode.position.y,
      parentId: sourceNode.parentId,
    },
    target: {
      x: targetNode.position.x,
      y: targetNode.position.y,
      parentId: targetNode.parentId,
    },
  })

  useEffect(() => {
    const currentSourcePos = {
      x: sourceNode.position.x,
      y: sourceNode.position.y,
      parentId: sourceNode.parentId,
    }
    const currentTargetPos = {
      x: targetNode.position.x,
      y: targetNode.position.y,
      parentId: targetNode.parentId,
    }
    const prevSourcePos = prevNodePositionsRef.current.source
    const prevTargetPos = prevNodePositionsRef.current.target

    const sourceChanged =
      currentSourcePos.x !== prevSourcePos.x ||
      currentSourcePos.y !== prevSourcePos.y ||
      currentSourcePos.parentId !== prevSourcePos.parentId

    const targetChanged =
      currentTargetPos.x !== prevTargetPos.x ||
      currentTargetPos.y !== prevTargetPos.y ||
      currentTargetPos.parentId !== prevTargetPos.parentId

    if (sourceChanged || targetChanged) {
      prevNodePositionsRef.current = {
        source: currentSourcePos,
        target: currentTargetPos,
      }

      if (customPoints.length > 0) {
        setCustomPoints([])
        setEdges((edges) =>
          edges.map((edge) =>
            edge.id === id
              ? {
                  ...edge,
                  data: { ...edge.data, points: undefined },
                }
              : edge
          )
        )
      }
    }
  }, [
    sourceNode.position.x,
    sourceNode.position.y,
    sourceNode.parentId,
    targetNode.position.x,
    targetNode.position.y,
    targetNode.parentId,
    customPoints,
    id,
    setEdges,
  ])

  // Use temp reconnect points if available, otherwise use regular active points
  const activePoints = useMemo(() => {
    if (tempReconnectPoints) return tempReconnectPoints
    return customPoints.length ? customPoints : computedPoints
  }, [customPoints, computedPoints, tempReconnectPoints])

  const currentPath = useMemo(
    () => pointsToSvgPath(activePoints),
    [activePoints]
  )

  // Calculate label positions based on actual edge points and their directions
  const sourceLabels = useMemo(() => {
    if (activePoints.length < 2) {
      return calculateDynamicEdgeLabels(sourceX, sourceY, sourcePosition)
    }

    const sourcePoint = activePoints[0]
    const nextPoint = activePoints[1]
    const deltaX = nextPoint.x - sourcePoint.x
    const deltaY = nextPoint.y - sourcePoint.y

    let direction: string
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? "right" : "left"
    } else {
      direction = deltaY > 0 ? "bottom" : "top"
    }
    return calculateDynamicEdgeLabels(sourcePoint.x, sourcePoint.y, direction)
  }, [activePoints, sourceX, sourceY, sourcePosition])

  const targetLabels = useMemo(() => {
    const targetPoint = activePoints[activePoints.length - 1]

    return calculateDynamicEdgeLabels(
      targetPoint.x,
      targetPoint.y,
      targetPosition
    )
  }, [activePoints, targetPosition])

  useEffect(() => {
    if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength()
      const halfLength = totalLength / 2
      const middlePoint = pathRef.current.getPointAtLength(halfLength)
      const pointOnCloseToMiddle = pathRef.current.getPointAtLength(
        halfLength + 2
      ) // 2 pixels away from the middle
      const isHorizontal =
        Math.abs(pointOnCloseToMiddle.x - middlePoint.x) >
        Math.abs(pointOnCloseToMiddle.y - middlePoint.y)

      setIsMiddlePathHorizontal(isHorizontal)

      setPathMiddlePosition({ x: middlePoint.x, y: middlePoint.y })
    }
  }, [currentPath])

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
          Math.abs(newPoints[startIdx].x - newPoints[endIdx].x) < 1
            ? "vertical"
            : "horizontal"

        if (linePosition === "horizontal") {
          newPoints[startIdx] = { x: newPoints[startIdx].x, y: newY }
          newPoints[endIdx] = { x: newPoints[endIdx].x, y: newY }
        } else if (linePosition === "vertical") {
          newPoints[startIdx] = { x: newX, y: newPoints[startIdx].y }
          newPoints[endIdx] = { x: newX, y: newPoints[endIdx].y }
        }

        setCustomPoints(newPoints)
        finalPointsRef.current = newPoints
      }

      const handlePointerUp = () => {
        setEdges((edges) =>
          edges.map((edge) =>
            edge.id === id
              ? {
                  ...edge,
                  data: { ...edge.data, points: finalPointsRef.current },
                }
              : edge
          )
        )
        draggingIndexRef.current = null
        document.removeEventListener("pointermove", handlePointerMove)
        document.removeEventListener("pointerup", handlePointerUp)
      }

      document.addEventListener("pointermove", handlePointerMove)
      document.addEventListener("pointerup", handlePointerUp, { once: true })
    },
    [midpoints, activePoints, id, data, setEdges]
  )

  useEffect(() => {
    if (data?.points) {
      setCustomPoints(data.points)
    }
  }, [data?.points])

  const getDropPosition = (event: PointerEvent) => {
    return screenToFlowPosition(
      { x: event.clientX, y: event.clientY },
      { snapToGrid: false }
    )
  }

  const handleEndpointPointerDown = (
    e: React.PointerEvent,
    endType: "source" | "target"
  ) => {
    if (straightPathPoints === null || !isDiagramModifiable) return
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
  }

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

    // Update temp reconnect points to show visual feedback
    setTempReconnectPoints(newPoints)
  }

  const handleEndpointPointerUp = (upEvent: PointerEvent) => {
    const isReconnectingSource = reconnectingEndRef.current === "source"

    isReconnectingRef.current = false
    // Clear temp reconnect points
    setTempReconnectPoints(null)

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

  const sourcePoint = activePoints[0]
  const targetPoint = activePoints[activePoints.length - 1]
  const nodeScore = assessments[id]?.score

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
          ref={pathRef}
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

        {isDiagramModifiable &&
          !isReconnectingRef.current &&
          midpoints.map((point, midPointIndex) => (
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

      <CustomEdgeToolbar
        edgeId={id}
        ref={anchorRef}
        position={pathMiddlePosition}
        onEditClick={() => setPopOverElementId(id)}
        onDeleteClick={handleDelete}
      />

      {/* Updated label rendering with dynamic positioning */}
      {data?.sourceRole && (
        <text
          x={sourceLabels.roleX}
          y={sourceLabels.roleY}
          textAnchor={sourceLabels.roleTextAnchor}
          style={{
            fontSize: "16px",
            fill: "black",
            userSelect: "none",
          }}
        >
          {data?.sourceRole}
        </text>
      )}

      {data?.sourceMultiplicity && (
        <text
          x={sourceLabels.multiplicityX}
          y={sourceLabels.multiplicityY}
          textAnchor={sourceLabels.multiplicityTextAnchor}
          style={{
            fontSize: "16px",
            fill: "black",
            userSelect: "none",
          }}
        >
          {data?.sourceMultiplicity}
        </text>
      )}

      {data?.targetRole && (
        <text
          x={targetLabels.roleX}
          y={targetLabels.roleY}
          textAnchor={targetLabels.roleTextAnchor}
          style={{
            fontSize: "16px",
            fill: "black",
            userSelect: "none",
          }}
        >
          {data?.targetRole}
        </text>
      )}

      {data?.targetMultiplicity && (
        <text
          x={targetLabels.multiplicityX}
          y={targetLabels.multiplicityY}
          textAnchor={targetLabels.multiplicityTextAnchor}
          style={{
            fontSize: "16px",
            fill: "black",
            userSelect: "none",
          }}
        >
          {data?.targetMultiplicity}
        </text>
      )}

      {!isDiagramModifiable && (
        <AssessmentIcon
          x={pathMiddlePosition.x - 15}
          y={pathMiddlePosition.y - 15}
          score={nodeScore}
        />
      )}

      <EdgeLabel
        isMiddlePathHorizontal={isMiddlePathHorizontal}
        pathMiddlePosition={pathMiddlePosition}
        label={data?.label}
      />

      <PopoverManager
        elementId={id}
        anchorEl={anchorRef.current}
        type={type as DiagramEdgeType}
      />
    </>
  )
}
