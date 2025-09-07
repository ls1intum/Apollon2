import { CustomText, StyledRect } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { DefaultNodeProps } from "@/types"
import { SVGComponentProps } from "@/types/SVG"
import { getCustomColorsFromData } from "@/utils/layoutUtils"

interface Props extends SVGComponentProps {
  data: DefaultNodeProps
}

export const SfcStartNodeSVG: React.FC<Props> = ({
  width,
  height,
  data,
  svgAttributes,
  transformScale,
}) => {
  const { name } = data
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)
  const innerPadding = 5

  const { fillColor, strokeColor, textColor } = getCustomColorsFromData(data)
  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <StyledRect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
      />
      <rect
        x={innerPadding}
        y={innerPadding}
        width={width - innerPadding * 2}
        height={height - innerPadding * 2}
        fill="none"
        stroke={strokeColor}
        strokeWidth={LINE_WIDTH}
      />
      <CustomText
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontWeight: 600 }}
        fill={textColor}
      >
        {name}
      </CustomText>
    </svg>
  )
}
