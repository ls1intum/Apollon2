import { EdgeProps, getSmoothStepPath } from "@xyflow/react";

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps) => {
  const [path] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={path}
        markerEnd={markerEnd}
        stroke="black"
        fill="none"
        strokeWidth={2}
      />
    </g>
  );
};

export default CustomEdge;
