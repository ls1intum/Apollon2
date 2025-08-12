import { useCallback, useRef, useState, useEffect } from "react"
import { useReactFlow } from "@xyflow/react"
import { ExtendedEdgeProps } from "./EdgeProps"
import { CustomEdgeToolbar } from "@/components"
import { IPoint } from "./Connection"
import { useReconnect } from "@/hooks/useReconnect"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import AssessmentIcon from "@/components/svgs/AssessmentIcon"
import { DiagramEdgeType } from "."

export interface BaseEdgeProps extends ExtendedEdgeProps {
  diagramType?: "class" | "usecase" | "activity"
}

export const useEdgeState = (initialPoints?: IPoint[]) => {
  const [customPoints, setCustomPoints] = useState<IPoint[]>([])
  const [pathMiddlePosition, setPathMiddlePosition] = useState<IPoint>({
    x: 0,
    y: 0,
  })
  const [isMiddlePathHorizontal, setIsMiddlePathHorizontal] =
    useState<boolean>(true)
  const [tempReconnectPoints, setTempReconnectPoints] = useState<
    IPoint[] | null
  >(null)

  useEffect(() => {
    if (initialPoints) {
      setCustomPoints(initialPoints)
    }
  }, [initialPoints])

  return {
    customPoints,
    setCustomPoints,
    pathMiddlePosition,
    setPathMiddlePosition,
    isMiddlePathHorizontal,
    setIsMiddlePathHorizontal,
    tempReconnectPoints,
    setTempReconnectPoints,
  }
}

export const useEdgePath = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  pathRef: React.RefObject<SVGPathElement>
) => {
  const updateMiddlePosition = useCallback(
    (
      path: string,
      setPathMiddlePosition: (pos: IPoint) => void,
      setIsMiddlePathHorizontal: (horizontal: boolean) => void,
      isDirectPath = false
    ) => {
      if (isDirectPath) {
        console.log(path)
        const middleX = (sourceX + targetX) / 2
        const middleY = (sourceY + targetY) / 2
        setPathMiddlePosition({ x: middleX, y: middleY })

        const dx = Math.abs(targetX - sourceX)
        const dy = Math.abs(targetY - sourceY)
        setIsMiddlePathHorizontal(dx > dy)
      } else if (pathRef.current) {
        const totalLength = pathRef.current.getTotalLength()
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
      }
    },
    [sourceX, sourceY, targetX, targetY, pathRef]
  )

  return { updateMiddlePosition }
}

export const useEdgeReconnection = (
  id: string,
  source: string,
  target: string,
  sourceHandleId?: string | null,
  targetHandleId?: string | null
) => {
  const isReconnectingRef = useRef<boolean>(false)
  const reconnectOffsetRef = useRef<IPoint>({ x: 0, y: 0 })
  const reconnectingEndRef = useRef<"source" | "target" | null>(null)
  const onReconnect = useReconnect()
  const { getNodes, getEdges, screenToFlowPosition } = useReactFlow()

  const getDropPosition = (event: PointerEvent) => {
    return screenToFlowPosition(
      { x: event.clientX, y: event.clientY },
      { snapToGrid: false }
    )
  }

  const findNodeAtPosition = (position: IPoint) => {
    const nodes = getNodes()
    return nodes.find((node) => {
      const x = node.position?.x || 0
      const y = node.position?.y || 0
      const width = node.width || 100
      const height = node.height || 160

      return (
        position.x > x &&
        position.x < x + width &&
        position.y > y &&
        position.y < y + height
      )
    })
  }

  const startReconnection = (
    e: React.PointerEvent,
    endType: "source" | "target",
    currentPoint: IPoint
  ) => {
    e.stopPropagation()
    e.preventDefault()

    isReconnectingRef.current = true
    reconnectingEndRef.current = endType

    reconnectOffsetRef.current = {
      x: e.clientX - currentPoint.x,
      y: e.clientY - currentPoint.y,
    }
  }

  const completeReconnection = (
    upEvent: PointerEvent,
    handleFinder: (position: IPoint, nodeBounds: any) => string,
    onComplete?: () => void
  ) => {
    const isReconnectingSource = reconnectingEndRef.current === "source"

    isReconnectingRef.current = false

    const dropPosition = getDropPosition(upEvent)
    const nodeAtPosition = findNodeAtPosition(dropPosition)

    if (!nodeAtPosition) {
      reconnectingEndRef.current = null
      onComplete?.()
      return
    }

    const newHandle = handleFinder(dropPosition, {
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
          targetHandle: targetHandleId ?? null,
        }
      : {
          source: source,
          target: nodeAtPosition.id,
          sourceHandle: sourceHandleId ?? null,
          targetHandle: newHandle,
        }

    const oldEdge = getEdges().find((edge) => edge.id === id)
    if (oldEdge) {
      onReconnect(oldEdge, newConnection)
    }

    reconnectingEndRef.current = null
  }

  return {
    isReconnectingRef,
    reconnectingEndRef,
    startReconnection,
    completeReconnection,
  }
}

export const EdgeEndpointMarkers = ({
  sourcePoint,
  targetPoint,
  isDiagramModifiable,
  diagramType,
  pathType,
  onSourcePointerDown,
  onTargetPointerDown,
}: {
  sourcePoint: IPoint
  targetPoint: IPoint
  isDiagramModifiable: boolean
  diagramType: string
  pathType: string
  onSourcePointerDown: (e: React.PointerEvent) => void
  onTargetPointerDown: (e: React.PointerEvent) => void
}) => {
  if (!isDiagramModifiable || diagramType === "usecase") return null

  return (
    <>
      <circle
        className="source-edge-marker-grab"
        cx={sourcePoint.x}
        cy={sourcePoint.y}
        r={pathType === "straight" ? 8 : 20}
        fill="transparent"
        stroke="transparent"
        strokeWidth={0}
        pointerEvents="all"
        onPointerDown={onSourcePointerDown}
        style={{ cursor: "crosshair" }}
      />
      <circle
        className="target-edge-marker-grab"
        cx={targetPoint.x}
        cy={targetPoint.y}
        r={pathType === "straight" ? 8 : 20}
        fill="transparent"
        stroke="transparent"
        strokeWidth={0}
        pointerEvents="all"
        onPointerDown={onTargetPointerDown}
        style={{ cursor: "crosshair" }}
      />
    </>
  )
}

export const CommonEdgeElements = ({
  id,
  pathMiddlePosition,
  isDiagramModifiable,
  assessments,
  anchorRef,
  handleDelete,
  setPopOverElementId,
  type,
}: {
  id: string
  pathMiddlePosition: IPoint
  isDiagramModifiable: boolean
  assessments: any
  anchorRef: React.RefObject<SVGSVGElement>
  handleDelete: () => void
  setPopOverElementId: (id: string) => void
  type: string
}) => {
  const nodeScore = assessments[id]?.score

  return (
    <>
      <CustomEdgeToolbar
        edgeId={id}
        ref={anchorRef}
        position={pathMiddlePosition}
        onEditClick={() => setPopOverElementId(id)}
        onDeleteClick={handleDelete}
      />

      {!isDiagramModifiable && (
        <AssessmentIcon
          x={pathMiddlePosition.x - 15}
          y={pathMiddlePosition.y - 15}
          score={nodeScore}
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
