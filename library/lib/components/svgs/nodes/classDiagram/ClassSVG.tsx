import React, { forwardRef, useEffect, useMemo } from "react"
import { ThemedRect } from "@/components/ThemedElements"
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
  LINE_WIDTH_ON_EDGE,
} from "@/constants/dropElementConfig"
import { SeparationLine } from "@/components/svgs/nodes/SeparationLine"
import { HeaderSection } from "../HeaderSection"
import { RowBlockSection } from "../RowBlockSection"

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
              <RowBlockSection
                items={attributes}
                padding={padding}
                itemHeight={attributeHeight}
                width={finalWidth}
                font={font}
                offsetFromTop={headerHeight}
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
              <RowBlockSection
                items={methods}
                padding={padding}
                itemHeight={methodHeight}
                width={finalWidth}
                font={font}
                offsetFromTop={headerHeight + attributes.length * methodHeight}
              />
            </>
          )}
        </g>
      </svg>
    )
  }
)
