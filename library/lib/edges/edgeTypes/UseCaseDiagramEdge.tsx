import {
  StraightPathEdge,
  StraightPathEdgeData,
} from "../pathTypes/StraightPathEdge"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { EdgeIncludeExtendLabel } from "../labelTypes/EdgeIncludeExtendLabel"
import { BaseEdgeProps } from "../GenericEdge"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"

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
}: BaseEdgeProps) => {
  const config = useEdgeConfig(
    type as
      | "UseCaseAssociation"
      | "UseCaseInclude"
      | "UseCaseExtend"
      | "UseCaseGeneralization"
  )
  const showRelationshipLabels =
    "showRelationshipLabels" in config ? config.showRelationshipLabels : false

  return (
    <StraightPathEdge
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
    >
      {(edgeData: StraightPathEdgeData) => (
        <>
          <EdgeMiddleLabels
            label={data?.label}
            pathMiddlePosition={edgeData.pathMiddlePosition}
            isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
            showRelationshipLabels={showRelationshipLabels}
            sourcePoint={edgeData.sourcePoint}
            targetPoint={edgeData.targetPoint}
            isUseCasePath={true}
          />

          <EdgeIncludeExtendLabel
            relationshipType={
              type === "UseCaseInclude"
                ? "include"
                : type === "UseCaseExtend"
                  ? "extend"
                  : undefined
            }
            showRelationshipLabels={
              type === "UseCaseInclude" || type === "UseCaseExtend"
            }
            pathMiddlePosition={edgeData.pathMiddlePosition}
            sourcePoint={edgeData.sourcePoint}
            targetPoint={edgeData.targetPoint}
          />
        </>
      )}
    </StraightPathEdge>
  )
}
