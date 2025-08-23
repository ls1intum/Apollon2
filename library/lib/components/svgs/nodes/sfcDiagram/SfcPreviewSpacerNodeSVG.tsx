import { SVGComponentProps } from "@/types/SVG"

export const SfcPreviewSpacerNodeSVG: React.FC<SVGComponentProps> = ({
  width,
  height,
  svgAttributes,
  transformScale,
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
    />
  )
}
