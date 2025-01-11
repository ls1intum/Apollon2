export function SvgMarkers() {
  return (
    <svg style={{ display: "none" }}>
      <defs>
        {/* Diamond marker */}
        <marker
      id="diamond-marker"
      markerWidth="24"
      markerHeight="24"
      refX="0"  // Increased refX to position the line start further from the marker
      refY="9"
      orient="auto"
      markerUnits="userSpaceOnUse"
    >
     <path d="M12 0 L24 9 L12 18 L0 9 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
     </marker>

      </defs>
    </svg>
  );
}
