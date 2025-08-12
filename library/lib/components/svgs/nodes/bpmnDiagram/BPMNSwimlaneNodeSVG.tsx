import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

export const BPMNSwimlaneNodeSVG: React.FC<SVGComponentProps> = ({
  width,
  height,
  svgAttributes,
  transformScale,
}) => {
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="white"
      />
    </svg>
  )
}
