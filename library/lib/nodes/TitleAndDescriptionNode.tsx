import { NodeProps, NodeResizer, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { TitleAndDescriptionSVG } from "@/components"

type Props = Node<{
  description?: string
  title: string
}>

export function TitleAndDesctiption({
  selected,
  width,
  height,
  id,
  data: { description, title },
}: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper
      width={width}
      height={height}
      elementId={id}
      selected={!!selected}
    >
      <TitleAndDescriptionSVG
        width={width}
        height={height}
        title={title}
        description={description || ""}
      />
      <NodeResizer
        isVisible={!!selected}
        minHeight={200}
        handleStyle={{ width: 8, height: 8 }}
      />
    </DefaultNodeWrapper>
  )
}
