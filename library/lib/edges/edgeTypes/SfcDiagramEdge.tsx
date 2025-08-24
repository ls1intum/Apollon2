import { BaseEdge } from "@xyflow/react"
import { BaseEdgeProps, CommonEdgeElements } from "../GenericEdge"
import { useStepPathEdge } from "@/hooks/useStepPathEdge"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useToolbar } from "@/hooks"
import { useRef } from "react"
import { EDGE_HIGHTLIGHT_STROKE_WIDTH } from "@/constants"

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

  console.log({ isNegated, displayName, showBar })

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
          {/* Crossbar - thick horizontal line at the middle */}
          {showBar && (
            <line
              x1={edgeData.pathMiddlePosition.x - 20}
              y1={edgeData.pathMiddlePosition.y}
              x2={edgeData.pathMiddlePosition.x + 20}
              y2={edgeData.pathMiddlePosition.y}
              stroke="black"
              strokeWidth="10"
            />
          )}

          {displayName && (
            <text
              x={edgeData.pathMiddlePosition.x}
              y={edgeData.pathMiddlePosition.y - 20}
              fill="black"
              textAnchor="middle"
              dominantBaseline="middle"
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
    </>
  )
}
