import {
  DiagramElementComponents,
  type DiagramElementComponentProps,
} from "./types"

export function DiagramElement({
  type,
  width,
  height,
  ...svgAttributes
}: DiagramElementComponentProps) {
  const DiagramElementComponent = DiagramElementComponents[type]

  if (!DiagramElementComponent || !width || !height) {
    return null
  }

  const strokeWidth = svgAttributes.strokeWidth ? +svgAttributes.strokeWidth : 0

  // we subtract the strokeWidth to make sure the shape is not cut off
  // this is done because svg doesn't support stroke inset (https://stackoverflow.com/questions/7241393/can-you-control-how-an-svgs-stroke-width-is-drawn)
  const innerWidth = width - 2 * strokeWidth
  const innerHeight = height - 2 * strokeWidth

  return (
    <svg width={width} height={height} className="shape-svg">
      {/* this offsets the shape by the strokeWidth so that we have enough space for the stroke */}
      <g
        transform={`translate(${svgAttributes.strokeWidth ?? 0}, ${
          svgAttributes.strokeWidth ?? 0
        })`}
      >
        <DiagramElementComponent
          width={innerWidth}
          height={innerHeight}
          {...svgAttributes}
        />
      </g>
    </svg>
  )
}
