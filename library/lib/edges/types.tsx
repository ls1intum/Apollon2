import { EdgeTypes } from "@xyflow/react"
import { GenericEdge } from "./GenericEdge"

const edgeTypeKeys = [
  "ClassAggregation",
  "ClassInheritance",
  "ClassRealization",
  "ClassComposition",
  "ClassBidirectional",
  "ClassUnidirectional",
  "ClassDependency",
  "ActivityControlFlow",
  "BPMNSequenceFlow",
  "BPMNMessageFlow",
  "BPMNAssociationFlow",
  "BPMNDataAssociationFlow",
] as const

export const diagramEdgeTypes = Object.fromEntries(
  edgeTypeKeys.map((edgeType) => [edgeType, GenericEdge])
) as {
  [K in (typeof edgeTypeKeys)[number]]: typeof GenericEdge
} satisfies EdgeTypes

export type DiagramEdgeType = keyof typeof diagramEdgeTypes

export interface IPoint {
  x: number
  y: number
}
