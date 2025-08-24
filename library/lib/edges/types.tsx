import { EdgeTypes } from "@xyflow/react"
import { ClassDiagramEdge } from "./edgeTypes/ClassDiagramEdge"
import { ActivityDiagramEdge } from "./edgeTypes/ActivityDiagramEdge"
import { UseCaseEdge } from "./edgeTypes/UseCaseDiagramEdge"
import { ComponentDiagramEdge } from "./edgeTypes/ComponentDiagramEdge"
import { DeploymentDiagramEdge } from "./edgeTypes/DeploymentDiagramEdge"
import { ObjectDiagramEdge } from "./edgeTypes/ObjectDiagramEdge"
import { FlowChartEdge } from "./edgeTypes/FlowChartEdge"
import { SyntaxTreeEdge } from "./edgeTypes/SyntaxTreeEdge"
import { SfcDiagramEdge } from "./edgeTypes/SfcDiagramEdge"
import { ReachabilityGraphEdge } from "./edgeTypes/ReachabilityGraphArc"

export const diagramEdgeTypes = {
  ClassAggregation: ClassDiagramEdge,
  ClassInheritance: ClassDiagramEdge,
  ClassRealization: ClassDiagramEdge,
  ClassComposition: ClassDiagramEdge,
  ClassBidirectional: ClassDiagramEdge,
  ClassUnidirectional: ClassDiagramEdge,
  ClassDependency: ClassDiagramEdge,

  ActivityControlFlow: ActivityDiagramEdge,

  ObjectLink: ObjectDiagramEdge,

  FlowChartFlowline: FlowChartEdge,

  SyntaxTreeLink: SyntaxTreeEdge,

  UseCaseAssociation: UseCaseEdge,
  UseCaseInclude: UseCaseEdge,
  UseCaseExtend: UseCaseEdge,
  UseCaseGeneralization: UseCaseEdge,

  ComponentDependency: ComponentDiagramEdge,
  ComponentProvidedInterface: ComponentDiagramEdge,
  ComponentRequiredInterface: ComponentDiagramEdge,
  ComponentRequiredThreeQuarterInterface: ComponentDiagramEdge,
  ComponentRequiredQuarterInterface: ComponentDiagramEdge,

  DeploymentAssociation: DeploymentDiagramEdge,
  DeploymentDependency: DeploymentDiagramEdge,
  DeploymentProvidedInterface: DeploymentDiagramEdge,
  DeploymentRequiredInterface: DeploymentDiagramEdge,
  DeploymentRequiredThreeQuarterInterface: DeploymentDiagramEdge,
  DeploymentRequiredQuarterInterface: DeploymentDiagramEdge,

  SfcDiagramEdge: SfcDiagramEdge,

  ReachabilityGraphArc: ReachabilityGraphEdge,
} satisfies EdgeTypes

export const edgeConfig = {
  // Class edges - all allow midpoint dragging
  ClassAggregation: { allowMidpointDragging: true },
  ClassInheritance: { allowMidpointDragging: true },
  ClassRealization: { allowMidpointDragging: true },
  ClassComposition: { allowMidpointDragging: true },
  ClassBidirectional: { allowMidpointDragging: true },
  ClassUnidirectional: { allowMidpointDragging: true },
  ClassDependency: { allowMidpointDragging: true },

  // Activity edges - allow midpoint dragging
  ActivityControlFlow: { allowMidpointDragging: true },

  // Object edge
  ObjectLink: { allowMidpointDragging: true },

  //FlowChart edge
  FlowChartFlowline: { allowMidpointDragging: true },

  SyntaxTreeLink: {},

  ReachabilityGraphArc: { allowMidpointDragging: true },
  // Use case edges - some show relationship labels
  UseCaseAssociation: { showRelationshipLabels: true }, // Show association labels
  UseCaseInclude: { showRelationshipLabels: true }, // Show <<include>>
  UseCaseExtend: { showRelationshipLabels: true }, // Show <<extend>>
  UseCaseGeneralization: { showRelationshipLabels: false }, // No stereotype labels

  // Component edges - different midpoint settings
  ComponentDependency: { allowMidpointDragging: true },
  ComponentProvidedInterface: { allowMidpointDragging: false },
  ComponentRequiredInterface: { allowMidpointDragging: false },
  ComponentRequiredThreeQuarterInterface: { allowMidpointDragging: false },
  ComponentRequiredQuarterInterface: { allowMidpointDragging: false },

  // Deployment edges - with relationship labels
  DeploymentAssociation: {
    allowMidpointDragging: true,
    showRelationshipLabels: true,
  },
  DeploymentDependency: {
    allowMidpointDragging: true,
    showRelationshipLabels: false,
  },
  DeploymentProvidedInterface: {
    allowMidpointDragging: true,
    showRelationshipLabels: false,
  },
  DeploymentRequiredInterface: {
    allowMidpointDragging: true,
    showRelationshipLabels: false,
  },
  DeploymentRequiredThreeQuarterInterface: {
    allowMidpointDragging: true,
    showRelationshipLabels: false,
  },
  DeploymentRequiredQuarterInterface: {
    allowMidpointDragging: true,
    showRelationshipLabels: false,
  },

  SfcDiagramEdge: {
    allowMidpointDragging: true,
  },
} as const

export type DiagramEdgeType = keyof typeof diagramEdgeTypes

export interface IPoint {
  x: number
  y: number
}
