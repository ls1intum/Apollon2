import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

export const BPMNAnnotationNodeSVG: React.FC<
  SVGComponentProps & { name: string }
> = ({ width, height, name, svgAttributes, transformScale }) => {
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
      <path
        d={`M10 0 H ${width} V ${height} H 10`}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="none"
      />
      <line
        x1={10}
        y1={0}
        x2={10}
        y2={height}
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />
      <CustomText x={width / 2 + 5} y={height / 2} textAnchor="middle">
        {name}
      </CustomText>
    </svg>
  )
}
