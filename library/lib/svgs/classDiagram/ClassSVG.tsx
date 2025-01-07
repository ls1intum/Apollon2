import { ThemedRect } from "@/components/ThemedElements"
import { Text } from "@/components/Text"
import { ClassType, ExtraElements } from "@/types"
import {
  Dispatch,
  SetStateAction,
  SVGAttributes,
  useEffect,
  useMemo,
} from "react"
import { forwardRef } from "react"
import { useReactFlow } from "@xyflow/react"

export type ClassSVGProps = {
  width: number
  height: number
  methods: ExtraElements[]
  attributes: ExtraElements[]
  stereotype?: ClassType
  name: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
  setMinSize?: Dispatch<SetStateAction<{ minWidth: number; minHeight: number }>>
  id: string
}

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
    const margin = 2 // Padding inside the SVG content
    const headerHeight = 50 // Height of the header section
    const attributeHeight = 30 // Height per attribute
    const methodHeight = 30 // Height per method
    const padding = 10 // Inner padding for text

    const reactFlow = useReactFlow()
    // Utility to measure text width
    const measureTextWidth = (text: string, approxCharWidth = 8): number => {
      return text.length * approxCharWidth // Approximate width calculation
    }

    // Calculate the widest text
    const maxTextWidth = useMemo(() => {
      const headerTextWidths = [
        stereotype ? measureTextWidth(`«${stereotype}»`) : 0,
        measureTextWidth(name),
      ]
      const attributesTextWidths = attributes.map((attr) =>
        measureTextWidth(attr.name)
      )
      const methodsTextWidths = methods.map((method) =>
        measureTextWidth(method.name)
      )
      const allTextWidths = [
        ...headerTextWidths, // Max of stereotype and name
        ...attributesTextWidths,
        ...methodsTextWidths,
      ]
      return Math.max(...allTextWidths) // Find the maximum width
    }, [stereotype, name, attributes, methods])

    // Calculate the minimum width needed
    const minWidth = maxTextWidth + 2 * padding + 2 * margin
    const minHeight =
      headerHeight +
      attributes.length * attributeHeight +
      methods.length * methodHeight

    // Adjusted width
    // const finalWidth = transformScale
    //   ? transformScale * Math.max(width, minWidth)
    //   : Math.max(width, minWidth)
    const svgHeight = Math.max(height, minHeight)
    const svgWidth = Math.max(width, minWidth)
    // const svgHeight = totalHeight

    useEffect(() => {
      // console.log("DEBUG minWidth", minWidth)
      // console.log("DEBUG minHeight", minHeight)
      if (setMinSize) {
        setMinSize({ minWidth, minHeight })
      }
      if (minWidth > width) {
        console.log("DEBUG minWidth > width")
        reactFlow.updateNode(id, { width: minWidth })
      }
      if (minHeight > height) {
        console.log("DEBUG minHeight > height")
        reactFlow.updateNode(id, { height: minHeight })
      }
    }, [minWidth, minHeight])

    return (
      <svg
        ref={ref}
        width={svgWidth}
        height={svgHeight}
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
            width={svgWidth - 2 * margin}
            height={Math.max(height, svgHeight) - 2 * margin}
            stroke="black"
            strokeWidth="0.5"
          />

          {/* Header Section */}
          <g>
            <Text
              x={(svgWidth - 2 * margin) / 2}
              y={headerHeight / 2}
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {stereotype && (
                <tspan x={(svgWidth - 2 * margin) / 2} dy="-8" fontSize="85%">
                  {`«${stereotype}»`}
                </tspan>
              )}
              <tspan
                x={(svgWidth - 2 * margin) / 2}
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
            x2={svgWidth - 2 * margin}
            y1={headerHeight}
            y2={headerHeight}
            stroke="black"
            strokeWidth="0.5"
          />

          {/* Attributes Section */}
          {attributes.length > 0 && (
            <g transform={`translate(0, ${headerHeight})`}>
              {attributes.map((attribute, index) => (
                <Text
                  key={attribute.id}
                  x={padding}
                  y={15 + index * attributeHeight}
                  dominantBaseline="middle"
                  textAnchor="start"
                >
                  {attribute.name}
                </Text>
              ))}
            </g>
          )}

          {/* Separation Line After Attributes */}
          {attributes.length > 0 && (
            <line
              x1="0"
              x2={svgWidth - 2 * margin}
              y1={headerHeight + attributes.length * attributeHeight}
              y2={headerHeight + attributes.length * attributeHeight}
              stroke="black"
              strokeWidth="0.5"
            />
          )}

          {/* Methods Section */}
          {methods.length > 0 && (
            <g
              transform={`translate(0, ${
                headerHeight + attributes.length * attributeHeight
              })`}
            >
              {methods.map((method, index) => (
                <Text
                  key={method.id}
                  x={padding}
                  y={15 + index * methodHeight}
                  dominantBaseline="middle"
                  textAnchor="start"
                >
                  {method.name}
                </Text>
              ))}
            </g>
          )}
        </g>
      </svg>
    )
  }
)
