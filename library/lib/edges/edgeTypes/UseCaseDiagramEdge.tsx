import {
  StraightPathEdge,
  StraightPathEdgeData,
} from "../pathTypes/StraightPathEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"
import {
  adjustTargetCoordinates,
  adjustSourceCoordinates,
  getEdgeMarkerStyles,
} from "@/utils/edgeUtils"
import { MARKER_PADDING, SOURCE_CONNECTION_POINT_PADDING } from "@/constants"
import { useMemo } from "react"
import { EdgeIncludeExtendLabel } from "../labelTypes/EdgeIncludeExtendLabel"

interface UseCaseEdgeProps extends BaseEdgeProps {
  showRelationshipLabels?: boolean
}

export const UseCaseEdge = ({
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
  showRelationshipLabels = false,
}: UseCaseEdgeProps) => {
  const adjustedCoordinates = useMemo(() => {
    const { markerPadding } = getEdgeMarkerStyles(type)
    const padding = markerPadding ?? MARKER_PADDING

    const adjustedTarget = adjustTargetCoordinates(
      targetX,
      targetY,
      targetPosition || "right",
      padding
    )
    const adjustedSource = adjustSourceCoordinates(
      sourceX,
      sourceY,
      sourcePosition || "left",
      SOURCE_CONNECTION_POINT_PADDING
    )

    return { adjustedSource, adjustedTarget }
  }, [
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    type,
    id,
  ])

  const relationshipType =
    type === "UseCaseInclude"
      ? "include"
      : type === "UseCaseExtend"
        ? "extend"
        : undefined

  const showIncludeExtendLabel =
    relationshipType === "include" || relationshipType === "extend"
  const showMiddleLabel = !relationshipType

  return (
    <StraightPathEdge
      id={id}
      type={type}
      source={source}
      target={target}
      sourceX={adjustedCoordinates.adjustedSource.sourceX}
      sourceY={adjustedCoordinates.adjustedSource.sourceY}
      targetX={adjustedCoordinates.adjustedTarget.targetX}
      targetY={adjustedCoordinates.adjustedTarget.targetY}
      sourcePosition={sourcePosition}
      targetPosition={targetPosition}
      sourceHandleId={sourceHandleId}
      targetHandleId={targetHandleId}
      data={data}
    >
      {(edgeData: StraightPathEdgeData) => (
        <>
          {/* Show include/extend labels for include/extend relationships */}
          {showIncludeExtendLabel && (
            <EdgeIncludeExtendLabel
              relationshipType={relationshipType}
              pathMiddlePosition={edgeData.pathMiddlePosition}
              sourcePoint={{
                x: adjustedCoordinates.adjustedSource.sourceX,
                y: adjustedCoordinates.adjustedSource.sourceY,
              }}
              targetPoint={{
                x: adjustedCoordinates.adjustedTarget.targetX,
                y: adjustedCoordinates.adjustedTarget.targetY,
              }}
              showRelationshipLabels={showRelationshipLabels}
            />
          )}

          {/* Show middle label for association relationships */}
          {showMiddleLabel && (
            <EdgeMiddleLabels
              label={data?.label}
              pathMiddlePosition={edgeData.pathMiddlePosition}
              isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
              sourcePoint={{
                x: adjustedCoordinates.adjustedSource.sourceX,
                y: adjustedCoordinates.adjustedSource.sourceY,
              }}
              targetPoint={{
                x: adjustedCoordinates.adjustedTarget.targetX,
                y: adjustedCoordinates.adjustedTarget.targetY,
              }}
              showRelationshipLabels={showRelationshipLabels}
              isUseCasePath={true}
            />
          )}
        </>
      )}
    </StraightPathEdge>
  )
}
