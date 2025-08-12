import { EdgeTypes } from "@xyflow/react"
import { ClassDiagramEdge } from "./edgeTypes/ClassDiagramEdge"
import { ActivityDiagramEdge } from "./edgeTypes/ActivityDiagramEdge"
import { UseCaseEdge } from "./edgeTypes/UseCaseDiagramEdge"
import { ExtendedEdgeProps } from "./EdgeProps"

// Class diagram edge factory
const createClassEdgeComponent = (allowMidpointDragging: boolean = true) => {
  const Component = (props: ExtendedEdgeProps) => (
    <ClassDiagramEdge
      {...props}
      allowMidpointDragging={allowMidpointDragging}
    />
  )
  Component.displayName = `ClassDiagramEdgeFactory(${allowMidpointDragging})`
  return Component
}

// Activity diagram edge factory
const createActivityEdgeComponent = (allowMidpointDragging: boolean = true) => {
  const Component = (props: ExtendedEdgeProps) => (
    <ActivityDiagramEdge
      {...props}
      allowMidpointDragging={allowMidpointDragging}
    />
  )
  Component.displayName = `ActivityDiagramEdgeFactory(${allowMidpointDragging})`
  return Component
}

// Use case diagram edge factory
const createUseCaseEdgeComponent = (
  showRelationshipLabels: boolean = false
) => {
  const Component = (props: ExtendedEdgeProps) => (
    <UseCaseEdge {...props} showRelationshipLabels={showRelationshipLabels} />
  )
  Component.displayName = `UseCaseEdgeFactory(${showRelationshipLabels})`
  return Component
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
  ActivityControlFlow: createActivityEdgeComponent(true),
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
