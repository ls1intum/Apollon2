import { useBoundStore } from "@/store"
import { Handle, Position } from "@xyflow/react"
import { useShallow } from "zustand/shallow"

interface Props {
  children: React.ReactNode
  width: number
  height: number
  elementId: string
}

function calculateAdjustedQuarter(x: number): number {
  const quarter = x / 4 // Calculate 1/4 of x
  return Math.floor(quarter / 10) * 10 // Round down to nearest multiple of 10
}

export function DefaultNodeWrapper({
  elementId,
  children,
  width,
  height,
}: Props) {
  const adjustedWidth = calculateAdjustedQuarter(width)
  const adjustedHeight = calculateAdjustedQuarter(height)
  const interactiveElementId = useBoundStore(
    useShallow((state) => state.interactiveElementId)
  )

  const selectedHandleStyle = {
    opacity: 0.6,
    padding: 4,
    backgroundColor: "rgb(99, 154, 242)",
    zIndex: 10,
  }
  const selected = elementId === interactiveElementId
  return (
    <>
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{
          border: "0px",
          left: adjustedWidth,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={{ border: "0px", ...(selected ? selectedHandleStyle : {}) }}
      />
      <Handle
        id="top-right"
        type="source"
        position={Position.Top}
        style={{
          border: "0px",
          left: width - adjustedWidth,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />

      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{
          border: "0px",
          top: adjustedHeight,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{ border: "0px", ...(selected ? selectedHandleStyle : {}) }}
      />
      <Handle
        id="right-bottom"
        type="source"
        position={Position.Right}
        style={{
          border: "0px",
          top: height - adjustedHeight,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{
          border: "0px",
          left: width - adjustedWidth,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px", ...(selected ? selectedHandleStyle : {}) }}
      />
      <Handle
        id="bottom-left"
        type="source"
        position={Position.Bottom}
        style={{
          border: "0px",
          left: adjustedWidth,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{
          border: "0px",
          top: height - adjustedHeight,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={{ border: "0px", ...(selected ? selectedHandleStyle : {}) }}
      />
      <Handle
        id="left-top"
        type="source"
        position={Position.Left}
        style={{
          border: "0px",
          top: adjustedHeight,
          ...(selected ? selectedHandleStyle : {}),
        }}
      />
      {children}
    </>
  )
}
