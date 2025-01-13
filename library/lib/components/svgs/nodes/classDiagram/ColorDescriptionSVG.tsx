import { ThemedPath } from "@/components/ThemedElements"
import { Text } from "@/components/Text"
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

  return (
    <svg
      width={width}
      height={height}
      style={{
        transformOrigin: "left top",
        transformBox: "content-box",
        transform: transformScale ? `scale(${transformScale})` : undefined,
      }}
      {...svgAttributes}
    >
      <g transform={`translate(${margin}, ${margin})`}>
        {/* Main Path */}
        <ThemedPath
          d={`M 0 0 L ${innerWidth - 15} 0 L ${innerWidth} 15 L ${innerWidth} ${innerHeight} L 0 ${innerHeight} L 0 0 Z`}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
        />
        {/* Small Path for Top-Right Corner */}
        <ThemedPath
          d={`M ${innerWidth - 15} 0 L ${innerWidth - 15} 15 L ${innerWidth} 15`}
          strokeWidth={strokeWidth}
          strokeMiterlimit="10"
        />
        {/* Description Text */}
        <Text
          x={innerWidth / 2}
          y={innerHeight / 2}
          dominantBaseline="middle"
          textAnchor="middle"
          fontWeight="600"
        >
          {description}
        </Text>
      </g>
    </svg>
  )
}
