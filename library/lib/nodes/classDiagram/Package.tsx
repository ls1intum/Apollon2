import { NodeProps, NodeResizer, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { memo } from "react"
import { PackageSVG } from "@/components"

type Props = Node<{
  name: string
}>

export function Package({
  width,
  height,
  selected,
  data: { name },
  id,
}: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }
  console.log(
    `Package ${id} rendered with width: ${width} and height: ${height}`
  )

  return (
    // <DefaultNodeWrapper>
    //   {/* <Handle position={Position.Right} type="target" /> */}
    //   {/* <Handle position={Position.Left} type="source" /> */}
    //   <div style={{ width, height, backgroundColor: "red" }}></div>
    // </DefaultNodeWrapper>

    <DefaultNodeWrapper>
      <NodeResizer
        isVisible={Boolean(selected)}
        minHeight={100}
        minWidth={100}
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
