import React from "react"
import { ClassType, ClassNodeElement } from "@/types"
import {
  DEFAULT_FONT,
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_ATTRIBUTE_HEIGHT,
  DEFAULT_METHOD_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_HEADER_HEIGHT_WITH_STREOTYPE,
  LINE_WIDTH,
} from "@/constants/dropElementConfig"
import { SeparationLine } from "@/components/svgs/nodes/SeparationLine"
import { HeaderSection } from "../HeaderSection"
import { RowBlockSection } from "../RowBlockSection"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"

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
  showAssessmentResults?: boolean
}

export const ClassSVG = ({
  id,
  width,
  height,
  methods,
  attributes,
  stereotype,
  name,
  transformScale,
  svgAttributes,
  showAssessmentResults = false,
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

  const assessments = useDiagramStore(useShallow((state) => state.assessments))

  const processElements = (elements: ClassNodeElement[]) =>
    elements.map((el) => {
      const score = assessments[el.id]?.score
      return { ...el, score }
    })

  const processedAttributes = processElements(attributes)
  const processedMethods = processElements(methods)
  const nodeScore = assessments[id]?.score

  const svgWidth = showAssessmentResults ? width + 20 : width
  const svgHeight = showAssessmentResults ? height + 20 : height
  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={
        showAssessmentResults
          ? `0 -20 ${svgWidth} ${svgHeight}`
          : `0 0 ${svgWidth} ${svgHeight}`
      }
      style={{
        transformOrigin: "left top",
        transformBox: "content-box",
        transform: transformScale ? `scale(${transformScale})` : undefined,
      }}
      {...svgAttributes}
    >
      <g>
        {/* Outer Rectangle */}
        <rect
          x={LINE_WIDTH}
          y={LINE_WIDTH}
          width={width - 2 * LINE_WIDTH}
          height={height - 2 * LINE_WIDTH}
          stroke="black"
          strokeWidth={LINE_WIDTH}
          fill="white"
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
              items={processedAttributes}
              padding={padding}
              itemHeight={attributeHeight}
              width={width}
              font={font}
              offsetFromTop={headerHeight}
              showAssessmentResults={showAssessmentResults}
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
              items={processedMethods}
              padding={padding}
              itemHeight={methodHeight}
              width={width}
              font={font}
              offsetFromTop={headerHeight + attributes.length * methodHeight}
              showAssessmentResults={showAssessmentResults}
            />
          </>
        )}

        {showAssessmentResults && (
          <AssessmentIcon score={nodeScore} x={width - 15} y={-15} />
        )}
      </g>
    </svg>
  )
}
