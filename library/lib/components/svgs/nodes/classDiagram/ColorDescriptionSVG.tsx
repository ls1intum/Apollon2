import { CustomText } from "@/components/svgs/nodes/CustomText"
import { SVGAttributes } from "react"

export type ColorDescriptionSVGProps = {
  width: number
  height: number
  description: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
}

export function ColorDescriptionSVG({
  width,
  height,
  description,
  svgAttributes,
  transformScale,
}: ColorDescriptionSVGProps) {
  const margin = 2
  const innerWidth = width - 2 * margin // Adjusted content width
  const innerHeight = height - 2 * margin // Adjusted content height
  const strokeWidth = 0.5

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
      <g transform={`translate(${margin}, ${margin})`}>
        {/* Main Path */}
        <path
          d={`M 0 0 L ${innerWidth - 15} 0 L ${innerWidth} 15 L ${innerWidth} ${innerHeight} L 0 ${innerHeight} L 0 0 Z`}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          stroke="black"
        />
        {/* Small Path for Top-Right Corner */}
        <path
          d={`M ${innerWidth - 15} 0 L ${innerWidth - 15} 15 L ${innerWidth} 15`}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
          stroke="black"
        />
        {/* Description Text */}
        <CustomText
          x={innerWidth / 2}
          y={innerHeight / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontWeight="600"
        >
          {description}
        </CustomText>
      </g>
    </svg>
  )
}
