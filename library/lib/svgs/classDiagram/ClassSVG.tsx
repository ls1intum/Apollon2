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
  const headerHeight = 50
  const attributeHeight = 30
  const methodHeight = 30

  const padding = 10 // Padding inside the SVG
  const maxTextWidth = width - 2 * padding // Maximum width for text

  // Helper function to truncate individual lines
  const truncateText = (text: string, maxWidth: number): string => {
    const approxCharWidth = 7 // Approximation for character width in font size 14px
    const maxChars = Math.floor(maxWidth / approxCharWidth)

    if (text.length > maxChars) {
      return `${text.slice(0, maxChars - 3)}...` // Truncate and add ellipsis
    }
    return text
  }

  // Memoized truncated attributes
  const truncatedAttributes = useMemo(
    () =>
      attributes.map((attribute) => ({
        ...attribute,
        truncatedName: truncateText(attribute.name, maxTextWidth),
      })),
    [attributes, maxTextWidth]
  )

  // Memoized truncated methods
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
      z={2}
      style={{
        transformOrigin: "0 0",
        transformBox: "content-box",
        transform: transformScale ? `scale(${transformScale})` : undefined,
      }}
      {...svgAttributes}
    >
      <g>
        {/* Outer Rectangle */}
        <ThemedRect
          as="rect"
          width={width}
          height={Math.max(height, totalHeight)}
          fillColor="white"
        />

        {/* Header Section */}
        <g>
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

        {/* Separation Line After Header */}
        <line
          x1="0"
          x2={width}
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
                x="10"
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
            x2={width}
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
                x="10"
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
