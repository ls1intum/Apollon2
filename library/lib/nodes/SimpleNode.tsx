import { memo } from 'react';
import {
  Handle,
  Position,
  NodeToolbar,
  NodeProps,
  useStore,
  useReactFlow,
  type Node,
} from '@xyflow/react';
import { useDetachNodes } from '../hooks';

export type SimpleNodeType = Node<{ label: string }, 'simpleNode'>;

function SimpleNode({ id, data }: NodeProps<SimpleNodeType>) {
  const hasParent = useStore((store) => !!store.nodeLookup.get(id)?.parentId);
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();

  const onDelete = () => deleteElements({ nodes: [{ id }] });
  const onDetach = () => detachNodes([id]);

  return (
    <>
      <NodeToolbar className="nodrag">
        <button onClick={onDelete}>Delete</button>
        {hasParent && <button onClick={onDetach}>Detach</button>}
      </NodeToolbar>
      <Handle type="target" position={Position.Left} />
      <div className="icon">△</div>
      <div className="label">{data?.label}</div>
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default memo(SimpleNode);
