import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { DefaultNodeProps } from "@/types"
import { SfcPreviewSpacerNodeSVG } from "@/components"

export function SfcPreviewSpacer({
  id,
  width,
  height,
}: NodeProps<Node<DefaultNodeProps>>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper width={width} height={height} elementId={id}>
      <SfcPreviewSpacerNodeSVG width={width} height={height} id={id} />
    </DefaultNodeWrapper>
  )
}
