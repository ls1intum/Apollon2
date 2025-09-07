import { BaseEdge } from "@xyflow/react"
import {
  BaseEdgeProps,
  EdgeEndpointMarkers,
  CommonEdgeElements,
} from "../GenericEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"
import { useStepPathEdge } from "@/hooks/useStepPathEdge"
import { useToolbar } from "@/hooks"
import { useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"
import { FeedbackDropzone } from "@/components/wrapper/FeedbackDropzone"
import { AssessmentSelectableWrapper } from "@/components"
import { getCustomColorsFromDataForEdge } from "@/index"

export const BPMNDiagramEdge = ({
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
      | "BPMNSequenceFlow"
      | "BPMNMessageFlow"
      | "BPMNAssociationFlow"
      | "BPMNDataAssociationFlow"
  )

  // For component edges, config has allowMidpointDragging
  const allowMidpointDragging =
    "allowMidpointDragging" in config ? config.allowMidpointDragging : true
  const showRelationshipLabels =
    "showRelationshipLabels" in config ? config.showRelationshipLabels : true

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
    markerStart,
    strokeDashArray,
    handlePointerDown,
    handleEndpointPointerDown,
    sourcePoint,
    targetPoint,
    isDiagramModifiable,
  } = useStepPathEdge({
    id,
    type: type,
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

  const { strokeColor, textColor } = getCustomColorsFromDataForEdge(data)

  return (
    <AssessmentSelectableWrapper elementId={id} asElement="g">
      <FeedbackDropzone elementId={id} asElement="path">
        <g className="edge-container">
          <BaseEdge
            id={id}
            path={currentPath}
            markerEnd={isReconnectingRef.current ? undefined : markerEnd}
            markerStart={isReconnectingRef.current ? undefined : markerStart}
            pointerEvents="none"
            style={{
              stroke: strokeColor,
              strokeDasharray: isReconnectingRef.current
                ? "4 4"
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
          textColor={textColor}
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
      </FeedbackDropzone>
    </AssessmentSelectableWrapper>
  )
}
