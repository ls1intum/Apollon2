import { DragEvent } from 'react';

import './styles/sidebar.module.css';
import { DropNodeData } from '@types';
import { v4 as uuidv4 } from 'uuid';
import { ClassType } from '@nodes/classDiagram';

const onDragStart = (event: DragEvent, { type, extraData }: DropNodeData) => {
  event.dataTransfer.setData('text/plain', JSON.stringify({ type, extraData }));
  event.dataTransfer.effectAllowed = 'move';
};

export const Sidebar = () => {
  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="react-flow__node-classDiagram"
        onDragStart={(event: DragEvent) =>
          onDragStart(event, { type: 'package' })
        }
        draggable
      >
        Package
      </div>
      <div
        className="react-flow__node-classDiagram"
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: 'class',
            extraData: {
              methods: [{ id: uuidv4(), name: '+ method()' }],
              attributes: [{ id: uuidv4(), name: '+ attribute: Type' }],
            },
          })
        }
        draggable
      >
        Class
      </div>
      <div
        className="react-flow__node-classDiagram"
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: 'class',
            extraData: {
              classType: ClassType.Abstract,
              methods: [{ id: uuidv4(), name: '+ method()' }],
              attributes: [{ id: uuidv4(), name: '+ attribute: Type' }],
            },
          })
        }
        draggable
      >
        Abstract
      </div>
      <div
        className="react-flow__node-classDiagram"
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: 'class',
            extraData: {
              classType: ClassType.Interface,
              methods: [{ id: uuidv4(), name: '+ method()' }],
              attributes: [{ id: uuidv4(), name: '+ attribute: Type' }],
            },
          })
        }
        draggable
      >
        Interface
      </div>
      <div
        className="react-flow__node-classDiagram"
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: 'class',
            extraData: {
              classType: ClassType.Enumeration,
              methods: [{ id: uuidv4(), name: '+ method()' }],
              attributes: [{ id: uuidv4(), name: '+ attribute: Type' }],
            },
          })
        }
        draggable
      >
        Enumeration
      </div>
    </aside>
  );
};
