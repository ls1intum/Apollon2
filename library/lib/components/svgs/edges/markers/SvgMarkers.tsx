export function SvgMarkers() {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0 }}>
      <defs>
        <marker
          id="black-rhombus"
          viewBox="0 0 30 30"
          markerWidth="30"
          markerHeight="30"
          refX="30" // Aligns the endpoint of the line with the rightmost point of the diamond
          refY="15"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,15 L15,22 L30,15 L15,8 z"
            fill="black"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>
        <marker
          id="white-rhombus"
          viewBox="0 0 30 30"
          markerWidth="30"
          markerHeight="30"
          refX="30" // Aligns the endpoint of the line with the rightmost point of the diamond
          refY="15"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,15 L15,22 L30,15 L15,8 z"
            fill="white"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>
        <marker
          id="white-triangle"
          viewBox="0 0 30 30"
          markerWidth="22"
          markerHeight="30"
          refX="30" // Aligns the endpoint of the line with the rightmost point of the diamond
          refY="15"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,1 L0,29 L30,15 z"
            fill="white"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>
        <marker
          id="black-arrow"
          viewBox="0 0 30 30"
          markerWidth="22"
          markerHeight="30"
          refX="30" // Aligns the endpoint of the line with the rightmost point of the diamond
          refY="15"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,29 L30,15 L0,1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
        </marker>
      </defs>
    </svg>
  )
}
