import { BaseEdge } from "@xyflow/react"
import {
  BaseEdgeProps,
  CommonEdgeElements,
  EdgeEndpointMarkers,
} from "../GenericEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"
import { useStraightPathEdge } from "@/hooks/useStraightPathEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"
import {
  AssessmentSelectableWrapper,
  FeedbackDropzone,
} from "@/components/wrapper"

export const PetriNetEdge = ({
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

  const config = useEdgeConfig(type as "PetriNetArc")
  const showRelationshipLabels =
    "showRelationshipLabels" in config ? config.showRelationshipLabels : false

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
    markerEnd,
    strokeDashArray,
    sourcePoint,
    targetPoint,
    isDiagramModifiable,
    handleEndpointPointerDown,
    isReconnectingRef,
    tempReconnectPath,
  } = useStraightPathEdge({
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
  })

  return (
    <AssessmentSelectableWrapper elementId={id} asElement="g">
      <FeedbackDropzone elementId={id} asElement="path">
        <g className="edge-container">
          <BaseEdge
            id={id}
            path={tempReconnectPath || currentPath}
            markerEnd={isReconnectingRef.current ? undefined : markerEnd}
            pointerEvents="none"
            style={{
              stroke: "var(--apollon-primary-contrast)",
              strokeDasharray: strokeDashArray,
            }}
          />

          <path
            ref={pathRef}
            className="edge-overlay"
            d={overlayPath}
            fill="none"
            strokeWidth={EDGE_HIGHTLIGHT_STROKE_WIDTH}
            pointerEvents="stroke"
            style={{ opacity: isReconnectingRef.current ? 0 : 0.4 }}
          />

          {/* Temporary reconnection path */}
          {/* Removed - now using tempReconnectPath directly in BaseEdge */}

          {isDiagramModifiable && !isReconnectingRef.current && (
            <EdgeEndpointMarkers
              sourcePoint={sourcePoint}
              targetPoint={targetPoint}
              isDiagramModifiable={isDiagramModifiable}
              diagramType="petriNet"
              pathType="straight"
              onSourcePointerDown={(e) =>
                handleEndpointPointerDown(e, "source")
              }
              onTargetPointerDown={(e) =>
                handleEndpointPointerDown(e, "target")
              }
            />
          )}
        </g>

        {!isReconnectingRef.current && (
          <>
            <EdgeMiddleLabels
              label={data?.label}
              pathMiddlePosition={edgeData.pathMiddlePosition}
              isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
              showRelationshipLabels={showRelationshipLabels}
              sourcePoint={edgeData.sourcePoint}
              targetPoint={edgeData.targetPoint}
              isUseCasePath={true}
              isPetriNet={true}
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
        )}
      </FeedbackDropzone>
    </AssessmentSelectableWrapper>
  )
}
