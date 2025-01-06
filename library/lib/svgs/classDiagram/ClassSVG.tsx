import { ThemedRect } from "@/components/ThemedElements"
import { Text } from "@/components/Text"
import { ClassType, ExtraElements } from "@/types"
import { SVGAttributes, useMemo } from "react"

export type ClassSVGProps = {
  width: number
  height: number
  methods: ExtraElements[]
  attributes: ExtraElements[]
  stereotype?: ClassType
  name: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
}

export function ClassSVG({
  width,
  height,
  methods,
  attributes,
  stereotype,
  name,
  transformScale,
  svgAttributes,
}: ClassSVGProps) {
  const margin = 2 // Padding inside the SVG content
  const headerHeight = 50 // Height of the header section
  const attributeHeight = 30 // Height per attribute
  const methodHeight = 30 // Height per method
  const innerWidth = width - 2 * margin // Adjusted content width
  const padding = 10 // Inner padding for text
  const maxTextWidth = innerWidth - 2 * padding // Maximum width for text

  const truncateText = (text: string, maxWidth: number): string => {
    const approxCharWidth = 7 // Approximate width of a character in font size 14px
    const maxChars = Math.floor(maxWidth / approxCharWidth)
    return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text
  }

  const truncatedAttributes = useMemo(
    () =>
      attributes.map((attribute) => ({
        ...attribute,
        truncatedName: truncateText(attribute.name, maxTextWidth),
      })),
    [attributes, maxTextWidth]
  )

  const truncatedMethods = useMemo(
    () =>
      methods.map((method) => ({
        ...method,
        truncatedName: truncateText(method.name, maxTextWidth),
      })),
    [methods, maxTextWidth]
  )

  const totalHeight =
    headerHeight +
    truncatedAttributes.length * attributeHeight +
    truncatedMethods.length * methodHeight

  return (
    <svg
      width={width}
      height={Math.max(height, totalHeight)}
      style={{
        transformOrigin: "left top",
        transformBox: "content-box",
        transform: transformScale ? `scale(${transformScale})` : undefined,
      }}
      {...svgAttributes}
    >
      <g transform={`translate(${margin}, ${margin})`}>
        {/* Outer Rectangle */}
        <ThemedRect
          width={innerWidth}
          height={Math.max(height, totalHeight) - 2 * margin}
          stroke="black"
          strokeWidth="0.5"
        />

        {/* Header Section */}
        <g>
          <Text
            x={innerWidth / 2}
            y={headerHeight / 2}
            dominantBaseline="middle"
            textAnchor="middle"
          >
            {stereotype && (
              <tspan x={innerWidth / 2} dy="-8" fontSize="85%">
                {`«${stereotype}»`}
              </tspan>
            )}
            <tspan
              x={innerWidth / 2}
              dy={stereotype ? "18" : "0"}
              fontWeight="600"
            >
              {name}
            </tspan>
          </Text>
        </g>

        {/* Separation Line After Header */}
        <line
          x1="0"
          x2={innerWidth}
          y1={headerHeight}
          y2={headerHeight}
          stroke="black"
          strokeWidth="0.5"
        />

        {/* Attributes Section */}
        {truncatedAttributes.length > 0 && (
          <g transform={`translate(0, ${headerHeight})`}>
            {truncatedAttributes.map((attribute, index) => (
              <Text
                key={attribute.id}
                x={padding}
                y={15 + index * attributeHeight}
                dominantBaseline="middle"
                textAnchor="start"
              >
                {attribute.truncatedName}
              </Text>
            ))}
          </g>
        )}

        {/* Separation Line After Attributes */}
        {truncatedAttributes.length > 0 && (
          <line
            x1="0"
            x2={innerWidth}
            y1={headerHeight + truncatedAttributes.length * attributeHeight}
            y2={headerHeight + truncatedAttributes.length * attributeHeight}
            stroke="black"
            strokeWidth="0.5"
          />
        )}

        {/* Methods Section */}
        {truncatedMethods.length > 0 && (
          <g
            transform={`translate(0, ${
              headerHeight + truncatedAttributes.length * attributeHeight
            })`}
          >
            {truncatedMethods.map((method, index) => (
              <Text
                key={method.id}
                x={padding}
                y={15 + index * methodHeight}
                dominantBaseline="middle"
                textAnchor="start"
              >
                {method.truncatedName}
              </Text>
            ))}
          </g>
        )}
      </g>
    </svg>
  )
}
