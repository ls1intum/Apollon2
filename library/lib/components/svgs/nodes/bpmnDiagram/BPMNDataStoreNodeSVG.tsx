import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

export const BPMNDataStoreNodeSVG: React.FC<
  SVGComponentProps & { name: string }
> = ({ width, height, name, svgAttributes, transformScale }) => {
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)
  const rx = 10

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
        y={10}
        width={width}
        height={height - 10}
        fill="white"
        stroke="black"
        strokeWidth={LINE_WIDTH}
        rx={rx}
        ry={rx}
      />
      <ellipse
        cx={width / 2}
        cy={10}
        rx={width / 2}
        ry={10}
        fill="white"
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />
      <CustomText x={width / 2} y={height / 2 + 5} textAnchor="middle">
        {name}
      </CustomText>
    </svg>
  )
}
