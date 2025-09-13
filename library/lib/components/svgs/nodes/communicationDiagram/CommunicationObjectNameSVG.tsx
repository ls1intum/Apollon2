import { ClassNodeElement, CommunicationObjectNodeProps } from "@/types"
import {
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_ATTRIBUTE_HEIGHT,
  DEFAULT_METHOD_HEIGHT,
  DEFAULT_PADDING,
} from "@/constants/dropElementConfig"
import { SeparationLine } from "@/components/svgs/nodes/SeparationLine"
import { HeaderSection } from "../HeaderSection"
import { RowBlockSection } from "../RowBlockSection"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"
import { StyledRect } from "@/components"
import { getCustomColorsFromData } from "@/utils"

export type CommunicationObjectNameSVGProps = SVGComponentProps & {
  data: CommunicationObjectNodeProps
}

export const CommunicationObjectNameSVG = ({
  id,
  width,
  height,
  data,
  transformScale,
  svgAttributes,
  showAssessmentResults = false,
}: CommunicationObjectNameSVGProps) => {
  const { name, attributes = [], methods = [] } = data
  // Layout constants - no stereotype for communication diagrams
  const headerHeight = DEFAULT_HEADER_HEIGHT
  const attributeHeight = DEFAULT_ATTRIBUTE_HEIGHT
  const methodHeight = DEFAULT_METHOD_HEIGHT
  const padding = DEFAULT_PADDING

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

  const { fillColor, strokeColor, textColor } = getCustomColorsFromData(data)
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
        <StyledRect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={strokeColor}
        />

        {/* Header Section - Communication object name with underline */}
        <HeaderSection
          showStereotype={false}
          stereotype={undefined}
          name={name}
          width={width}
          headerHeight={headerHeight}
          isUnderlined={true} // Communication objects have underlined names
          fill={fillColor}
          textColor={textColor}
        />

        {/* Attributes Section */}
        {attributes.length > 0 && (
          <>
            {/* Separation Line After Header */}
            <SeparationLine
              y={headerHeight}
              width={width}
              strokeColor={strokeColor}
            />
            <RowBlockSection
              items={processedAttributes}
              padding={padding}
              itemHeight={attributeHeight}
              width={width}
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
              strokeColor={strokeColor}
            />
            <RowBlockSection
              items={processedMethods}
              padding={padding}
              itemHeight={methodHeight}
              width={width}
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
