import { ThemedPath, ThemedRect } from "@/components/ThemedElements"
import { DiagramElementProps } from "@/nodes"

export function Package({
  width,
  height,
  ...svgAttributes
}: DiagramElementProps) {
  return (
    <g {...svgAttributes}>
      <ThemedPath
        as="path"
        d={`M 0 10 V 0 H 40 V 10`}
        strokeColor="black"
        fillColor="white"
      />
      <ThemedRect
        as="rect"
        y={10}
        width={width}
        height={height - 10}
        strokeColor="black"
        fillColor="white"
      />
      <text
        x="50%"
        y={20}
        dy={10}
        textAnchor="middle"
        fontWeight="600"
        pointerEvents="none"
        color="black"
      >
        {"Package"}
      </text>
    </g>
  )
}
