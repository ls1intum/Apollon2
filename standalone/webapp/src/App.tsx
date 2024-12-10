import React, { useRef, useEffect } from 'react';
import { Apollon2, type Node } from '@apollon/library';
import './index.css';

export function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const apollon2Instance = useRef<Apollon2 | null>(null);
  const [nodes, setNodes] = React.useState<Node[]>([]);

  useEffect(() => {
    if (containerRef.current) {
      apollon2Instance.current = new Apollon2(containerRef.current);
    }

    // Optional cleanup if you want to unmount when the component is removed
    return () => {
      if (apollon2Instance.current) {
        apollon2Instance.current.dispose();
        apollon2Instance.current = null;
      }
    };
  }, []);

  const getNodes = () => {
    if (apollon2Instance.current) {
      setNodes(apollon2Instance.current.getNodes());
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <button
        style={{ position: 'absolute', top: 0, right: 0 }}
        onClick={getNodes}
      >
        Get Nodes
      </button>

      {nodes.map((node) => (
        <div key={node.id}>
          {`${node.id} - ${node.type} - ${node.data.label}`}
        </div>
      ))}

      <div ref={containerRef} />
    </div>
  );
}
