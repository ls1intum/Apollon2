import { memo } from 'react';
import {
  NodeProps,
  NodeToolbar,
  useReactFlow,
  useStore,
  useStoreApi,
  NodeResizer,
  type Node,
} from '@xyflow/react';

import { getRelativeNodesBounds } from '../../utils';
import { useDetachNodes } from '../../hooks';

const lineStyle = { borderColor: 'gray' };

export type PackageType = Node<{ label: string }, 'package'>;

function Component({ id, selected, data: { label } }: NodeProps<PackageType>) {
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const detachNodes = useDetachNodes();
  const reactFlow = useReactFlow();

  const { minWidth, minHeight, hasChildNodes } = useStore((store) => {
    const childNodes = Array.from(store.nodeLookup.values()).filter(
      (n) => n.parentId === id,
    );
    const rect = getRelativeNodesBounds(childNodes);

    return {
      minWidth: rect.x + rect.width,
      minHeight: rect.y + rect.height,
      hasChildNodes: childNodes.length > 0,
    };
  }, isEqual);

  const onDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  const onDetach = () => {
    const childNodeIds = Array.from(store.getState().nodeLookup.values())
      .filter((n) => n.parentId === id)
      .map((n) => n.id);

    detachNodes(childNodeIds, id);
  };

  const updateNodeLabel = (id: string, newValue: string) => {
    reactFlow.updateNodeData(id, { label: newValue });
  };

  return (
    <div>
      <NodeResizer
        lineStyle={lineStyle}
        minHeight={minHeight}
        minWidth={minWidth}
      />
      <NodeToolbar className="nodrag">
        <button onClick={onDelete}>Delete</button>
        {hasChildNodes && <button onClick={onDetach}>Ungroup</button>}
      </NodeToolbar>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {selected ? (
          <input
            value={label}
            onChange={(e) => updateNodeLabel(id, e.target.value)}
          />
        ) : (
          <div>{label}</div>
        )}
      </div>
    </div>
  );
}

interface IsEqualCompareObj {
  minWidth: number;
  minHeight: number;
  hasChildNodes: boolean;
}

function isEqual(prev: IsEqualCompareObj, next: IsEqualCompareObj): boolean {
  return (
    prev.minWidth === next.minWidth &&
    prev.minHeight === next.minHeight &&
    prev.hasChildNodes === next.hasChildNodes
  );
}

export const Package = memo(Component);
