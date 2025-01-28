import { Text, SVGComponentProps } from "@/components"
import { LINE_WIDTH, LINE_WIDTH_ON_EDGE } from "@/constants"
import { FC, forwardRef, SVGAttributes } from "react"

export type PackageSVGProps = SVGComponentProps & {
  width: number
  height: number
  name: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
}

const leftTopBoxHeight = 10
const padding = 5

export const PackageSVG = forwardRef<SVGSVGElement, PackageSVGProps>(
  function PackageSVG(
    { width, height, name, svgAttributes, transformScale }: PackageSVGProps,
    ref
  ) {
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
          <LeftTopBox leftTopBoxHeight={leftTopBoxHeight} />
          <MainBox
            width={width}
            height={height}
            leftTopBoxHeight={leftTopBoxHeight}
          />

          {/* Name Text */}
          <Text
            x={width / 2}
            y={leftTopBoxHeight + padding}
            textAnchor="middle"
            fontWeight="600"
            dominantBaseline="hanging"
          >
            {name}
          </Text>
        </g>
      </svg>
    )
  }
)

// Sub-components for better modularity

type LeftTopBoxProps = {
  leftTopBoxHeight: number
}

const LeftTopBox: FC<LeftTopBoxProps> = ({ leftTopBoxHeight }) => {
  return (
    <g>
      <rect
        x="0"
        y="0"
        width={40}
        height={leftTopBoxHeight}
        fill="white"
        stroke="none"
      />
      {/* Top Side */}
      <line
        x1="0"
        y1="0"
        x2="40"
        y2="0"
        stroke="black"
        strokeWidth={LINE_WIDTH_ON_EDGE}
      />

      {/* Right Side  */}
      <line
        x1="40"
        y1="0"
        x2="40"
        y2="10"
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />

      {/* Bottom Side */}
      <line
        x1="40"
        y1="10"
        x2="0"
        y2="10"
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />

      {/* Left Side  */}
      <line
        x1="0"
        y1="10"
        x2="0"
        y2="0"
        stroke="black"
        strokeWidth={LINE_WIDTH_ON_EDGE}
      />
    </g>
  )
}

type MainBoxProps = {
  width: number
  height: number
  leftTopBoxHeight: number
}

const MainBox: FC<MainBoxProps> = ({ width, height, leftTopBoxHeight }) => {
  return (
    <g>
      <rect
        x="0"
        y={leftTopBoxHeight}
        width={width}
        height={height - leftTopBoxHeight}
        fill="white"
        stroke="none"
      />

      {/* Top Side */}
      <line
        x1="0"
        y1={leftTopBoxHeight}
        x2={width}
        y2={leftTopBoxHeight}
        stroke="black"
        strokeWidth={LINE_WIDTH}
      />

      {/* Right Side with strokeWidth */}
      <line
        x1={width}
        y1={leftTopBoxHeight}
        x2={width}
        y2={height}
        stroke="black"
        strokeWidth={LINE_WIDTH_ON_EDGE}
      />

      {/* Bottom Side with strokeWidth*/}
      <line
        x1={width}
        y1={height}
        x2="0"
        y2={height}
        stroke="black"
        strokeWidth={LINE_WIDTH_ON_EDGE}
      />

      {/* Left Side with strokeWidth*/}
      <line
        x1="0"
        y1={height}
        x2="0"
        y2={leftTopBoxHeight}
        stroke="black"
        strokeWidth={LINE_WIDTH_ON_EDGE}
      />
    </g>
  )
}
