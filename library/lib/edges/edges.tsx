import { EdgeProps, getSmoothStepPath } from "@xyflow/react";

// Inheritance Edge (White Triangle)
export const InheritanceEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [path] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

  return (
    
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        markerEnd="url(#diamond-marker)"
        stroke="black"
        fill="none"
        strokeWidth={2}
      />
    </g>
  );
};

// Realization Edge (Dotted White Triangle)
export const RealizationEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [path] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        stroke="black"
        fill="none"
        strokeWidth={2}
        strokeDasharray="4"
      />
    </g>
  );
};

// Aggregation Edge (White Rhombus)
export const AggregationEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [path] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });
  //const gap = 8; // size of the gap you want at the end of the line
  
  // Calculate the direction vector of the line
 // const dx = targetX - sourceX;
 // const dy = targetY - sourceY;
  //const length = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate a shortened target point
  //const shortenedTargetX = targetX - (gap * dx) / length;
  //const shortenedTargetY = targetY - (gap * dy) / length;

 

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        markerEnd="url(#diamond-marker)"
        stroke="black"
        fill="none"
        strokeWidth={2}
        orient="auto"
      />
    </g>
  );
};

// Composition Edge (Black Rhombus)
export const CompositionEdge = ({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) => {
  const [path] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        markerEnd="url(#black-rhombus)"
        stroke="black"
        fill="none"
        strokeWidth={2}
      />
    </g>
  );
};
