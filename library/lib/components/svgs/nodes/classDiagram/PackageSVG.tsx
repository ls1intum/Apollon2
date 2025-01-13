import { ThemedPath, ThemedRect, Text } from "@/components"
import { SVGAttributes } from "react"

export type PackageSVGProps = {
  width: number
  height: number
  name: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
}

export const PackageSVG = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
}: PackageSVGProps) => {
  const margin = 2
  const headerHeight = 10 // Height of the top path
  const innerWidth = width - 2 * margin // Adjusted content width
  const innerHeight = height - 2 * margin // Adjusted content height
  const padding = 5

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
        {/* Top Path */}
        <ThemedPath
          d={`M 0 ${headerHeight} V 0 H 40 V ${headerHeight}`}
          stroke="black"
          strokeWidth="0.5"
        />
        {/* Main Rectangle */}
        <ThemedRect
          x="0"
          y={headerHeight}
          width={innerWidth}
          height={innerHeight - headerHeight}
          stroke="black"
          strokeWidth="0.5"
        />
        {/* Name Text */}
        <Text
          x={innerWidth / 2}
          y={headerHeight + padding}
          textAnchor="middle"
          fontWeight="600"
          dominantBaseline="hanging"
        >
          {name}
        </Text>
      </g>
    </svg>
  )
}
