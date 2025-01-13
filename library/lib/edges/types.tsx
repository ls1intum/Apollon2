import { EdgeTypes } from "@xyflow/react"
import {
  InheritanceEdge,
  RealizationEdge,
  AggregationEdge,
  CompositionEdge,
  BiAssociationEdge,
  UniAssociationEdge,
  DependencyEdge,
} from "./edges"
export const diagramEdgeTypes = {
  inheritance: InheritanceEdge,
  realization: RealizationEdge,
  aggregation: AggregationEdge,
  composition: CompositionEdge,
  biassociation: BiAssociationEdge,
  uniassociation: UniAssociationEdge,
  dependency: DependencyEdge,
} satisfies EdgeTypes

export type DiagramEdgeTypeKeys = keyof typeof diagramEdgeTypes
