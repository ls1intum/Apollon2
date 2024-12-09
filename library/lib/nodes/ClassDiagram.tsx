import {
  Handle,
  NodeResizer,
  NodeToolbar,
  Position,
  type NodeProps,
  type Node,
  useReactFlow,
} from '@xyflow/react';
import { memo, useEffect, useState } from 'react';

import Attributes from '../components/Attributes';
import Methods from '../components/Methods';
import { useDetachNodes } from '../hooks';

export type ClassDiagramNodeType = Node<
  {
    label: string;
    methods: { id: string; name: string }[];
    attributes: { id: string; name: string }[];
    classDiagramType: 'abstract' | 'interface' | 'enumeration';
  },
  'classDiagram'
>;

function ClassDiagram({
  selected,
  data,
  id,
  parentId,
}: NodeProps<ClassDiagramNodeType>) {
  const reactFlow = useReactFlow();
  const [editEnabled, setEditEnabled] = useState(false);
  const detachNodes = useDetachNodes();

  const updateNodeLabel = (id: string, newValue: string) => {
    reactFlow.updateNodeData(id, { label: newValue });
  };

  useEffect(() => {
    if (!selected) setEditEnabled(false);
  }, [selected]);

  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={100}
      />
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        align="end"
        offset={10}
      >
        {!!parentId && (
          <button onClick={() => detachNodes([id])}>Detach</button>
        )}
        <button onClick={() => setEditEnabled((prev) => !prev)}>Edit</button>
      </NodeToolbar>
      <div style={{ margin: 5, display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontSize: 12, padding: 0, margin: 0, textAlign: 'center' }}>
          {`<<${data.classDiagramType}>>`}
        </p>
        <input
          value={data.label}
          style={{ textAlign: 'center' }}
          disabled={!selected}
          onChange={(e) => updateNodeLabel(id, e.target.value)}
        />
      </div>
      <Divider />
      <Attributes
        id={id}
        attributes={data.attributes}
        editEnabled={editEnabled}
      />
      <Divider />
      <Methods id={id} methods={data.methods} editEnabled={editEnabled} />
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        style={{ left: 10 }}
        type="source"
        position={Position.Bottom}
        id="b"
      />
      <Handle type="target" position={Position.Top} />
    </>
  );
}

function Divider() {
  return <div style={{ height: 1, width: '100%', backgroundColor: 'black' }} />;
}

export default memo(ClassDiagram);
