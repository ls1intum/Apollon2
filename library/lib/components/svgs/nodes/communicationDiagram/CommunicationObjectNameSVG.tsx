import { ClassNodeElement } from "@/types"
import {
  DEFAULT_FONT,
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_ATTRIBUTE_HEIGHT,
  DEFAULT_METHOD_HEIGHT,
  DEFAULT_PADDING,
  LINE_WIDTH,
} from "@/constants/dropElementConfig"
import { SeparationLine } from "@/components/svgs/nodes/SeparationLine"
import { HeaderSection } from "../HeaderSection"
import { RowBlockSection } from "../RowBlockSection"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"

export type CommunicationObjectNameSVGProps = SVGComponentProps & {
  methods: ClassNodeElement[]
  attributes: ClassNodeElement[]
  name: string
}

export const CommunicationObjectNameSVG = ({
  id,
  width,
  height,
  methods,
  attributes,
  name,
  transformScale,
  svgAttributes,
  showAssessmentResults = false,
}: CommunicationObjectNameSVGProps) => {
  // Layout constants - no stereotype for communication diagrams
  const headerHeight = DEFAULT_HEADER_HEIGHT
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

  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <g>
        {/* Outer Rectangle */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke="black"
          strokeWidth={LINE_WIDTH}
          fill="white"
        />

        {/* Header Section - Communication object name with underline */}
        <HeaderSection
          showStereotype={false}
          stereotype={undefined}
          name={name}
          width={width}
          font={font}
          headerHeight={headerHeight}
          isUnderlined={true} // Communication objects have underlined names
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
