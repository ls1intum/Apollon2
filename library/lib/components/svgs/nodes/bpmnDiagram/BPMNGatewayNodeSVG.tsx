import { LINE_WIDTH } from "@/constants"
import { SVGComponentProps } from "@/types/SVG"
import { BPMNGatewayType } from "@/types"
import { CustomText } from "@/components"

export const BPMNGatewayNodeSVG: React.FC<
  SVGComponentProps & { name?: string; gatewayType?: BPMNGatewayType }
> = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  gatewayType = "exclusive",
}) => {
  const scaledWidth = width * (transformScale ?? 1)
  const scaledHeight = height * (transformScale ?? 1)

  const cx = width / 2
  const cy = height / 2
  const w = Math.min(width, height)
  const half = w / 2

  const points = [
    `${cx},${cy - half}`,
    `${cx + half},${cy}`,
    `${cx},${cy + half}`,
    `${cx - half},${cy}`,
  ].join(" ")

  return (
    <svg
      width={scaledWidth}
      height={scaledHeight}
      viewBox={`0 0 ${width} ${height}`}
      overflow="visible"
      {...svgAttributes}
    >
      <polygon
        points={points}
        stroke="black"
        strokeWidth={LINE_WIDTH}
        fill="white"
      />
      {gatewayType === "exclusive" && (
        <g>
          <line
            x1={13}
            y1={13}
            x2={width - 13}
            y2={height - 13}
            stroke="black"
          />
          <line
            x1={13}
            y1={height - 13}
            x2={width - 13}
            y2={13}
            stroke="black"
          />
        </g>
      )}
      {gatewayType === "parallel" && (
        <g>
          <line
            x1={width / 2}
            y1={10}
            x2={width / 2}
            y2={height - 10}
            stroke="black"
          />
          <line
            x1={10}
            y1={height / 2}
            x2={width - 10}
            y2={height / 2}
            stroke="black"
          />
        </g>
      )}
      {gatewayType === "inclusive" && (
        <circle
          cx={width / 2}
          cy={height / 2}
          r={Math.min(width, height) / 2 - 12}
          fill="none"
          stroke="black"
        />
      )}
      {gatewayType === "event-based" && (
        <g>
          <circle
            cx={width / 2}
            cy={height / 2}
            r={Math.min(width, height) / 2 - 9}
            fill="none"
            stroke="black"
          />
          <circle
            cx={width / 2}
            cy={height / 2}
            r={Math.min(width, height) / 2 - 12}
            fill="none"
            stroke="black"
          />
          {/* small pentagon */}
          <path
            d={`M${width / 2} ${height / 2 - 4} L${width / 2 + 3.5} ${height / 2 - 1} L${width / 2 + 2} ${
              height / 2 + 3.5
            } L${width / 2 - 2} ${height / 2 + 3.5} L${width / 2 - 3.5} ${height / 2 - 1} Z`}
            fill="none"
            stroke="black"
          />
        </g>
      )}
      {gatewayType === "complex" && (
        <g>
          {/* X */}
          <line
            x1={13}
            y1={13}
            x2={width - 13}
            y2={height - 13}
            stroke="black"
          />
          <line
            x1={13}
            y1={height - 13}
            x2={width - 13}
            y2={13}
            stroke="black"
          />
          {/* + */}
          <line
            x1={width / 2}
            y1={10}
            x2={width / 2}
            y2={height - 10}
            stroke="black"
          />
          <line
            x1={10}
            y1={height / 2}
            x2={width - 10}
            y2={height / 2}
            stroke="black"
          />
        </g>
      )}
      {name && (
        <CustomText
          x={width / 2}
          y={height + 20}
          textAnchor="middle"
          fontSize={14}
          dominantBaseline="hanging"
        >
          {name}
        </CustomText>
      )}
    </svg>
  )
}
