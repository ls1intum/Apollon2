import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

export const BPMNDataStoreNodeSVG: React.FC<
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
        d={`M 0 10 L 0 ${height - 10} A ${width / 2} 10 0 0 0 ${width} ${
          height - 10
        } L ${width} 10 A ${width / 2} 10 180 0 0 0 10`}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="white"
      />
      <path
        d={`M 0 30 A ${width / 2} 10 0 0 0 ${width} 30`}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="none"
      />
      <path
        d={`M 0 20 A ${width / 2} 10 0 0 0 ${width} 20`}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="none"
      />
      <path
        d={`M 0 10 A ${width / 2} 10 0 0 0 ${width} 10`}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="none"
      />
      <CustomText
        x={width / 2}
        y={height + 20}
        textAnchor="middle"
        fontSize={14}
        dominantBaseline="hanging"
      >
        {name}
      </CustomText>
    </svg>
  )
}
