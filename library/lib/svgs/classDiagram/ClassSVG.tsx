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

// Accurate text width measurement using Canvas API with the correct font
const measureTextWidth = (() => {
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")

  // Define the font to match root.css
  const font = "400 16px Inter, system-ui, Avenir, Helvetica, Arial, sans-serif"

  return (text: string): number => {
    if (!context) return text.length * 8 // Fallback if context is not available
    context.font = font
    const metrics = context.measureText(text)
    return metrics.width
  }
})()

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
    const margin = 2
    const headerHeight = 50
    const attributeHeight = 30
    const methodHeight = 30
    const padding = 10 // Inner horizontal padding for text
    const font =
      "400 16px Inter, system-ui, Avenir, Helvetica, Arial, sans-serif" // Match root.css

    const reactFlow = useReactFlow()

    // Calculate the widest text accurately
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
        ...headerTextWidths,
        ...attributesTextWidths,
        ...methodsTextWidths,
      ]
      return Math.max(...allTextWidths)
    }, [stereotype, name, attributes, methods])

    // Calculate the minimum width and height needed
    const minWidth = maxTextWidth + 2 * padding + 2 * margin
    const minHeight =
      headerHeight +
      attributes.length * attributeHeight +
      methods.length * methodHeight +
      margin

    const finalWidth = Math.max(width, minWidth)

    useEffect(() => {
      if (setMinSize) {
        setMinSize({ minWidth: minWidth, minHeight: minHeight })
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
          <g>
            <Text
              x={(finalWidth - 2 * margin) / 2}
              y={headerHeight / 2}
              dominantBaseline="middle"
              textAnchor="middle"
              font={font}
            >
              {stereotype && (
                <tspan x={(finalWidth - 2 * margin) / 2} dy="-8" fontSize="85%">
                  {`«${stereotype}»`}
                </tspan>
              )}
              <tspan
                x={(finalWidth - 2 * margin) / 2}
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
            x2={finalWidth - 2 * margin}
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
                  font={font}
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
              x2={finalWidth - 2 * margin}
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
                  font={font}
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
