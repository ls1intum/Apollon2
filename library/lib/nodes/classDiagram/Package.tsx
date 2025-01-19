import { NodeProps, NodeResizer, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { memo } from "react"
import { PackageSVG } from "@/components"
import { useHandleOnResize } from "@/hooks"

type Props = Node<{
  name: string
}>

export function Package({
  width,
  height,
  selected,
  data: { name },
  parentId,
}: NodeProps<Props>) {
  const { onResize } = useHandleOnResize(parentId)
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <NodeResizer
        isVisible={Boolean(selected)}
        minHeight={100}
        minWidth={100}
        onResize={onResize}
      />
      <PackageSVG width={width} height={height} name={name} />
    </DefaultNodeWrapper>
  )
}

export default memo(Package, (prev, next) => {
  return (
    prev.data.name === next.data.name &&
    prev.width === next.width &&
    prev.height === next.height &&
    prev.selected === next.selected
  )
})
