import { nodeTypes } from 'lib/nodes/types';

export interface DropNodeData {
  type: keyof typeof nodeTypes;
  extraData?: Record<string, unknown>;
}
