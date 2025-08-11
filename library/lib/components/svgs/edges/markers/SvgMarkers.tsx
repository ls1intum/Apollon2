export function SvgMarkers() {
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0 }}
      id="apollon2_svg-markers"
    >
      <defs>
        {/* Existing markers for class diagrams */}
        <marker
          id="black-rhombus"
          viewBox="0 0 30 30"
          markerWidth="30"
          markerHeight="30"
          refX="15" // Aligns the endpoint of the line with the rightmost point of the diamond
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
          refX="15" // Aligns the endpoint of the line with the rightmost point of the diamond
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
          refX="15" // Aligns the endpoint of the line with the rightmost point of the diamond
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
          refX="15" // Aligns the endpoint of the line with the rightmost point of the diamond
          refY="15"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,29 L30,15 L0,1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

        {/* Smaller markers for use case diagrams */}
        <marker
          id="usecase-arrow"
          viewBox="0 0 20 20"
          markerWidth="12"
          markerHeight="20"
          refX="10"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,18 L20,10 L0,2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>
        <marker
          id="usecase-triangle"
          viewBox="0 0 20 20"
          markerWidth="14"
          markerHeight="20"
          refX="10"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,2 L0,18 L20,10 z"
            fill="white"
            stroke="currentColor"
            strokeWidth="1"
          />
        </marker>
      </defs>
    </svg>
  )
}
