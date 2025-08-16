import { EdgeTypes } from "@xyflow/react"
import { ClassDiagramEdge } from "./edgeTypes/ClassDiagramEdge"
import { ActivityDiagramEdge } from "./edgeTypes/ActivityDiagramEdge"
import { UseCaseEdge } from "./edgeTypes/UseCaseDiagramEdge"
import { ExtendedEdgeProps } from "./EdgeProps"

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

const createUseCaseEdgeComponent = (
  showRelationshipLabels: boolean = false
) => {
  const Component = (props: ExtendedEdgeProps) => (
    <UseCaseEdge {...props} showRelationshipLabels={showRelationshipLabels} />
  )
  Component.displayName = `UseCaseEdgeFactory(${showRelationshipLabels})`
  return Component
}


// const edgeTypeKeys = [
//   "ClassAggregation",
//   "ClassInheritance",
//   "ClassRealization",
//   "ClassComposition",
//   "ClassBidirectional",
//   "ClassUnidirectional",
//   "ClassDependency",
//   "ActivityControlFlow",
//   "BPMNSequenceFlow",
//   "BPMNMessageFlow",
//   "BPMNAssociationFlow",
//   "BPMNDataAssociationFlow",
// ] as const

export const diagramEdgeTypes = {
  ClassAggregation: createClassEdgeComponent(true),
  ClassInheritance: createClassEdgeComponent(true),
  ClassRealization: createClassEdgeComponent(true),
  ClassComposition: createClassEdgeComponent(true),
  ClassBidirectional: createClassEdgeComponent(true),
  ClassUnidirectional: createClassEdgeComponent(true),
  ClassDependency: createClassEdgeComponent(true),
  ActivityControlFlow: createActivityEdgeComponent(true),
  UseCaseAssociation: createUseCaseEdgeComponent(false),
  UseCaseInclude: createUseCaseEdgeComponent(true),
  UseCaseExtend: createUseCaseEdgeComponent(true),
  UseCaseGeneralization: createUseCaseEdgeComponent(false),
} satisfies EdgeTypes

export type DiagramEdgeType = keyof typeof diagramEdgeTypes

export interface IPoint {
  x: number
  y: number
}
