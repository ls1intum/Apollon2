import { EdgeTypes } from "@xyflow/react"
//import { InheritanceEdge } from "./InheritanceEdge"
// import { RealizationEdge } from "./RealizationEdge"
// import { AggregationEdge } from "./AggregationEdge"
// import { CompositionEdge } from "./CompositionEdge"
// import { BiAssociationEdge } from "./BiAssociationEdge"
// import { UniAssociationEdge } from "./UniAssociationEdge"
// import { DependencyEdge } from "./DependencyEdge"
import { GenericEdge } from "./GenericEdge"

// export const diagramEdgeTypes = {
//   aggregation: GenericEdge,
//     inheritance: GenericEdge,
//   realization: GenericEdge,
//   composition: GenericEdge,
//   biassociation: GenericEdge,
//   uniassociation: GenericEdge,
//   dependency: GenericEdge,
// } satisfies EdgeTypes
const edgeTypeKeys = [
  "ClassAggregation",
  "ClassInheritance",
  "ClassRealization",
  "ClassComposition",
  "ClassBidirectional",
  "ClassUnidirectional",
  "ClassDependency",
] as const

export const diagramEdgeTypes = Object.fromEntries(
  edgeTypeKeys.map((edgeType) => [edgeType, GenericEdge])
) as {
  [K in (typeof edgeTypeKeys)[number]]: typeof GenericEdge
} satisfies EdgeTypes

export type DiagramEdgeTypeKeys = keyof typeof diagramEdgeTypes
