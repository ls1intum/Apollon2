import { StepPathEdge } from "../pathTypes/StepPathEdge"
import { BaseEdgeProps } from "../GenericEdge"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useMemo } from "react"
import { Position } from "@xyflow/react"

interface ComponentDiagramEdgeProps extends BaseEdgeProps {
  allowMidpointDragging?: boolean
  enableReconnection?: boolean
  enableStraightPath?: boolean
}

const arePositionsOpposite = (pos1: Position, pos2: Position): boolean => {
  return (
    (pos1 === Position.Left && pos2 === Position.Right) ||
    (pos1 === Position.Right && pos2 === Position.Left) ||
    (pos1 === Position.Top && pos2 === Position.Bottom) ||
    (pos1 === Position.Bottom && pos2 === Position.Top)
  )
}

const getPositionFromHandleId = (handleId: string | null): Position => {
  if (!handleId) return Position.Right // default

  if (handleId.includes("left")) return Position.Left
  if (handleId.includes("right")) return Position.Right
  if (handleId.includes("top")) return Position.Top
  if (handleId.includes("bottom")) return Position.Bottom

  return Position.Right
}

export const ComponentDiagramEdge = ({
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
}: ComponentDiagramEdgeProps) => {
  const { edges } = useDiagramStore(
    useShallow((state) => ({
      edges: state.edges,
    }))
  )

  const dynamicEdgeType = useMemo(() => {
    console.log("EDGE type", type)
    if (type !== "ComponentRequiredInterface") {
      return type
    }

    const currentRequiredInterfaces = edges.filter(
      (edge) =>
        edge.target === target && edge.type === "ComponentRequiredInterface"
    )

    const currentAllInterfaces = edges.filter(
      (edge) =>
        edge.target === target &&
        (edge.type === "ComponentRequiredInterface" ||
          edge.type === "ComponentProvidedInterface")
    )

    const currentTargetPosition = getPositionFromHandleId(targetHandleId!)
    const hasOppositeRequiredInterface = currentRequiredInterfaces
      .filter((edge) => edge.id !== id)
      .some((otherEdge) => {
        const otherPosition = getPositionFromHandleId(otherEdge.targetHandle!)
        return arePositionsOpposite(currentTargetPosition, otherPosition)
      })
    switch (currentRequiredInterfaces.length) {
      case 1:
        if (currentAllInterfaces.length === currentRequiredInterfaces.length) {
          return "ComponentRequiredInterface"
        } else {
          return "ComponentRequiredThreeQuarterInterface"
        }
      case 2:
        if (hasOppositeRequiredInterface) {
          return "ComponentRequiredThreeQuarterInterface"
        } else {
          return "ComponentRequiredQuarterInterface"
        }

      default:
        return "ComponentRequiredQuarterInterface"
    }
  }, [
    type,
    target,
    targetHandleId,
    id,
    edges,
    edges.length,
    JSON.stringify(
      edges.map((e) => ({
        id: e.id,
        type: e.type,
        target: e.target,
        targetHandle: e.targetHandle,
      }))
    ),
  ])

  return (
    <StepPathEdge
      id={id}
      type={dynamicEdgeType}
      source={source}
      target={target}
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      sourceHandleId={sourceHandleId}
      targetHandleId={targetHandleId}
      data={data}
      allowMidpointDragging={allowMidpointDragging}
      enableReconnection={enableReconnection}
      enableStraightPath={enableStraightPath}
    ></StepPathEdge>
  )
}
