import { StepPathEdge, StepPathEdgeData } from "../pathTypes/StepPathEdge"
import { BaseEdgeProps } from "../GenericEdge"

interface SfcDiagramEdgeProps extends BaseEdgeProps {
  allowMidpointDragging?: boolean
  enableReconnection?: boolean
  enableStraightPath?: boolean
}

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
  allowMidpointDragging = true,
  enableReconnection = true,
  enableStraightPath = true,
}: SfcDiagramEdgeProps) => {
  const { isNegated, displayName, showBar } = getParsedEdgeData(data)

  return (
    <StepPathEdge
      id={id}
      type={type}
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
    >
      {(edgeData: StepPathEdgeData) => (
        <>
          {/* SFC Transition - show crossbar and label if there's text */}
          {displayName && (
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

              {/* Label text positioned above the crossbar */}
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
            </g>
          )}
        </>
      )}
    </StepPathEdge>
  )
}
