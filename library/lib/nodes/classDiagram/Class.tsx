import { ThemedRect } from "@/components/ThemedElements"
import { Handle, NodeProps, Position, type Node } from "@xyflow/react"
import { SVGAttributes } from "react"
import { Text } from "@/components/Text"

export type ExtraElements = {
  id: string
  name: string
}

type Props = Node<{
  methods: ExtraElements[]
  attributes: ExtraElements[]
}>

export function Class({
  width,
  height,
  data: { methods, attributes },
}: NodeProps<Props>) {
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
        <SVGPart
          width={innerWidth}
          height={innerHeight}
          methods={methods}
          attributes={attributes}
        />
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
  methods: ExtraElements[]
  attributes: ExtraElements[]
} & SVGAttributes<SVGElement>

function SVGPart({
  width,
  attributes,
  methods,
  ...svgAttributes
}: SVGPartProps) {
  const element = {
    name: "Class",
    stereotype: "Interface",
    textColor: "black",
    fillColor: "yellow",
    strokeColor: "black",
    headerHeight: 50,
  }
  const attributeHeight = 30
  const totalAttributesHeight = attributes.length * attributeHeight
  const totalMethodsHeight = methods.length * attributeHeight

  const totalHeight =
    element.headerHeight + totalAttributesHeight + totalMethodsHeight

  return (
    <g {...svgAttributes}>
      {/* Outer Rectangle */}
      <ThemedRect
        as="rect"
        width={width}
        height={totalHeight}
        fillColor="none"
        strokeColor={element.strokeColor}
      />

      {/* Header Section */}
      <g>
        <ThemedRect
          as="rect"
          width={width}
          height={element.headerHeight}
          fillColor={element.fillColor}
          strokeColor={element.strokeColor}
        />
        <Text x="50%" y="25" dominantBaseline="middle" textAnchor="middle">
          {element.stereotype && (
            <tspan x="50%" dy="-8" textAnchor="middle" fontSize="85%">
              {`«${element.stereotype}»`}
            </tspan>
          )}
          <tspan
            x="50%"
            dy={element.stereotype ? "18" : "0"}
            textAnchor="middle"
          >
            {element.name}
          </tspan>
        </Text>
      </g>

      {/* Attributes Section */}
      {attributes.length > 0 && (
        <g transform={`translate(0, ${element.headerHeight})`}>
          {/* Single Rect for all attributes */}
          <ThemedRect
            as="rect"
            width={width}
            height={totalAttributesHeight}
            fillColor="white"
            strokeColor={element.strokeColor}
          />
          {attributes.map((attribute, index) => (
            <Text
              key={attribute.id}
              x="10"
              y={15 + index * attributeHeight}
              dominantBaseline="middle"
              textAnchor="start"
            >
              {attribute.name}
            </Text>
          ))}
        </g>
      )}

      {/* Methods Section */}
      {methods.length > 0 && (
        <g
          transform={`translate(0, ${
            element.headerHeight + totalAttributesHeight
          })`}
        >
          {/* Single Rect for all methods */}
          <ThemedRect
            as="rect"
            width={width}
            height={totalMethodsHeight}
            fillColor="white"
            strokeColor={element.strokeColor}
          />
          {methods.map((method, index) => (
            <Text
              key={method.id}
              x="10"
              y={15 + index * attributeHeight}
              dominantBaseline="middle"
              textAnchor="start"
            >
              {method.name}
            </Text>
          ))}
        </g>
      )}
    </g>
  )
}
