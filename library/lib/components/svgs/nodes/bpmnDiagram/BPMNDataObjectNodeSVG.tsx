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
        d={`M0,0 L0,${height} L${width},${height} L${width},15 L${width - 15},0 L${width - 15},15 L${width},15 L${width - 15},0 L0,0`}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="white"
      />
      <CustomText
        x={width / 2}
        y={height + 10}
        textAnchor="middle"
        fontSize={14}
        dominantBaseline="hanging"
      >
        {name}
      </CustomText>
    </svg>
  )
}
