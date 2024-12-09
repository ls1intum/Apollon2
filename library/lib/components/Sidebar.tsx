import { DragEvent } from 'react';
import { nodeTypes } from '../nodes/types';
import './styles/sidebar.module.css';

const onDragStart = (event: DragEvent, nodeType: keyof typeof nodeTypes) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Sidebar = () => {
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="react-flow__node-classDiagram"
        onDragStart={(event: DragEvent) => onDragStart(event, 'classDiagram')}
        draggable
      >
        Class Diagram
      </div>
      <div
        className="react-flow__node-classDiagram"
        onDragStart={(event: DragEvent) => onDragStart(event, 'package')}
        draggable
      >
        Package
      </div>
    </aside>
  );
};

export default Sidebar;
