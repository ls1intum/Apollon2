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
import { 
  getEdgeMarkerStyles,
  calculateStraightPath,
  findClosestHandleForUseCase,
  findClosestHandle
} from "@/utils/edgeUtils"
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
  calculateDynamicEdgeLabels,
} from "@/utils/edgeUtils"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import AssessmentIcon from "@/components/svgs/AssessmentIcon"
import { EdgeLabel } from "@/components/EdgeLabel"
import { DiagramEdgeType } from "."

// Extended props to include path configuration
interface GenericEdgeProps extends ExtendedEdgeProps {
  pathType?: "step" | "straight"
  diagramType?: "class" | "usecase" | "activity"
  allowMidpointDragging?: boolean
  showRelationshipLabels?: boolean
}

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
  pathType = "step", // Default to step path for backward compatibility
  diagramType = "class",
  allowMidpointDragging = true,
  showRelationshipLabels = false,
}: GenericEdgeProps) => {
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
    x: (sourceX + targetX) / 2, // Initialize with calculated middle position
    y: (sourceY + targetY) / 2,
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

  // Generate path based on pathType
  const basePath = useMemo(() => {
    if (pathType === "straight") {
      // For straight paths (use case diagrams)
      return calculateStraightPath(sourceX, sourceY, targetX, targetY, padding)
    } else {
      // For step paths (class/activity diagrams)
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

      if (straightPathPoints !== null) {
        return pointsToSvgPath(straightPathPoints)
      } else {
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
        return edgePath
      }
    }
  }, [
    pathType,
    sourceX,
    sourceY,
    targetX,
    targetY,
    padding,
    sourceAbsolutePosition,
    targetAbsolutePosition,
    sourceNode,
    targetNode,
    sourcePosition,
    targetPosition
  ])

  const computedPoints = useMemo(() => {
    if (pathType === "straight") {
      // For straight paths, just return source and target points
      return [
        { x: sourceX, y: sourceY },
        { x: targetX, y: targetY }
      ]
    } else {
      // For step paths, use existing logic
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
    }
  }, [basePath, pathType, sourceX, sourceY, targetX, targetY, isDiagramModifiable])

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

      if (customPoints.length > 0 && pathType === "step") {
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
    pathType,
  ])

  // Use temp reconnect points if available, otherwise use regular active points
  const activePoints = useMemo(() => {
    if (tempReconnectPoints) {
      return tempReconnectPoints
    }
    return customPoints.length && pathType === "step" ? customPoints : computedPoints
  }, [customPoints, computedPoints, tempReconnectPoints, pathType])

  const currentPath = useMemo(() => {
    // Handle reconnection state - use tempReconnectPoints when reconnecting
    const pointsToUse = tempReconnectPoints || activePoints
    
    if (pathType === "straight") {
      // For straight paths, always create direct line from first to last point
      if (pointsToUse.length >= 2) {
        const startPoint = pointsToUse[0]
        const endPoint = pointsToUse[pointsToUse.length - 1]
        
        // For include/extend, create a gap in the middle for the label
        if (showRelationshipLabels && (type === "UseCaseInclude" || type === "UseCaseExtend")) {
          const midX = (startPoint.x + endPoint.x) / 2
          const midY = (startPoint.y + endPoint.y) / 2
          const gapSize = 60 // Further increased gap size for the label
          
          // Calculate direction vector
          const dx = endPoint.x - startPoint.x
          const dy = endPoint.y - startPoint.y
          const length = Math.sqrt(dx * dx + dy * dy)
          
          if (length > gapSize * 2) {
            // Normalize direction
            const normalizedDx = dx / length
            const normalizedDy = dy / length
            
            // Create gap around middle point
            const gapStartX = midX - normalizedDx * (gapSize / 2)
            const gapStartY = midY - normalizedDy * (gapSize / 2)
            const gapEndX = midX + normalizedDx * (gapSize / 2)
            const gapEndY = midY + normalizedDy * (gapSize / 2)
            
            // Create path with gap: start -> gapStart, gapEnd -> end
            return `M ${startPoint.x},${startPoint.y} L ${gapStartX},${gapStartY} M ${gapEndX},${gapEndY} L ${endPoint.x},${endPoint.y}`
          }
        }
        
        return calculateStraightPath(
          startPoint.x, 
          startPoint.y, 
          endPoint.x, 
          endPoint.y, 
          isReconnectingRef.current ? 0 : padding
        )
      }
      return basePath
    } else {
      // For step paths, use the points to create step path
      return pointsToSvgPath(pointsToUse)
    }
  }, [activePoints, tempReconnectPoints, pathType, basePath, padding, showRelationshipLabels, type])

    const markerSegmentPath = useMemo(
    () => getMarkerSegmentPath(activePoints, padding, targetPosition),
    [activePoints, padding, targetPosition, type]
  )
const overlayPath = useMemo(() => {
    if (diagramType === "usecase") {
      // For use case diagrams, create a continuous path from source to target including padding
      if (pathType === "straight") {
        const sourcePoint = activePoints[0]
        const targetPoint = activePoints[activePoints.length - 1]
        return calculateStraightPath(sourcePoint.x, sourcePoint.y, targetPoint.x, targetPoint.y, 0)
      }
      return currentPath
    } else {
      // For other diagram types, keep the current segmented approach
      return `${currentPath} ${markerSegmentPath}`
    }
  }, [diagramType, pathType, activePoints, currentPath, markerSegmentPath])


  // Calculate label positions based on actual edge points and their directions
  const sourceLabels = useMemo(() => {
    if (diagramType === "usecase") {
      // For use case diagrams, don't show source/target role labels
      return { roleX: 0, roleY: 0, multiplicityX: 0, multiplicityY: 0, roleTextAnchor: "middle" as const, multiplicityTextAnchor: "middle" as const }
    }

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
  }, [activePoints, sourceX, sourceY, sourcePosition, diagramType])

  const targetLabels = useMemo(() => {
    if (diagramType === "usecase") {
      // For use case diagrams, don't show source/target role labels
      return { roleX: 0, roleY: 0, multiplicityX: 0, multiplicityY: 0, roleTextAnchor: "middle" as const, multiplicityTextAnchor: "middle" as const }
    }

    const targetPoint = activePoints[activePoints.length - 1]
    return calculateDynamicEdgeLabels(
      targetPoint.x,
      targetPoint.y,
      targetPosition
    )
  }, [activePoints, targetPosition, diagramType])

  // Calculate middle position and orientation
  useEffect(() => {
    if (pathType === "straight") {
      const middleX = (sourceX + targetX) / 2
      const middleY = (sourceY + targetY) / 2
      setPathMiddlePosition({ x: middleX, y: middleY })
      
      // For straight paths, determine if more horizontal or vertical
      const dx = Math.abs(targetX - sourceX)
      const dy = Math.abs(targetY - sourceY)
      setIsMiddlePathHorizontal(dx > dy)
    } else if (pathRef.current) {
      const totalLength = pathRef.current.getTotalLength()
      const halfLength = totalLength / 2
      const middlePoint = pathRef.current.getPointAtLength(halfLength)
      const pointOnCloseToMiddle = pathRef.current.getPointAtLength(halfLength + 2)
      const isHorizontal =
        Math.abs(pointOnCloseToMiddle.x - middlePoint.x) >
        Math.abs(pointOnCloseToMiddle.y - middlePoint.y)

      setIsMiddlePathHorizontal(isHorizontal)
      setPathMiddlePosition({ x: middlePoint.x, y: middlePoint.y })
    }
  }, [currentPath, pathType, sourceX, sourceY, targetX, targetY])

  const midpoints = useMemo(() => {
    if (pathType === "straight" || !allowMidpointDragging) {
      return [] // No midpoints for straight paths or when dragging is disabled
    }
    return calculateInnerMidpoints(activePoints)
  }, [activePoints, pathType, allowMidpointDragging])

  const finalPointsRef = useRef<IPoint[]>([])
  const handlePointerDown = useCallback(
    (event: React.PointerEvent, index: number) => {
      if (pathType === "straight" || !allowMidpointDragging) return

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
    [midpoints, activePoints, id, data, setEdges, pathType, allowMidpointDragging]
  )

  useEffect(() => {
    if (data?.points && pathType === "step") {
      setCustomPoints(data.points)
    }
  }, [data?.points, pathType])

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
    if (!isDiagramModifiable) return
    e.stopPropagation()
    e.preventDefault() // Prevent React Flow's default reconnection

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

    // Disable React Flow's default reconnection behavior
    document.addEventListener("pointermove", handleEndpointPointerMove, { capture: true })
    document.addEventListener("pointerup", handleEndpointPointerUp, {
      once: true,
      capture: true,
    })
  }

  const handleEndpointPointerMove = (moveEvent: PointerEvent) => {
    if (!isReconnectingRef.current) return

    const endpoint = screenToFlowPosition({
      x: moveEvent.clientX,
      y: moveEvent.clientY,
    })

    // For all diagrams, create appropriate ghost path during reconnection
    if (pathType === "straight") {
      // For straight paths (use case), always show direct line ghost
      const sourcePoint = reconnectingEndRef.current === "source" ? endpoint : activePoints[0]
      const targetPoint = reconnectingEndRef.current === "target" ? endpoint : activePoints[activePoints.length - 1]
      
      setTempReconnectPoints([sourcePoint, targetPoint])
    } else {
      // For step paths (class/activity), use existing step path logic
      const newPoints = [...activePoints]
      if (reconnectingEndRef.current === "source") {
        newPoints[0] = endpoint
      } else {
        newPoints[newPoints.length - 1] = endpoint
      }
      setTempReconnectPoints(newPoints)
    }
  }

  const handleEndpointPointerUp = (upEvent: PointerEvent) => {
    const isReconnectingSource = reconnectingEndRef.current === "source"

    isReconnectingRef.current = false
    // Clear temp reconnect points
    setTempReconnectPoints(null)

    // Remove event listeners with capture
    document.removeEventListener("pointermove", handleEndpointPointerMove, { capture: true })
    document.removeEventListener("pointerup", handleEndpointPointerUp, { capture: true })

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

    // Use appropriate handle finding logic based on diagram type
    const newHandle = diagramType === "usecase" 
      ? findClosestHandleForUseCase(dropPosition, {
          x: nodeAtPosition.position.x,
          y: nodeAtPosition.position.y,
          width: nodeAtPosition.width!,
          height: nodeAtPosition.height!,
        }, "UseCase")
      : findClosestHandle(dropPosition, {
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

  // Calculate label position for use case relationship labels
  const relationshipLabelPosition = useMemo(() => {
    if (!showRelationshipLabels) return { x: 0, y: 0 }
    
    // For include/extend, place labels directly in the middle of the path
    const middleX = (sourceX + targetX) / 2
    const middleY = (sourceY + targetY) / 2
    
    return {
      x: middleX,
      y: middleY,
    }
  }, [sourceX, sourceY, targetX, targetY, showRelationshipLabels])

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
            strokeDasharray: isReconnectingRef.current ? "4 4" : strokeDashArray, // Show dashed during reconnection
            strokeWidth: pathType === "straight" ? 2 : undefined,
          }}
        />

        <path
          ref={pathRef}
          className="edge-overlay"
          d={overlayPath} // Use currentPath instead of fullHighlightPath for consistency
          fill="none"
          strokeWidth={12}
          pointerEvents="stroke"
          style={{
            opacity: isReconnectingRef.current ? 0 : 0.4,
          }}
        />

        {/* Source endpoint marker grab - for reconnecting the source end - invisible but functional */}
        {isDiagramModifiable && diagramType !== "usecase" &&(
          <circle
            className="source-edge-marker-grab"
            cx={sourcePoint.x}
            cy={sourcePoint.y}
            r={pathType === "straight" ? 8 : 20}
            fill="transparent"
            stroke="transparent"
            strokeWidth={0}
            pointerEvents="all"
            onPointerDown={(e) => handleEndpointPointerDown(e, "source")}
            style={{ cursor: "crosshair" }}
          />
        )}

        {/* Target endpoint marker grab - for reconnecting the target end - invisible but functional */}
        {isDiagramModifiable && diagramType !== "usecase" && (
          <circle
            className="target-edge-marker-grab"
            cx={targetPoint.x}
            cy={targetPoint.y}
            r={pathType === "straight" ? 8 : 20}
            fill="transparent"
            stroke="transparent"
            strokeWidth={0}
            pointerEvents="all"
            onPointerDown={(e) => handleEndpointPointerDown(e, "target")}
            style={{ cursor: "crosshair" }}
          />
        )}

        {isDiagramModifiable &&
          !isReconnectingRef.current &&
          allowMidpointDragging &&
          pathType === "step" &&
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

      {/* Updated label rendering with dynamic positioning - only for class/activity diagrams */}
      {diagramType !== "usecase" && data?.sourceRole && (
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

      {diagramType !== "usecase" && data?.sourceMultiplicity && (
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

      {diagramType !== "usecase" && data?.targetRole && (
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

      {diagramType !== "usecase" && data?.targetMultiplicity && (
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

      {/* Relationship labels for use case edges - positioned in the gap, rotated */}
      {showRelationshipLabels && (type === "UseCaseInclude" || type === "UseCaseExtend") && (
        (() => {
          // Calculate angle and position for the rotated label
          const dx = targetPoint.x - sourcePoint.x
          const dy = targetPoint.y - sourcePoint.y
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          
          // Normalize angle to keep text readable (never upside down)
          let rotation = angle
          if (angle > 90 || angle < -90) {
            rotation = angle + 180
          }
          
          return (
            <text
              x={relationshipLabelPosition.x}
              y={relationshipLabelPosition.y}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${rotation}, ${relationshipLabelPosition.x}, ${relationshipLabelPosition.y})`}
              className="edge-label" // Add class for hover styling
              style={{
                fontSize: "10px",
                fill: "black",
                fontStyle: "italic",
                userSelect: "none",
                fontWeight: "normal",
                pointerEvents: "none", // Prevent interference with hover detection
              }}
            >
              {type === "UseCaseInclude" ? "<<include>>" : "<<extend>>"}
            </text>
          )
        })()
      )}

      {!isDiagramModifiable && (
        <AssessmentIcon
          x={pathMiddlePosition.x - 15}
          y={pathMiddlePosition.y - 15}
          score={nodeScore}
        />
      )}

      {/* Edge label - only show for associations and non-use case edges, and only after position is calculated */}
      {(diagramType !== "usecase" || type === "UseCaseAssociation") && 
       pathMiddlePosition.x !== 0 && pathMiddlePosition.y !== 0 && (
        <EdgeLabel
          isMiddlePathHorizontal={isMiddlePathHorizontal}
          pathMiddlePosition={pathMiddlePosition}
          label={data?.label}
          sourcePoint={pathType === "straight" ? sourcePoint : undefined}
          targetPoint={pathType === "straight" ? targetPoint : undefined}
          isUseCasePath={pathType === "straight"}
        />
      )}

      <PopoverManager
        elementId={id}
        anchorEl={anchorRef.current}
        type={type as DiagramEdgeType}
      />
    </>
  )
}