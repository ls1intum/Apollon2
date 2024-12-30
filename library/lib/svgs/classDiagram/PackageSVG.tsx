import { ThemedPath, ThemedRect, Text } from "@/components"
import { SVGAttributes } from "react"

export type PackageSVGProps = {
  width: number
  height: number
  name: string
  svgAttributes?: SVGAttributes<SVGElement>
}

export const PackageSVG = ({
  width,
  height,
  name,
  svgAttributes,
}: PackageSVGProps) => {
  return (
    <svg
      width={width}
      height={height}
      style={{ transformOrigin: "0 0" }}
      {...svgAttributes}
    >
      <g>
        <ThemedPath as="path" d={`M 0 10 V 0 H 40 V 10`} />
        <ThemedRect as="rect" y={10} width={width} height={height - 10} />
        <Text y={20} dy={10} textAnchor="middle" fontWeight="600">
          {name}
        </Text>
      </g>
    </svg>
  )
}
