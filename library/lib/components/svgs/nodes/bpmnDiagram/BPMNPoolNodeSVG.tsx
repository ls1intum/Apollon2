import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

export const BPMNPoolNodeSVG: React.FC<
  SVGComponentProps & { name: string }
> = ({ width, height, name, svgAttributes, transformScale }) => {
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  const headerWidth = 40

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      {/* Pool outer border */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="white"
      />

      {/* Pool header separator line */}
      <line
        x1={headerWidth}
        y1={0}
        x2={headerWidth}
        y2={height}
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />

      {/* Pool name in header */}
      <CustomText
        x={headerWidth / 2}
        y={height / 2}
        textAnchor="middle"
        transform={`rotate(-90, ${headerWidth / 2}, ${height / 2})`}
      >
        {name}
      </CustomText>
    </svg>
  )
}
