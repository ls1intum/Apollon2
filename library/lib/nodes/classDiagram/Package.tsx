import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { PackageSVG } from "@/components"

type Props = Node<{
  name: string
}>

export function Package({ width, height, data: { name } }: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <PackageSVG width={width} height={height} name={name} />
    </DefaultNodeWrapper>
  )
}
