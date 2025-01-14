import { NodeProps, NodeResizer, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { PackageSVG } from "@/components"

type Props = Node<{
  name: string
}>

export function Package({
  selected,
  width,
  height,
  data: { name },
}: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <NodeResizer isVisible={selected} minHeight={100} minWidth={100} />
      <PackageSVG width={width} height={height} name={name} />
    </DefaultNodeWrapper>
  )
}
