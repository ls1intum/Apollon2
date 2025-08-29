export function SvgMarkers() {
  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, width: 0, height: 0 }}
      id="apollon2_svg-markers"
    >
      <defs>
        <marker
          id="black-rhombus"
          viewBox="0 0 30 30"
          markerWidth="30"
          markerHeight="30"
          refX="15"
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
          refX="15"
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
          refX="30"
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
          id="black-triangle"
          viewBox="0 0 30 30"
          markerWidth="22"
          markerHeight="30"
          refX="30"
          refY="15"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,1 L0,29 L30,15 z"
            fill="black"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>
        <marker
          id="black-arrow"
          viewBox="0 0 30 30"
          markerWidth="22"
          markerHeight="30"
          refX="30"
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

        {/* Required Interface - Semicircle */}
        <marker
          id="required-interface"
          viewBox="0 0 36 36"
          markerWidth="30"
          markerHeight="36"
          refX="2"
          refY="18"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 18,2 A 16,16 0 0,0 18,34"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        </marker>

        <marker
          id="required-interface-threequarter"
          viewBox="-4 -13 16 26" // Extended to include negative coordinates
          markerWidth="20" // Reasonable display size
          markerHeight="26" // Matches the path height
          refX="0" // Connect at the opening (left edge)
          refY="0" // Connect at middle (Y=0 in this coordinate system)
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 8 -12.5 C -3.5 -7.5 -3.3 7.9 8 12.5"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        </marker>

        {/* Required Interface - Quarter Circle */}
        <marker
          id="required-interface-quarter"
          viewBox="-2 -8 6 16" // Extended to include negative coordinates
          markerWidth="16" // Display size
          markerHeight="20" // Display size
          refX="0" // Connect at the opening (left edge)
          refY="0" // Connect at middle (Y=0 in this coordinate system)
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 2 -7.8 C -1.5 -3 -1.2 3.4 2 7.8"
            fill="none"
            stroke="black"
            strokeWidth="1.5"
          />
        </marker>

        {/* BPMN Specific Markers */}
        {/* Small White Arrow for BPMN */}
        <marker
          id="bpmn-white-triangle"
          viewBox="0 0 20 20"
          markerWidth="15"
          markerHeight="20"
          refX="10"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,18 L20,10 L0,2 z"
            fill="white"
            stroke="black"
            strokeWidth="1.2"
          />
        </marker>

        {/* Small White Circle for BPMN */}
        <marker
          id="bpmn-white-circle"
          viewBox="0 0 20 20"
          markerWidth="12"
          markerHeight="20"
          refX="10"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="white"
            stroke="black"
            strokeWidth="1.5"
          />
        </marker>

        {/* BPMN Message Flow Arrow */}
        <marker
          id="bpmn-arrow"
          viewBox="0 0 20 20"
          markerWidth="15"
          markerHeight="20"
          refX="10"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M2,18 L18,10 L2,2"
            fill="none"
            stroke="black"
            strokeWidth="1.5"
          />
        </marker>
      </defs>
    </svg>
  )
}
