import { BaseEdge } from "@xyflow/react"
import {
  BaseEdgeProps,
  EdgeEndpointMarkers,
  CommonEdgeElements,
} from "../GenericEdge"
import { EdgeMultipleLabels } from "../labelTypes/EdgeMultipleLabels"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"
import { DiagramEdgeType } from "@/edges/types"
import { useStepPathEdge } from "@/hooks/useStepPathEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"
import { FeedbackDropzone } from "@/components/wrapper/FeedbackDropzone"

export const CommunicationDiagramEdge = ({
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

  const config = useEdgeConfig(type as DiagramEdgeType)

  const allowMidpointDragging =
    "allowMidpointDragging" in config ? config.allowMidpointDragging : true

  const { assessments } = useDiagramStore(
    useShallow((state) => ({
      assessments: state.assessments,
    }))
  )

  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )

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
    allowMidpointDragging,
    enableReconnection: true,
    enableStraightPath: false,
  })

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
            strokeDasharray: isReconnectingRef.current
              ? "none"
              : strokeDashArray,
            transition: hasInitialCalculation ? "opacity 0.1s ease-in" : "none",
            opacity: 1,
          }}
        />

        <FeedbackDropzone elementId={id} asElement="path">
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
        </FeedbackDropzone>

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

      <EdgeMultipleLabels
        labels={data?.labels || []}
        messages={data?.messages}
        pathMiddlePosition={edgeData.pathMiddlePosition}
        isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
        showRelationshipLabels={true}
        isReconnectingRef={isReconnectingRef}
      />

      <CommonEdgeElements
        id={id}
        pathMiddlePosition={edgeData.pathMiddlePosition}
        isDiagramModifiable={isDiagramModifiable}
        assessments={assessments}
        anchorRef={anchorRef}
        handleDelete={handleDelete}
        setPopOverElementId={setPopOverElementId}
        type={type}
      />
    </>
  )
}
