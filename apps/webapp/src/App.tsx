import React, { useRef, useEffect } from 'react';
import { MyLibrary } from '@apollon/library';

export function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const myLibraryInstance = useRef<MyLibrary | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Create a new instance of MyLibrary and pass in the HTML element
      myLibraryInstance.current = new MyLibrary(containerRef.current);
    }

    // Optional cleanup if you want to unmount when the component is removed
    return () => {
      if (myLibraryInstance.current) {
        myLibraryInstance.current.dispose();
        myLibraryInstance.current = null;
      }
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          border: '1px solid gray',
          padding: '10px',
          height: '100%',
          width: '100%',
        }}
      ></div>
    </div>
  );
}
