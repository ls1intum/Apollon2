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
  return (
    <svg
      width={width}
      height={height}
      style={{
        transformOrigin: "0 0",
        transformBox: "content-box",
        transform: transformScale ? `scale(${transformScale})` : undefined,
      }}
      {...svgAttributes}
    >
      <g>
        <ThemedPath
          as="path"
          d={`M 0 0 L ${width - 15} 0 L ${width} 15 L ${width} ${
            height
          } L 0 ${height} L 0 0 Z`}
          strokeWidth="1.2"
          strokeMiterlimit="10"
        />
        <ThemedPath
          as="path"
          d={`M ${width - 15} 0 L ${width - 15} 15 L ${width} 15`}
          fillColor="none"
          strokeWidth="1.2"
          strokeMiterlimit="10"
        />
        <Text>{description}</Text>
      </g>
    </svg>
  )
}
