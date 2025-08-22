import { StepPathEdge, StepPathEdgeData } from "../pathTypes/StepPathEdge"
import { EdgeEndLabels } from "../labelTypes/EdgeEndLabels"
import { EdgeMiddleLabels } from "../labelTypes/EdgeMiddleLabels"
import { BaseEdgeProps } from "../GenericEdge"
import { useEdgeConfig } from "@/hooks/useEdgeConfig"

export const ClassDiagramEdge = ({
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
      | "ClassAggregation"
      | "ClassInheritance"
      | "ClassRealization"
      | "ClassComposition"
      | "ClassBidirectional"
      | "ClassUnidirectional"
      | "ClassDependency"
  )

  const allowMidpointDragging =
    "allowMidpointDragging" in config ? config.allowMidpointDragging : true
  const enableStraightPath =
    "enableStraightPath" in config
      ? (config.enableStraightPath as boolean)
      : true

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
      enableReconnection={true}
      enableStraightPath={enableStraightPath}
    >
      {(edgeData: StepPathEdgeData) => (
        <>
          <EdgeEndLabels
            data={data}
            activePoints={edgeData.activePoints}
            sourceX={sourceX}
            sourceY={sourceY}
            targetX={targetX}
            targetY={targetY}
            sourcePosition={sourcePosition}
            targetPosition={targetPosition}
          />
          <EdgeMiddleLabels
            label={data?.label}
            pathMiddlePosition={edgeData.pathMiddlePosition}
            isMiddlePathHorizontal={edgeData.isMiddlePathHorizontal}
            showRelationshipLabels={true}
          />
        </>
      )}
    </StepPathEdge>
  )
}
