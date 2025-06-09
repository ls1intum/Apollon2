import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { ColorDescriptionSVG } from "@/components"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"

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

  const selected = useIsOnlyThisElementSelected(id)

  return (
    <DefaultNodeWrapper
      width={width}
      height={height}
      elementId={id}
      selected={!!selected}
    >
      <ColorDescriptionSVG
        description={description}
        width={width}
        height={height}
      />
    </DefaultNodeWrapper>
  )
}
