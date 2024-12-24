import {
  NodeResizer,
  type NodeProps,
  useStore,
  Handle,
  Position,
  useKeyPress,
} from "@xyflow/react"

import { DiagramElement } from "@/components/diagramElement"
import { DiagramElementNodeType } from "@/nodes"

// this will return the current dimensions of the node (measured internally by react flow)
function useNodeDimensions(id: string) {
  const node = useStore((state) => state.nodeLookup.get(id))
  return {
    width: node?.measured?.width || 0,
    height: node?.measured?.height || 0,
  }
}

export function DiagramElementNode({
  id,
  selected,
  data,
}: NodeProps<DiagramElementNodeType>) {
  const { color, type } = data

  const { width, height } = useNodeDimensions(id)
  const shiftKeyPressed = useKeyPress("Shift")
  const handleStyle = { backgroundColor: color }

  return (
    <>
      <NodeResizer
        color={color}
        keepAspectRatio={shiftKeyPressed}
        isVisible={selected}
      />
      <DiagramElement
        type={type}
        width={width}
        height={height}
        fill={color}
        strokeWidth={2}
        fillOpacity={0.8}
      />
      <Handle
        style={handleStyle}
        id="top"
        type="source"
        position={Position.Top}
      />
      <Handle
        style={handleStyle}
        id="right"
        type="source"
        position={Position.Right}
      />
      <Handle
        style={handleStyle}
        id="bottom"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        style={handleStyle}
        id="left"
        type="source"
        position={Position.Left}
      />
    </>
  )
}
