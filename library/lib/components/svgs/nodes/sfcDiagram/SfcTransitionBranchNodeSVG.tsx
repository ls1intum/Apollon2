import { CustomText } from "@/components"
import { SVGComponentProps } from "@/types/SVG"

interface Props extends SVGComponentProps {
  name?: string
  showHint?: boolean
}

export const SfcTransitionBranchNodeSVG: React.FC<Props> = ({
  width,
  height,
  name,
  svgAttributes,
  transformScale,
  showHint = false,
}) => {
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
      <circle cx={10} cy={10} r={10} fill="var(--apollon-primary-contrast)" />
      {showHint && (
        <CustomText x={0} y={30}>
          {name}
        </CustomText>
      )}
    </svg>
  )
}
