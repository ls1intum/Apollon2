import React from "react"
import { ThemedRect } from "@/components/ThemedElements"
import { ClassType, ClassNodeElement } from "@/types"
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
  methods: ClassNodeElement[]
  attributes: ClassNodeElement[]
  stereotype?: ClassType
  name: string
}

export const ClassSVG = ({
  width,
  height,
  methods,
  attributes,
  stereotype,
  name,
  transformScale,
  svgAttributes,
}: ClassSVGProps) => {
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

  return (
    <svg
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
          width={width}
          font={font}
          headerHeight={headerHeight}
        />

        {/* Attributes Section */}
        {attributes.length > 0 && (
          <>
            {/* Separation Line After Header */}
            <SeparationLine y={headerHeight} width={width} />
            <RowBlockSection
              items={attributes}
              padding={padding}
              itemHeight={attributeHeight}
              width={width}
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
              width={width}
            />
            <RowBlockSection
              items={methods}
              padding={padding}
              itemHeight={methodHeight}
              width={width}
              font={font}
              offsetFromTop={headerHeight + attributes.length * methodHeight}
            />
          </>
        )}
      </g>
    </svg>
  )
}
