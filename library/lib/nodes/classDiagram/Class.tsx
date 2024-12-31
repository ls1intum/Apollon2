import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassSVG } from "@/svgs"
import { ClassType } from "@/types"

export type ExtraElements = {
  id: string
  name: string
}

type Props = Node<{
  methods: ExtraElements[]
  attributes: ExtraElements[]
  stereotype?: ClassType
  name: string
}>

export function Class({
  width,
  height,
  data: { methods, attributes, stereotype, name },
}: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <ClassSVG
        width={width}
        height={height}
        attributes={attributes}
        methods={methods}
        stereotype={stereotype}
        name={name}
      />
    </DefaultNodeWrapper>
  )
}
