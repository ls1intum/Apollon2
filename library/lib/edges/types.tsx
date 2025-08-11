import { EdgeTypes } from "@xyflow/react"
import { ClassDiagramEdge } from "./edgeTypes/ClassDiagramEdge"
import { ActivityDiagramEdge } from "./edgeTypes/ActivityDiagramEdge"
import { UseCaseEdge } from "./edgeTypes/UseCaseDiagramEdge"
import { ExtendedEdgeProps } from "./EdgeProps"

// Helper functions to create configured edge components for each diagram type

// Class diagram edge factory
const createClassEdgeComponent = (allowMidpointDragging: boolean = true) => {
  return (props: ExtendedEdgeProps) => (
    <ClassDiagramEdge
      {...props}
      allowMidpointDragging={allowMidpointDragging}
    />
  )
}

// Activity diagram edge factory
const createActivityEdgeComponent = (allowMidpointDragging: boolean = true) => {
  return (props: ExtendedEdgeProps) => (
    <ActivityDiagramEdge
      {...props}
      allowMidpointDragging={allowMidpointDragging}
    />
  )
}

// Use case diagram edge factory
const createUseCaseEdgeComponent = (
  showRelationshipLabels: boolean = false
) => {
  return (props: ExtendedEdgeProps) => (
    <UseCaseEdge {...props} showRelationshipLabels={showRelationshipLabels} />
  )
}

export const diagramEdgeTypes = {
  // Class diagram edges - all use step paths with midpoint dragging
  ClassAggregation: createClassEdgeComponent(true),
  ClassInheritance: createClassEdgeComponent(true),
  ClassRealization: createClassEdgeComponent(true),
  ClassComposition: createClassEdgeComponent(true),
  ClassBidirectional: createClassEdgeComponent(true),
  ClassUnidirectional: createClassEdgeComponent(true),
  ClassDependency: createClassEdgeComponent(true),

  // Activity diagram edges - use step paths with midpoint dragging
  ActivityControlFlow: createActivityEdgeComponent(true),

  // Use case diagram edges - use straight paths, no midpoint dragging
  UseCaseAssociation: createUseCaseEdgeComponent(false), // No relationship labels
  UseCaseInclude: createUseCaseEdgeComponent(true), // Show <<include>>
  UseCaseExtend: createUseCaseEdgeComponent(true), // Show <<extend>>
  UseCaseGeneralization: createUseCaseEdgeComponent(false), // No relationship labels
} satisfies EdgeTypes

export type DiagramEdgeType = keyof typeof diagramEdgeTypes

export interface IPoint {
  x: number
  y: number
}
