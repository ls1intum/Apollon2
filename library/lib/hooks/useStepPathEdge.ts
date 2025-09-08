import { useCallback, useMemo, useEffect, useRef, useState } from "react"
import { getSmoothStepPath, useReactFlow } from "@xyflow/react"
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
import { Position } from "@xyflow/react"
import {
  IPoint,
  pointsToSvgPath,
  tryFindStraightPath,
} from "../edges/Connection"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import {
  getEdgeMarkerStyles,
  simplifySvgPath,
  removeDuplicatePoints,
  parseSvgPath,
  calculateInnerMidpoints,
  getMarkerSegmentPath,
} from "@/utils/edgeUtils"
import { useEdgeState, useEdgeReconnection } from "../edges/GenericEdge"
import { useDiagramModifiable } from "./useDiagramModifiable"
import { useHandleFinder } from "./useHandleFinder"

interface UseStepPathEdgeProps {
  id: string
  type: string
  source: string
  target: string
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  sourcePosition: Position
  targetPosition: Position
  sourceHandleId?: string | null
  targetHandleId?: string | null
  data?: { points?: IPoint[] }
  allowMidpointDragging?: boolean
  enableReconnection?: boolean
  enableStraightPath?: boolean
}

export interface StepPathEdgeData {
  activePoints: IPoint[]
  pathMiddlePosition: IPoint
  isMiddlePathHorizontal: boolean
  sourcePoint: IPoint
  targetPoint: IPoint
}

export const useStepPathEdge = ({
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
  allowMidpointDragging = true,
  enableReconnection = true,
  enableStraightPath = false,
}: UseStepPathEdgeProps) => {
  const draggingIndexRef = useRef<number | null>(null)
  const dragOffsetRef = useRef<IPoint>({ x: 0, y: 0 })
  const pathRef = useRef<SVGPathElement | null>(null)
  const finalPointsRef = useRef<IPoint[]>([])

  const isDiagramModifiable = useDiagramModifiable()
  const { getNode, getNodes, screenToFlowPosition } = useReactFlow()

  const [pathMiddlePosition, setPathMiddlePosition] = useState<IPoint>({
    x: (sourceX + targetX) / 2,
    y: (sourceY + targetY) / 2,
  })
  const [isMiddlePathHorizontal, setIsMiddlePathHorizontal] =
    useState<boolean>(true)
  const [hasInitialCalculation, setHasInitialCalculation] = useState(false)

  const {
    customPoints,
    setCustomPoints,
    tempReconnectPoints,
    setTempReconnectPoints,
  } = useEdgeState(data?.points)
  const {
    isReconnectingRef,
    reconnectingEndRef,
    startReconnection,
    completeReconnection,
  } = useEdgeReconnection(id, source, target, sourceHandleId, targetHandleId)

  const { findBestHandle } = useHandleFinder()
  const { setEdges } = useDiagramStore(
    useShallow((state) => ({
      setEdges: state.setEdges,
    }))
  )

  const {
    markerPadding,
    markerEnd,
    markerStart,
    strokeDashArray,
    offset = 0,
  } = getEdgeMarkerStyles(type)
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
  const basePath = useMemo(() => {
    if (!enableStraightPath) {
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
  }, [
    enableStraightPath,
    sourceAbsolutePosition,
    targetAbsolutePosition,
    sourceNode,
    targetNode,
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    padding,
  ])

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

  // Reset custom points when nodes move
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
        if (sourceChanged && targetChanged) {
          const deltaX = currentSourcePos.x - prevSourcePos.x
          const deltaY = currentSourcePos.y - prevSourcePos.y
          const newPoints = customPoints.map((point) =>
            screenToFlowPosition({
              x: point.x + deltaX,
              y: point.y + deltaY,
            })
          )

          setCustomPoints(newPoints)
          setEdges((edges) =>
            edges.map((edge) =>
              edge.id === id
                ? {
                    ...edge,
                    data: { ...edge.data, points: newPoints },
                  }
                : edge
            )
          )
        } else {
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
    setCustomPoints,
  ])

  const activePoints = useMemo(() => {
    if (tempReconnectPoints) {
      return tempReconnectPoints
    }
    if (data?.points && data.points.length > 0) {
      return data.points
    }
    return customPoints.length ? customPoints : computedPoints
  }, [customPoints, computedPoints, tempReconnectPoints, data?.points])

  const currentPath = useMemo(() => {
    return pointsToSvgPath(activePoints)
  }, [activePoints])

  const markerSegmentPath = useMemo(
    () => getMarkerSegmentPath(activePoints, offset, targetPosition),
    [activePoints, offset, targetPosition]
  )

  const overlayPath = useMemo(() => {
    return `${currentPath} ${markerSegmentPath}`
  }, [currentPath, markerSegmentPath])

  const midpoints = useMemo(() => {
    if (!allowMidpointDragging || activePoints.length < 3) return []
    return calculateInnerMidpoints(activePoints)
  }, [activePoints, allowMidpointDragging])

  useEffect(() => {
    if (pathRef.current && currentPath) {
      const calculateMiddlePoint = () => {
        if (!pathRef.current) return

        try {
          const totalLength = pathRef.current.getTotalLength()

          if (totalLength > 0) {
            const halfLength = totalLength / 2
            const middlePoint = pathRef.current.getPointAtLength(halfLength)
            const pointOnCloseToMiddle = pathRef.current.getPointAtLength(
              halfLength + 2
            )

            const isHorizontal =
              Math.abs(pointOnCloseToMiddle.x - middlePoint.x) >
              Math.abs(pointOnCloseToMiddle.y - middlePoint.y)

            setIsMiddlePathHorizontal(isHorizontal)
            setPathMiddlePosition({ x: middlePoint.x, y: middlePoint.y })

            if (!hasInitialCalculation) {
              setHasInitialCalculation(true)
            }
          }
        } catch (error) {
          console.warn("Path calculation error:", error)
          setPathMiddlePosition({
            x: (sourceX + targetX) / 2,
            y: (sourceY + targetY) / 2,
          })
        }
      }
      const timeoutId = setTimeout(calculateMiddlePoint, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [currentPath, sourceX, sourceY, targetX, targetY, hasInitialCalculation])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent, index: number) => {
      if (!allowMidpointDragging) return

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
    [
      midpoints,
      activePoints,
      id,
      setEdges,
      allowMidpointDragging,
      setCustomPoints,
    ]
  )

  const handleEndpointPointerDown = useCallback(
    (e: React.PointerEvent, endType: "source" | "target") => {
      if (!isDiagramModifiable || !enableReconnection) return

      const endpoint =
        endType === "source"
          ? activePoints[0]
          : activePoints[activePoints.length - 1]

      startReconnection(e, endType, endpoint)

      const handleEndpointPointerMove = (moveEvent: PointerEvent) => {
        if (!isReconnectingRef.current) return

        const newEndpoint = screenToFlowPosition({
          x: moveEvent.clientX,
          y: moveEvent.clientY,
        })

        let newSourceX = sourceX
        let newSourceY = sourceY
        let newTargetX = targetX
        let newTargetY = targetY

        if (reconnectingEndRef.current === "source") {
          newSourceX = newEndpoint.x
          newSourceY = newEndpoint.y
        } else {
          newTargetX = newEndpoint.x
          newTargetY = newEndpoint.y
        }
        const isActivityDiagram = type.startsWith("Activity")

        let newPoints: IPoint[] = []

        if (isActivityDiagram) {
          const adjustedTargetCoordinates = adjustTargetCoordinates(
            newTargetX,
            newTargetY,
            targetPosition,
            padding
          )
          const adjustedSourceCoordinates = adjustSourceCoordinates(
            newSourceX,
            newSourceY,
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

          const simplifiedPath = simplifySvgPath(edgePath)
          newPoints = removeDuplicatePoints(parseSvgPath(simplifiedPath))
        } else {
          const newSourceAbsolute =
            reconnectingEndRef.current === "source"
              ? newEndpoint
              : sourceAbsolutePosition
          const newTargetAbsolute =
            reconnectingEndRef.current === "target"
              ? newEndpoint
              : targetAbsolutePosition

          const straightPathPoints = tryFindStraightPath(
            {
              position: { x: newSourceAbsolute.x, y: newSourceAbsolute.y },
              width: sourceNode.width ?? 100,
              height: sourceNode.height ?? 160,
              direction: sourcePosition,
            },
            {
              position: { x: newTargetAbsolute.x, y: newTargetAbsolute.y },
              width: targetNode.width ?? 100,
              height: targetNode.height ?? 160,
              direction: targetPosition,
            },
            padding
          )

          if (straightPathPoints !== null) {
            newPoints = straightPathPoints
          } else {
            const adjustedTargetCoordinates = adjustTargetCoordinates(
              newTargetX,
              newTargetY,
              targetPosition,
              padding
            )
            const adjustedSourceCoordinates = adjustSourceCoordinates(
              newSourceX,
              newSourceY,
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
            const simplifiedPath = simplifySvgPath(edgePath)
            newPoints = removeDuplicatePoints(parseSvgPath(simplifiedPath))
          }
        }

        setTempReconnectPoints(newPoints)
      }

      const handleEndpointPointerUp = (upEvent: PointerEvent) => {
        setTempReconnectPoints(null)
        document.removeEventListener("pointermove", handleEndpointPointerMove, {
          capture: true,
        })
        document.removeEventListener("pointerup", handleEndpointPointerUp, {
          capture: true,
        })

        completeReconnection(upEvent, findBestHandle, () => {
          setCustomPoints([])
        })
      }

      document.addEventListener("pointermove", handleEndpointPointerMove, {
        capture: true,
      })
      document.addEventListener("pointerup", handleEndpointPointerUp, {
        once: true,
        capture: true,
      })
    },
    [
      isDiagramModifiable,
      enableReconnection,
      activePoints,
      startReconnection,
      isReconnectingRef,
      screenToFlowPosition,
      reconnectingEndRef,
      setTempReconnectPoints,
      completeReconnection,
      setCustomPoints,
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      type,
      padding,
      sourceAbsolutePosition,
      targetAbsolutePosition,
      sourceNode,
      targetNode,
      findBestHandle,
    ]
  )

  const sourcePoint = activePoints[0] || { x: sourceX, y: sourceY }
  const targetPoint = activePoints[activePoints.length - 1] || {
    x: targetX,
    y: targetY,
  }

  const edgeData: StepPathEdgeData = {
    activePoints,
    pathMiddlePosition,
    isMiddlePathHorizontal,
    sourcePoint,
    targetPoint,
  }

  return {
    pathRef,
    edgeData,
    currentPath,
    overlayPath,
    midpoints,
    hasInitialCalculation,
    isReconnectingRef,
    markerEnd,
    markerStart,
    strokeDashArray,
    handlePointerDown,
    handleEndpointPointerDown,
    sourcePoint,
    targetPoint,
    isDiagramModifiable,
  }
}
