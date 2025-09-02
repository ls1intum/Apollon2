import { BaseEdge } from "@xyflow/react"
import {
  BaseEdgeProps,
  EdgeEndpointMarkers,
  CommonEdgeElements,
} from "../GenericEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { Position } from "@xyflow/react"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"
import { useStepPathEdge } from "@/hooks/useStepPathEdge"
import { useToolbar } from "@/hooks"
import { useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"
import { FeedbackDropzone } from "@/components/wrapper/FeedbackDropzone"
import { AssessmentSelectableWrapper } from "@/components"

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
}: BaseEdgeProps) => {
  const anchorRef = useRef<SVGSVGElement | null>(null)
  const { handleDelete } = useToolbar({ id })

  const config = useEdgeConfig(
    type as
      | "ComponentDependency"
      | "ComponentProvidedInterface"
      | "ComponentRequiredInterface"
      | "ComponentRequiredThreeQuarterInterface"
      | "ComponentRequiredQuarterInterface"
  )

  // For component edges, config has allowMidpointDragging
  const allowMidpointDragging =
    "allowMidpointDragging" in config ? config.allowMidpointDragging : true
  const showRelationshipLabels =
    "showRelationshipLabels" in config ? config.showRelationshipLabels : false

  const { edges, assessments } = useDiagramStore(
    useShallow((state) => ({
      edges: state.edges,
      assessments: state.assessments,
    }))
  )

  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )

  const dynamicEdgeType = (() => {
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
  })()

  const {
    pathRef,
    edgeData,
    currentPath,
    overlayPath,
    midpoints,
    hasInitialCalculation,
    isReconnectingRef,
    markerEnd,
    strokeDashArray,
    handlePointerDown,
    handleEndpointPointerDown,
    sourcePoint,
    targetPoint,
    isDiagramModifiable,
  } = useStepPathEdge({
    id,
    type: dynamicEdgeType,
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
    allowMidpointDragging,
    enableReconnection: true,
    enableStraightPath: false,
  })

  return (
    <AssessmentSelectableWrapper elementId={id} asElement="g">
      <FeedbackDropzone elementId={id} asElement="path">
        <g className="edge-container">
          <BaseEdge
            id={id}
            path={currentPath}
            markerEnd={isReconnectingRef.current ? undefined : markerEnd}
            pointerEvents="none"
            style={{
              stroke: isReconnectingRef.current ? "#b1b1b7" : "black",
              strokeDasharray: isReconnectingRef.current
                ? "none"
                : strokeDashArray,
              transition: hasInitialCalculation
                ? "opacity 0.1s ease-in"
                : "none",
              opacity: 1,
            }}
          />

          <path
            ref={pathRef}
            className="edge-overlay"
            d={overlayPath}
            fill="none"
            strokeWidth={EDGE_HIGHTLIGHT_STROKE_WIDTH}
            pointerEvents="stroke"
            style={{
              opacity: isReconnectingRef.current ? 0 : 0.4,
            }}
          />

          <EdgeEndpointMarkers
            sourcePoint={sourcePoint}
            targetPoint={targetPoint}
            isDiagramModifiable={isDiagramModifiable}
            diagramType="step"
            pathType="step"
            onSourcePointerDown={(e) => handleEndpointPointerDown(e, "source")}
            onTargetPointerDown={(e) => handleEndpointPointerDown(e, "target")}
          />

          {isDiagramModifiable &&
            !isReconnectingRef.current &&
            allowMidpointDragging &&
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
                style={{ cursor: "grab", zIndex: 9999 }}
                onPointerDown={(e) => handlePointerDown(e, midPointIndex)}
              />
            ))}
        </g>

        <EdgeMiddleLabels
          label={data?.label}
          pathMiddlePosition={edgeData.pathMiddlePosition}
          isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
          showRelationshipLabels={showRelationshipLabels}
        />

        <CommonEdgeElements
          id={id}
          pathMiddlePosition={edgeData.pathMiddlePosition}
          isDiagramModifiable={isDiagramModifiable}
          assessments={assessments}
          anchorRef={anchorRef}
          handleDelete={handleDelete}
          setPopOverElementId={setPopOverElementId}
          type={dynamicEdgeType}
        />
      </FeedbackDropzone>
    </AssessmentSelectableWrapper>
  )
}
