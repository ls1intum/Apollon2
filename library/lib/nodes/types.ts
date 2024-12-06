import { NodeTypes } from '@xyflow/react';
import SimpleNode from './SimpleNode';
import Package from './Package';
import ClassDiagram from './ClassDiagram';

export const nodeTypes = {
  classDiagram: ClassDiagram,
  package: Package,
  simpleNode: SimpleNode,
} satisfies NodeTypes;
