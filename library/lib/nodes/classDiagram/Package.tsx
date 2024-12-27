import { ThemedPath, ThemedRect } from "@/components/ThemedElements"
import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { Text } from "@/components/Text"

type Props = Node<{
  name: string
}>

export function Package({ width, height, data: { name } }: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <svg width={width} height={height}>
        <g>
          <ThemedPath as="path" d={`M 0 10 V 0 H 40 V 10`} />
          <ThemedRect as="rect" y={10} width={width} height={height - 10} />
          <Text y={20} dy={10} textAnchor="middle" fontWeight="600">
            {name}
          </Text>
        </g>
      </svg>
    </DefaultNodeWrapper>
  )
}
