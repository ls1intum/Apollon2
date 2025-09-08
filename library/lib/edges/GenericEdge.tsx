import { useRef, useState, useEffect } from "react"
import { useReactFlow, type Node } from "@xyflow/react"
import { ExtendedEdgeProps } from "./EdgeProps"
import { CustomEdgeToolbar } from "@/components"
import { IPoint } from "./Connection"
import { useReconnect } from "@/hooks/useReconnect"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import AssessmentIcon from "@/components/svgs/AssessmentIcon"
import { DiagramEdgeType } from "."
import { Assessment } from "@/typings"

export interface BaseEdgeProps extends ExtendedEdgeProps {
  diagramType?: "class" | "usecase" | "activity" | "component" | "deployment"
}
export const useEdgeState = (initialPoints?: IPoint[]) => {
  const [customPoints, setCustomPoints] = useState<IPoint[]>([])
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
    tempReconnectPoints,
    setTempReconnectPoints,
  }
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
  const { getEdges } = useReactFlow()

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
    handleFinder: (upEvent: PointerEvent) => {
      handle: string | null
      node: Node | null
      shouldClearPoints: boolean
    },
    onCustomPointsClear?: () => void
  ) => {
    const isReconnectingSource = reconnectingEndRef.current === "source"
    isReconnectingRef.current = false

    const { handle, node, shouldClearPoints } = handleFinder(upEvent)

    if (!node || shouldClearPoints) {
      reconnectingEndRef.current = null
      onCustomPointsClear?.()
      return
    }

    const newConnection = isReconnectingSource
      ? {
          source: node.id,
          target: target,
          sourceHandle: handle,
          targetHandle: targetHandleId ?? null,
        }
      : {
          source: source,
          target: node.id,
          sourceHandle: sourceHandleId ?? null,
          targetHandle: handle,
        }

    const oldEdge = getEdges().find((edge) => edge.id === id)
    if (oldEdge) {
      onReconnect(oldEdge, newConnection)
    }

    onCustomPointsClear?.()
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
        cx={sourcePoint.x}
        cy={sourcePoint.y}
        r={pathType === "straight" ? 8 : 10}
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
        r={pathType === "straight" ? 8 : 10}
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
  assessments: Record<string, Assessment>
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
        anchorRef={anchorRef}
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
