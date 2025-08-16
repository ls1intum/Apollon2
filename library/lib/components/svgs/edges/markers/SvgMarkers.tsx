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
          refX="15"
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
          refX="15"
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
        {/* <marker
          id="required-interface"
          viewBox="0 0 20 20"
          markerWidth="16"
          markerHeight="20"
          refX="0"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        > */}
          {/* Half circle opening to the right - SVG will auto-rotate this */}
          {/* <path
            d="M0,2 A 8,8 0 0,0 0,18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker> */}
        {/* Required Interface - Semicircle */}
        <marker
          id="required-interface"
          viewBox="0 0 20 20"
          markerWidth="16"
          markerHeight="20"
          refX="0"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M 13 -13.5 a 1 1 0 0 0 0 27"
      
            fill="none"
            stroke="black"
            strokeWidth="1.5"
          />
        </marker>

        {/* Required Interface - Three Quarter Circle */}
        <marker
          id="required-interface-threequarter"
          viewBox="0 0 20 20"
          markerWidth="16"
          markerHeight="20"
          refX="0"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,10 A 8,8 0 1,1 5.66,2.34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

        {/* Required Interface - Quarter Circle */}
        <marker
          id="required-interface-quarter"
          viewBox="0 0 20 20"
          markerWidth="16"
          markerHeight="20"
          refX="0"
          refY="10"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0,10 A 8,8 0 0,1 5.66,2.34"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </marker>

      </defs>
    </svg>
  )
}
