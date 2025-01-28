import { Text, SVGComponentProps } from "@/components"
import { FC, forwardRef, SVGAttributes } from "react"

export type PackageSVGProps = SVGComponentProps & {
  width: number
  height: number
  name: string
  transformScale?: number
  svgAttributes?: SVGAttributes<SVGElement>
}

export const PackageSVG = forwardRef<SVGSVGElement, PackageSVGProps>(
  function PackageSVG(
    { width, height, name, svgAttributes, transformScale }: PackageSVGProps,
    ref
  ) {
    const headerHeight = 10 // Height of the top path
    const padding = 5

    return (
      <svg
        ref={ref}
        width={width}
        height={height + headerHeight}
        style={{
          transformOrigin: "left top",
          transformBox: "content-box",
          transform: transformScale ? `scale(${transformScale})` : undefined,
        }}
        {...svgAttributes}
      >
        <g>
          <HeaderBox headerHeight={headerHeight} />
          <MainBox width={width} height={height} headerHeight={headerHeight} />

          {/* Name Text */}
          <Text
            x={width / 2}
            y={headerHeight + padding}
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

type HeaderBoxProps = {
  headerHeight: number
}

const HeaderBox: FC<HeaderBoxProps> = ({ headerHeight }) => {
  return (
    <g>
      <rect
        x="0"
        y="0"
        width={40}
        height={headerHeight}
        fill="white"
        stroke="none"
      />
      <line x1="0" y1="0" x2="40" y2="0" stroke="black" strokeWidth={1} />

      {/* Right Side (0.5px) */}
      <line x1="40" y1="0" x2="40" y2="10" stroke="black" strokeWidth={0.5} />

      {/* Bottom Side (0.5px) */}
      <line x1="40" y1="10" x2="0" y2="10" stroke="black" strokeWidth={0.5} />

      {/* Left Side (1px) */}
      <line x1="0" y1="10" x2="0" y2="0" stroke="black" strokeWidth={1} />
    </g>
  )
}

type MainBoxProps = {
  width: number
  height: number
  headerHeight: number
}

const MainBox: FC<MainBoxProps> = ({ width, height, headerHeight }) => {
  return (
    <g>
      <rect
        x="0"
        y={headerHeight}
        width={width}
        height={height - headerHeight}
        fill="white"
        stroke="none"
      />

      {/* Top Side with strokeWidth: 0.5px */}
      <line
        x1="0"
        y1={headerHeight}
        x2={width}
        y2={headerHeight}
        stroke="black"
        strokeWidth="0.5"
      />

      {/* Right Side with strokeWidth: 1px */}
      <line
        x1={width}
        y1={headerHeight}
        x2={width}
        y2={height}
        stroke="black"
        strokeWidth="1"
      />

      {/* Bottom Side with strokeWidth: 1px */}
      <line
        x1={width}
        y1={height}
        x2="0"
        y2={height}
        stroke="black"
        strokeWidth="0.5"
      />

      {/* Left Side with strokeWidth: 1px */}
      <line
        x1="0"
        y1={height}
        x2="0"
        y2={headerHeight}
        stroke="black"
        strokeWidth="1"
      />
    </g>
  )
}
