import { ThemedRect } from "@/components/ThemedElements"
import { Text } from "@/components/Text"
import { ClassType, ExtraElements } from "@/types"
import { SVGAttributes } from "react"

type Props = {
  width: number
  height: number
  methods: ExtraElements[]
  attributes: ExtraElements[]
  stereotype?: ClassType
  name: string
  svgAttributes?: SVGAttributes<SVGElement>
}

export function ClassSVG({
  width,
  height,
  methods,
  attributes,
  stereotype,
  name,
  svgAttributes,
}: Props) {
  if (!width || !height) {
    return null
  }

  const headerHeight = 50
  const attributeHeight = 30
  const totalAttributesHeight = attributes.length * attributeHeight
  const totalMethodsHeight = methods.length * attributeHeight

  const totalHeight = headerHeight + totalAttributesHeight + totalMethodsHeight
  return (
    <svg
      width={width}
      height={height}
      style={{ transformOrigin: "0 0" }}
      {...svgAttributes}
    >
      <g>
        {/* Outer Rectangle */}
        <ThemedRect
          as="rect"
          width={width}
          height={totalHeight}
          fillColor="none"
        />

        {/* Header Section */}
        <g>
          <ThemedRect as="rect" width={width} height={headerHeight} />
          <Text x="50%" y="25" dominantBaseline="middle" textAnchor="middle">
            {stereotype && (
              <tspan x="50%" dy="-8" textAnchor="middle" fontSize="85%">
                {`«${stereotype}»`}
              </tspan>
            )}
            <tspan x="50%" dy={stereotype ? "18" : "0"} textAnchor="middle">
              {name}
            </tspan>
          </Text>
        </g>

        {/* Attributes Section */}
        {attributes.length > 0 && (
          <g transform={`translate(0, ${headerHeight})`}>
            {/* Single Rect for all attributes */}
            <ThemedRect
              as="rect"
              width={width}
              height={totalAttributesHeight}
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
            transform={`translate(0, ${headerHeight + totalAttributesHeight})`}
          >
            {/* Single Rect for all methods */}
            <ThemedRect as="rect" width={width} height={totalMethodsHeight} />
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
    </svg>
  )
}
