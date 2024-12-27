import { ThemedPath, ThemedRect } from "@/components/ThemedElements"
import { Handle, NodeProps, Position } from "@xyflow/react"
import { SVGAttributes } from "react"

export function Package({ width, height }: NodeProps) {
  if (!width || !height) {
    return null
  }

  //   const strokeWidth = svgAttributes.strokeWidth ? +svgAttributes.strokeWidth : 0
  const strokeWidth = 0

  // we subtract the strokeWidth to make sure the shape is not cut off
  // this is done because svg doesn't support stroke inset (https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn)
  const innerWidth = width - 2 * strokeWidth
  const innerHeight = height - 2 * strokeWidth

  return (
    <>
      <svg width={width + strokeWidth} height={height + strokeWidth}>
        <SVGPart width={innerWidth} height={innerHeight} />
      </svg>
      <Handle id="top" type="source" position={Position.Top} />
      <Handle id="right" type="source" position={Position.Right} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="left" type="source" position={Position.Left} />
    </>
  )
}

type SVGPartProps = {
  width: number
  height: number
} & SVGAttributes<SVGElement>

function SVGPart({ width, height, ...svgAttributes }: SVGPartProps) {
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
