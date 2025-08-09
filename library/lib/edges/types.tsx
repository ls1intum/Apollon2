import { EdgeTypes } from "@xyflow/react"
import { GenericEdge } from "./GenericEdge"
import { ExtendedEdgeProps } from "./EdgeProps"

// Helper function to create configured edge components
const createEdgeComponent = (
  pathType: "step" | "straight",
  diagramType: "class" | "usecase" | "activity",
  allowMidpointDragging: boolean = true,
  showRelationshipLabels: boolean = false
) => {
  return (props: ExtendedEdgeProps) => (
    <GenericEdge
      {...props}
      pathType={pathType}
      diagramType={diagramType}
      allowMidpointDragging={allowMidpointDragging}
      showRelationshipLabels={showRelationshipLabels}
    />
  )
}

export const diagramEdgeTypes = {
  // Class diagram edges - use step path with midpoint dragging
  ClassAggregation: createEdgeComponent("step", "class", true, false),
  ClassInheritance: createEdgeComponent("step", "class", true, false),
  ClassRealization: createEdgeComponent("step", "class", true, false),
  ClassComposition: createEdgeComponent("step", "class", true, false),
  ClassBidirectional: createEdgeComponent("step", "class", true, false),
  ClassUnidirectional: createEdgeComponent("step", "class", true, false),
  ClassDependency: createEdgeComponent("step", "class", true, false),
  
  // Activity diagram edges - use step path with midpoint dragging
  ActivityControlFlow: createEdgeComponent("step", "activity", true, false),
  
  // Use case diagram edges - use straight path without midpoint dragging
  UseCaseAssociation: createEdgeComponent("straight", "usecase", false, false), // No relationship labels
  UseCaseInclude: createEdgeComponent("straight", "usecase", false, true), // Show <<include>>
  UseCaseExtend: createEdgeComponent("straight", "usecase", false, true), // Show <<extend>>
  UseCaseGeneralization: createEdgeComponent("straight", "usecase", false, false), // No relationship labels
} satisfies EdgeTypes

export type DiagramEdgeType = keyof typeof diagramEdgeTypes

export interface IPoint {
  x: number
  y: number
}