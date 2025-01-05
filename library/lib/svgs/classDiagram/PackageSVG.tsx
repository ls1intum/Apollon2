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
  const padding = 5 // Padding inside the SVG content
  const headerHeight = 10 // Height of the top path
  const innerWidth = width - 2 * padding // Adjusted content width
  const innerHeight = height - 2 * padding // Adjusted content height

  return (
    <svg
      width={width} // Keep width as passed
      height={height} // Keep height as passed
      style={{
        transformOrigin: "left top",
        transformBox: "content-box",
        transform: transformScale ? `scale(${transformScale})` : undefined,
      }}
      {...svgAttributes}
    >
      <g transform={`translate(${padding}, ${padding})`}>
        {/* Top Path */}
        <ThemedPath
          as="path"
          d={`M 0 ${headerHeight} V 0 H 40 V ${headerHeight}`}
          stroke="black"
          strokeWidth="0.5"
        />
        {/* Main Rectangle */}
        <ThemedRect
          as="rect"
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
