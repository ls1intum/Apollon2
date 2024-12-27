import { ThemedPath } from "@/components/ThemedElements"
import { NodeProps, type Node } from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { Text } from "@/components"

type Props = Node<{
  description: string
}>

export function ColorDescription({
  width,
  height,
  data: { description },
}: NodeProps<Props>) {
  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <svg width={width} height={height}>
        <g>
          <ThemedPath
            as="path"
            d={`M 0 0 L ${width - 15} 0 L ${width} 15 L ${width} ${
              height
            } L 0 ${height} L 0 0 Z`}
            strokeWidth="1.2"
            strokeMiterlimit="10"
          />
          <ThemedPath
            as="path"
            d={`M ${width - 15} 0 L ${width - 15} 15 L ${width} 15`}
            fillColor="none"
            strokeWidth="1.2"
            strokeMiterlimit="10"
          />
          {/* <rect width="100%" height="100%" stroke={element.strokeColor || 'black'} /> */}
          <Text>{description}</Text>
        </g>
      </svg>
    </DefaultNodeWrapper>
  )
}
