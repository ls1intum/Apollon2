import { EdgeTypes } from "@xyflow/react";
import {
  InheritanceEdge,
  RealizationEdge,
  AggregationEdge,
  CompositionEdge,
} from "./edges";

export const diagramEdgeTypes = {
  inheritance: InheritanceEdge,
  realization: RealizationEdge,
  aggregation: AggregationEdge,
  composition: CompositionEdge,
} satisfies EdgeTypes;

export type DiagramEdgeTypeKeys = keyof typeof diagramEdgeTypes;
