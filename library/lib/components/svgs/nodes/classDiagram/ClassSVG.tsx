import { ClassNodeElement, ClassNodeProps } from "@/types"
import {
  DEFAULT_HEADER_HEIGHT,
  DEFAULT_ATTRIBUTE_HEIGHT,
  DEFAULT_METHOD_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_HEADER_HEIGHT_WITH_STREOTYPE,
} from "@/constants/dropElementConfig"
import { SeparationLine } from "@/components/svgs/nodes/SeparationLine"
import { HeaderSection } from "../HeaderSection"
import { RowBlockSection } from "../RowBlockSection"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import AssessmentIcon from "../../AssessmentIcon"
import { SVGComponentProps } from "@/types/SVG"
import { AssessmentSelectableElement } from "@/components/AssessmentSelectableElement"
import { StyledRect } from "../../StyledElements"
import { getCustomColorsFromData } from "@/utils/layoutUtils"

export interface MinSize {
  minWidth: number
  minHeight: number
}

export type ClassSVGProps = SVGComponentProps & {
  data: ClassNodeProps
}

export const ClassSVG = ({
  id,
  width,
  height,
  transformScale,
  svgAttributes,
  showAssessmentResults = false,
  data,
}: ClassSVGProps) => {
  // Layout constants
  const { attributes, methods, name, stereotype } = data
  const showStereotype = !!stereotype
  const headerHeight = showStereotype
    ? DEFAULT_HEADER_HEIGHT_WITH_STREOTYPE
    : DEFAULT_HEADER_HEIGHT
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
      <AssessmentSelectableElement
        elementId={id}
        width={width}
        itemHeight={headerHeight}
        yOffset={0}
      >
        <StyledRect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={strokeColor}
        />

        {/* Header Section */}
        <HeaderSection
          showStereotype={showStereotype}
          stereotype={stereotype}
          name={name}
          width={width}
          headerHeight={headerHeight}
          textColor={textColor}
          fill={fillColor}
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
      </AssessmentSelectableElement>
    </svg>
  )
}
