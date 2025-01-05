import { NodeProps, NodeResizer, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { SvgWithTitleAndDescription } from "@/svgs"

type Props = Node<{
  description?: string
  title: string
}>

export function TitleAndDesctiption({
  selected,
  width,
  height,
  data: { description, title },
}: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <SvgWithTitleAndDescription
        width={width}
        height={height}
        title={title}
        description={description || ""}
      />
      <NodeResizer isVisible={selected} minHeight={200} />
    </DefaultNodeWrapper>
  )
}
