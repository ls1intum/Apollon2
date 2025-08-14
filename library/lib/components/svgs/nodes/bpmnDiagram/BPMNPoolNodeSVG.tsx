import { CustomText } from "@/components"
import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"

interface Swimlane {
  id: string
  name: string
}

export const BPMNPoolNodeSVG: React.FC<
  SVGComponentProps & { 
    name: string
    swimlanes?: Swimlane[]
  }
> = ({ width, height, name, swimlanes = [], svgAttributes, transformScale }) => {
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  const headerWidth = 40
  const swimlaneHeight = swimlanes.length > 0 ? height / swimlanes.length : height

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      {/* Pool outer border */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="white"
      />
      
      {/* Pool header separator line */}
      <line
        x1={headerWidth}
        y1={0}
        x2={headerWidth}
        y2={height}
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />
      
      {/* Pool name in header */}
      <CustomText
        x={headerWidth / 2}
        y={height / 2}
        textAnchor="middle"
        transform={`rotate(-90, ${headerWidth / 2}, ${height / 2})`}
      >
        {name}
      </CustomText>

      {/* Swimlane separators and labels (only if there are swimlanes) */}
      {swimlanes.length > 0 && swimlanes.map((swimlane, index) => {
        const yPos = index * swimlaneHeight
        const centerY = yPos + swimlaneHeight / 2
        
        return (
          <g key={swimlane.id}>
            {/* Swimlane separator line (except for the last one, as it's covered by pool border) */}
            {index < swimlanes.length - 1 && (
              <line
                x1={headerWidth}
                y1={yPos + swimlaneHeight}
                x2={width}
                y2={yPos + swimlaneHeight}
                stroke="black"
                strokeWidth={LINE_WIDTH}
              />
            )}
            
            {/* Swimlane name */}
            <CustomText
              x={headerWidth + 20}
              y={centerY}
              textAnchor="start"
              dominantBaseline="middle"
              fontSize="12"
            >
              {swimlane.name}
            </CustomText>
          </g>
        )
      })}
    </svg>
  )
}
