import { EdgeTypes } from "@xyflow/react"
import { InheritanceEdge } from "./InheritanceEdge"
import { RealizationEdge } from "./RealizationEdge"
import { AggregationEdge } from "./AggregationEdge"
import { CompositionEdge } from "./CompositionEdge"
import { BiAssociationEdge } from "./BiAssociationEdge"
import { UniAssociationEdge } from "./UniAssociationEdge"
import { DependencyEdge } from "./DependencyEdge"
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
