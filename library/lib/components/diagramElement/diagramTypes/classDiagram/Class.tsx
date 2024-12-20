import { ThemedRect, ThemedPath } from "@/components/ThemedElements"

import { Text } from "@/components/Text"
import { DiagramElementProps } from "@/nodes"

export function Class({
  width,
  height,
  ...svgAttributes
}: DiagramElementProps) {
  const element = {
    name: "Class",
    stereotype: "Interface",
    italic: false,
    underline: false,
    textColor: "black",
    fillColor: "white",
    strokeColor: "black",
    bounds: {
      width: width,
      height: height,
    },
    headerHeight: 40,
    deviderPosition: height - 40,
    hasAttributes: true,
    hasMethods: true,
  }
  const fillColor = "white"
  return (
    <g {...svgAttributes} color="black">
      <ThemedRect
        as="rect"
        fillColor={fillColor || element.fillColor}
        strokeColor="none"
        width="100%"
        height={element.stereotype ? 50 : 40}
      />
      <ThemedRect
        as="rect"
        y={element.stereotype ? 50 : 40}
        width="100%"
        height={element.bounds.height - (element.stereotype ? 50 : 40)}
        fillColor="white"
        strokeColor="none"
      />
      {element.stereotype ? (
        <svg height={50}>
          <Text fill={element.textColor}>
            <tspan x="50%" dy={-8} textAnchor="middle" fontSize="85%">
              {`«${element.stereotype}»`}
            </tspan>
            <tspan
              x="50%"
              dy={18}
              textAnchor="middle"
              fontStyle={element.italic ? "italic" : undefined}
              textDecoration={element.underline ? "underline" : undefined}
            >
              {element.name}
            </tspan>
          </Text>
        </svg>
      ) : (
        <svg height={40}>
          <Text
            as="text"
            fill={element.textColor}
            fontStyle={element.italic ? "italic" : undefined}
            textDecoration={element.underline ? "underline" : undefined}
          >
            {element.name}
          </Text>
        </svg>
      )}

      <ThemedRect
        as="rect"
        width="100%"
        height="100%"
        strokeColor={element.strokeColor}
        fillColor="none"
        pointer-events="none"
      />
      {element.hasAttributes && (
        <ThemedPath
          as="path"
          d={`M 0 ${element.headerHeight} H ${element.bounds.width}`}
          strokeColor={element.strokeColor}
          fillColor="black"
        />
      )}
      {element.hasMethods && (
        <ThemedPath
          as="path"
          d={`M 0 ${element.deviderPosition} H ${element.bounds.width}`}
          strokeColor={element.strokeColor}
          fillColor="black"
        />
      )}
    </g>
  )
}
