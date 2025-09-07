import { BaseEdge } from "@xyflow/react"
import { BaseEdgeProps, CommonEdgeElements } from "../GenericEdge"
import { useStepPathEdge } from "@/hooks/useStepPathEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { useMemo, useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"
import { FeedbackDropzone } from "@/components/wrapper/FeedbackDropzone"
import { AssessmentSelectableWrapper } from "@/components"

function getParsedEdgeData(data: unknown): {
  isNegated: boolean
  displayName: string
  showBar: boolean
} {
  if (
    !data ||
    typeof data !== "object" ||
    !("label" in data) ||
    !(data as Record<string, unknown>).label
  ) {
    return { isNegated: false, displayName: "", showBar: false }
  }

  const label = (data as Record<string, unknown>).label as string

  try {
    const parsed = JSON.parse(label)
    return {
      isNegated: parsed.isNegated || false,
      displayName: parsed.displayName || "",
      showBar: parsed.showBar !== false, // default to true
    }
  } catch {
    return { isNegated: false, displayName: label, showBar: true }
  }
}

export const SfcDiagramEdge = ({
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

  const allowMidpointDragging = true
  const enableStraightPath = true

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
    enableStraightPath,
  })

  const { isNegated, displayName, showBar } = getParsedEdgeData(data)

  const labelPosition = {
    x: edgeData.isMiddlePathHorizontal
      ? edgeData.pathMiddlePosition.x
      : edgeData.pathMiddlePosition.x + 30,
    y: edgeData.isMiddlePathHorizontal
      ? edgeData.pathMiddlePosition.y - 30
      : edgeData.pathMiddlePosition.y,
    textAnchor: edgeData.isMiddlePathHorizontal ? "middle" : ("start" as const),
    dominantBaseline: edgeData.isMiddlePathHorizontal
      ? "middle"
      : ("middle" as const),
  }
  const crossbarLength = 20
  const crossbarCoordinates = useMemo(() => {
    if (edgeData.isMiddlePathHorizontal) {
      // If middle segment is horizontal, make crossbar vertical
      return {
        x1: edgeData.pathMiddlePosition.x,
        y1: edgeData.pathMiddlePosition.y - crossbarLength,
        x2: edgeData.pathMiddlePosition.x,
        y2: edgeData.pathMiddlePosition.y + crossbarLength,
        orientation: "vertical" as const,
      }
    } else {
      // If middle segment is vertical, make crossbar horizontal
      return {
        x1: edgeData.pathMiddlePosition.x - crossbarLength,
        y1: edgeData.pathMiddlePosition.y,
        x2: edgeData.pathMiddlePosition.x + crossbarLength,
        y2: edgeData.pathMiddlePosition.y,
        orientation: "horizontal" as const,
      }
    }
  }, [
    edgeData.isMiddlePathHorizontal,
    edgeData.pathMiddlePosition,
    crossbarLength,
  ])

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
              stroke: "var(--apollon2-primary-contrast)",
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

          {/* SFC Transition - show crossbar and label */}
          <g>
            {/* Crossbar - perpendicular to middle segment direction */}
            {showBar && (
              <line
                x1={crossbarCoordinates.x1}
                y1={crossbarCoordinates.y1}
                x2={crossbarCoordinates.x2}
                y2={crossbarCoordinates.y2}
                stroke="var(--apollon2-primary-contrast)"
                strokeWidth="10"
              />
            )}

            {/* SFC Label - positioned based on edge orientation */}
            {displayName && (
              <text
                x={labelPosition.x}
                y={labelPosition.y}
                fill="var(--apollon2-primary-contrast)"
                textAnchor={labelPosition.textAnchor}
                dominantBaseline={labelPosition.dominantBaseline}
                fontSize="14"
                textDecoration={isNegated ? "overline" : undefined}
              >
                {displayName}
              </text>
            )}
          </g>
        </g>

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
