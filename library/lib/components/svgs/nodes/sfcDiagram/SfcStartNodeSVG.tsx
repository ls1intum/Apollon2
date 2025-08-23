import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
}

export const SfcStartNodeSVG: React.FC<Props> = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
}) => {
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)
  const innerPadding = 5

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
        fill="white"
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />
      <rect
        x={innerPadding}
        y={innerPadding}
        width={width - innerPadding * 2}
        height={height - innerPadding * 2}
        fill="none"
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontWeight: 600 }}
      >
        {name}
      </text>
    </svg>
  )
}
