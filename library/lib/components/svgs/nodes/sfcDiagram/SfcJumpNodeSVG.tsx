import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name: string
}

export const SfcJumpNodeSVG: React.FC<Props> = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
}) => {
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)
  const sideLength = 20
  const halfSideLength = sideLength / 2

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
        fill="var(--apollon-background)"
        stroke="none"
      />
      <polyline
        points={`0,0 0,${sideLength} ${sideLength},${halfSideLength} 0,0`}
        fill="white"
        stroke="var(--apollon-primary-contrast)"
        strokeWidth={LINE_WIDTH}
      />
      <text
        fill="var(--apollon-primary-contrast)"
        x={sideLength + 5}
        y={halfSideLength + 5}
        style={{ fontWeight: 600 }}
      >
        {name}
      </text>
    </svg>
  )
}
