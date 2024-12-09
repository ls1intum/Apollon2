import { NodeTypes } from '@xyflow/react';
import { Class, Package } from './classDiagram';

export const nodeTypes = {
  class: Class,
  package: Package,
} satisfies NodeTypes;
