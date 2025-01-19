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
  DEFAULT_MARGIN,
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
    const margin = DEFAULT_MARGIN
    const headerHeight = DEFAULT_HEADER_HEIGHT
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
    const minWidth = calculateMinWidth(maxTextWidth, padding, margin)
    const minHeight = calculateMinHeight(
      headerHeight,
      attributes.length,
      methods.length,
      attributeHeight,
      methodHeight,
      margin
    )

    const finalWidth = Math.max(width, minWidth)

    // Update parent component and reactFlow node sizes
    useEffect(() => {
      if (setMinSize) {
        setMinSize({ minWidth, minHeight })
      }
      if (finalWidth > width) {
        reactFlow.updateNode(id, { width: finalWidth })
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
        width={finalWidth}
        height={minHeight}
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
            width={finalWidth - 2 * margin}
            height={minHeight - 2 * margin}
            stroke="black"
            strokeWidth="0.5"
          />

          {/* Header Section */}
          <HeaderSection
            stereotype={stereotype}
            name={name}
            width={finalWidth - 2 * margin}
            font={font}
          />

          {/* Attributes Section */}
          {attributes.length > 0 && (
            <>
              {/* Separation Line After Header */}
              <SeparationLine
                y={headerHeight}
                width={finalWidth - 2 * margin}
              />
              <AttributesSection
                attributes={attributes}
                padding={padding}
                attributeHeight={attributeHeight}
                width={finalWidth - 2 * margin}
                font={font}
              />
            </>
          )}

          {/* Methods Section */}
          {methods.length > 0 && (
            <>
              <SeparationLine
                y={headerHeight + attributes.length * attributeHeight}
                width={finalWidth - 2 * margin}
              />
              <MethodsSection
                attributesLength={attributes.length}
                methods={methods}
                padding={padding}
                methodHeight={methodHeight}
                width={finalWidth - 2 * margin}
                font={font}
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
  stereotype?: ClassType
  name: string
  width: number
  font: string
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  stereotype,
  name,
  width,
  font,
}) => (
  <g>
    <Text
      x={width / 2}
      y={DEFAULT_HEADER_HEIGHT / 2}
      dominantBaseline="middle"
      textAnchor="middle"
      font={font}
    >
      {stereotype && (
        <tspan x={width / 2} dy="-8" fontSize="85%">
          {`«${stereotype}»`}
        </tspan>
      )}
      <tspan x={width / 2} dy={stereotype ? "18" : "0"} fontWeight="600">
        {name}
      </tspan>
    </Text>
  </g>
)

interface SeparationLineProps {
  y: number
  width: number
}

const SeparationLine: React.FC<SeparationLineProps> = ({ y, width }) => (
  <line x1="0" x2={width} y1={y} y2={y} stroke="black" strokeWidth="0.5" />
)

interface AttributesSectionProps {
  attributes: ExtraElement[]
  padding: number
  attributeHeight: number
  width: number
  font: string
}

const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  padding,
  attributeHeight,
  font,
}) => (
  <g transform={`translate(0, ${DEFAULT_HEADER_HEIGHT})`}>
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
}

const MethodsSection: React.FC<MethodsSectionProps> = ({
  attributesLength,
  methods,
  padding,
  methodHeight,
  font,
}) => (
  <g
    transform={`translate(0, ${DEFAULT_HEADER_HEIGHT + attributesLength * methodHeight})`}
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
