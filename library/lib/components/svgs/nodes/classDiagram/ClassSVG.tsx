import React, { forwardRef, useEffect, useMemo } from "react"
import { ThemedRect } from "@/components/ThemedElements"
import { Text } from "@/components/Text"
import { ClassType, ExtraElement } from "@/types"
import { useReactFlow } from "@xyflow/react"
import {
  calculateMinWidth,
  calculateMinHeight,
  measureTextWidth,
} from "@/utils"
import {
  DEFAULT_FONT,
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_ATTRIBUTE_HEIGHT,
  DEFAULT_METHOD_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_HEADER_HEIGHT_WITH_STREOTYPE,
  LINE_WIDTH,
  LINE_WIDTH_ON_EDGE,
} from "@/constants/dropElementConfig"

export interface MinSize {
  minWidth: number
  minHeight: number
}

export interface SVGComponentProps {
  width: number
  height: number
  transformScale?: number
  svgAttributes?: React.SVGAttributes<SVGElement>
  setMinSize?: React.Dispatch<React.SetStateAction<MinSize>>
  id: string
}

export type ClassSVGProps = SVGComponentProps & {
  methods: ExtraElement[]
  attributes: ExtraElement[]
  stereotype?: ClassType
  name: string
}

/**
 * ClassSVG Component
 * Renders a UML-like class diagram SVG with dynamic sizing based on text content.
 */
export const ClassSVG = forwardRef<SVGSVGElement, ClassSVGProps>(
  function ClassSVG(
    {
      width,
      height,
      methods,
      attributes,
      stereotype,
      name,
      transformScale,
      svgAttributes,
      setMinSize,
      id,
    }: ClassSVGProps,
    ref
  ) {
    // Layout constants
    const showStereotype = stereotype
      ? stereotype !== ClassType.ObjectClass
      : false
    const headerHeight = showStereotype
      ? DEFAULT_HEADER_HEIGHT_WITH_STREOTYPE
      : DEFAULT_HEADER_HEIGHT
    const attributeHeight = DEFAULT_ATTRIBUTE_HEIGHT
    const methodHeight = DEFAULT_METHOD_HEIGHT
    const padding = DEFAULT_PADDING
    const font = DEFAULT_FONT

    const reactFlow = useReactFlow()

    // Calculate the widest text accurately
    const maxTextWidth = useMemo(() => {
      const headerTextWidths = [
        stereotype ? measureTextWidth(`«${stereotype}»`, font) : 0,
        measureTextWidth(name, font),
      ]
      const attributesTextWidths = attributes.map((attr) =>
        measureTextWidth(attr.name, font)
      )
      const methodsTextWidths = methods.map((method) =>
        measureTextWidth(method.name, font)
      )
      const allTextWidths = [
        ...headerTextWidths,
        ...attributesTextWidths,
        ...methodsTextWidths,
      ]
      return Math.max(...allTextWidths, 0) // Ensure at least 0
    }, [stereotype, name, attributes, methods, font])

    // Calculate minimum dimensions
    const minWidth = calculateMinWidth(maxTextWidth, padding)
    const minHeight = calculateMinHeight(
      headerHeight,
      attributes.length,
      methods.length,
      attributeHeight,
      methodHeight
    )

    const finalWidth = Math.max(width, minWidth)

    // Update parent component and reactFlow node sizes
    useEffect(() => {
      if (setMinSize) {
        setMinSize({ minWidth, minHeight })
      }
      if (finalWidth > width + 5) {
        const newWidth = Math.ceil(finalWidth - ((finalWidth - width) % 5))

        reactFlow.updateNode(id, { width: newWidth })
      }
      reactFlow.updateNode(id, { height: minHeight })
    }, [
      finalWidth,
      setMinSize,
      reactFlow,
      id,
      minWidth,
      minHeight,
      width,
      height,
    ])

    return (
      <svg
        ref={ref}
        width={width}
        height={height}
        style={{
          transformOrigin: "left top",
          transformBox: "content-box",
          transform: transformScale ? `scale(${transformScale})` : undefined,
        }}
        {...svgAttributes}
      >
        <g>
          {/* Outer Rectangle */}
          <ThemedRect
            width={width}
            height={height}
            stroke="black"
            strokeWidth={LINE_WIDTH_ON_EDGE}
          />

          {/* Header Section */}
          <HeaderSection
            showStereotype={showStereotype}
            stereotype={stereotype}
            name={name}
            width={finalWidth}
            font={font}
            headerHeight={headerHeight}
          />

          {/* Attributes Section */}
          {attributes.length > 0 && (
            <>
              {/* Separation Line After Header */}
              <SeparationLine y={headerHeight} width={finalWidth} />
              <AttributesSection
                attributes={attributes}
                padding={padding}
                attributeHeight={attributeHeight}
                width={finalWidth}
                font={font}
                headerHeight={headerHeight}
              />
            </>
          )}

          {/* Methods Section */}
          {methods.length > 0 && (
            <>
              <SeparationLine
                y={headerHeight + attributes.length * attributeHeight}
                width={finalWidth}
              />
              <MethodsSection
                attributesLength={attributes.length}
                methods={methods}
                padding={padding}
                methodHeight={methodHeight}
                width={finalWidth}
                font={font}
                headerHeight={headerHeight}
              />
            </>
          )}
        </g>
      </svg>
    )
  }
)

// Sub-components for better modularity

interface HeaderSectionProps {
  showStereotype: boolean
  stereotype?: ClassType
  name: string
  width: number
  font: string
  headerHeight: number
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  showStereotype,
  stereotype,
  name,
  width,
  font,
  headerHeight,
}) => {
  return (
    <g>
      <Text
        x={width / 2}
        y={headerHeight / 2}
        dominantBaseline="middle"
        textAnchor="middle"
        font={font}
        fontWeight="bold"
        textDecoration={
          stereotype === ClassType.ObjectClass ? "underline" : "normal"
        }
      >
        {showStereotype && (
          <tspan x={width / 2} dy="-8" fontSize="85%">
            {`«${stereotype}»`}
          </tspan>
        )}
        <tspan
          x={width / 2}
          dy={showStereotype ? "18" : "0"}
          fontStyle={stereotype === ClassType.Abstract ? "italic" : "normal"}
        >
          {name}
        </tspan>
      </Text>
    </g>
  )
}

interface SeparationLineProps {
  y: number
  width: number
}

const SeparationLine: React.FC<SeparationLineProps> = ({ y, width }) => (
  <line
    x1="0"
    x2={width}
    y1={y}
    y2={y}
    stroke="black"
    strokeWidth={LINE_WIDTH}
  />
)

interface AttributesSectionProps {
  attributes: ExtraElement[]
  padding: number
  attributeHeight: number
  width: number
  font: string
  headerHeight: number
}

const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  padding,
  attributeHeight,
  font,
  headerHeight,
}) => (
  <g transform={`translate(0, ${headerHeight})`}>
    {attributes.map((attribute, index) => (
      <Text
        key={attribute.id}
        x={padding}
        y={15 + index * attributeHeight}
        dominantBaseline="middle"
        textAnchor="start"
        font={font}
      >
        {attribute.name}
      </Text>
    ))}
  </g>
)

interface MethodsSectionProps {
  methods: ExtraElement[]
  attributesLength: number
  padding: number
  methodHeight: number
  width: number
  font: string
  headerHeight: number
}

const MethodsSection: React.FC<MethodsSectionProps> = ({
  attributesLength,
  methods,
  padding,
  methodHeight,
  font,
  headerHeight,
}) => (
  <g
    transform={`translate(0, ${headerHeight + attributesLength * methodHeight})`}
  >
    {methods.map((method, index) => (
      <Text
        key={method.id}
        x={padding}
        y={15 + index * methodHeight}
        dominantBaseline="middle"
        textAnchor="start"
        font={font}
      >
        {method.name}
      </Text>
    ))}
  </g>
)
