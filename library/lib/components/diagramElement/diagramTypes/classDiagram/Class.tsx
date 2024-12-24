import { ThemedRect } from "@/components/ThemedElements"
import { Text } from "@/components/Text"
import { DiagramElementProps } from "@/nodes"

export function Class({ width, ...svgAttributes }: DiagramElementProps) {
  const element = {
    name: "Class",
    stereotype: "Interface",
    textColor: "black",
    fillColor: "yellow",
    strokeColor: "black",
    headerHeight: 50,
  }

  const methods = [
    { id: "1", name: "method1" },
    { id: "2", name: "method2" },
  ]
  const attributes = [
    { id: "1", name: "attribute1" },
    { id: "2", name: "attribute2" },
  ]

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
