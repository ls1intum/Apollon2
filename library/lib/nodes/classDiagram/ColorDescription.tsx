import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { ColorDescriptionSVG } from "@/components"

type Props = Node<{
  description: string
}>

export function ColorDescription({
  width,
  height,
  data: { description },
  id,
}: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper width={width} height={height} elementId={id}>
      <ColorDescriptionSVG
        description={description}
        width={width}
        height={height}
      />
    </DefaultNodeWrapper>
  )
}
