import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

export const BPMNDataObjectNodeSVG: React.FC<
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
        d={`M0 0 H ${width - 12} L ${width} 12 V ${height} H 0 Z`}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="white"
      />
      <line
        x1={width - 12}
        y1={0}
        x2={width - 12}
        y2={12}
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />
      <line
        x1={width - 12}
        y1={12}
        x2={width}
        y2={12}
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />
      <CustomText x={width / 2} y={height / 2} textAnchor="middle">
        {name}
      </CustomText>
    </svg>
  )
}
