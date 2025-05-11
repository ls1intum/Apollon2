import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useDiagramStore } from "@/store/context"
import { Handle, Position } from "@xyflow/react"
import { useShallow } from "zustand/shallow"

interface Props {
  children: React.ReactNode
  width?: number
  height?: number
  elementId: string
}

function calculateAdjustedQuarter(x: number): number {
  const quarter = x / 4 // Calculate 1/4 of x
  return Math.floor(quarter / 10) * 10 // Round down to nearest multiple of 10
}

export function DefaultNodeWrapper({
  elementId,
  children,
  width = 0,
  height = 0,
}: Props) {
  const interactiveElementId = useDiagramStore(
    useShallow((state) => state.interactiveElementId)
  )

  const adjustedWidth = calculateAdjustedQuarter(width)
  const adjustedHeight = calculateAdjustedQuarter(height)

  const isDiagramModifiable = useDiagramModifiable()
  const verticalOffset = isDiagramModifiable ? 0 : 20

  const selected = elementId === interactiveElementId

  const selectedHandleStyle =
    selected && isDiagramModifiable
      ? {
          opacity: 0.6,
          padding: 4,
          backgroundColor: "rgb(99, 154, 242)",
          zIndex: 10,
        }
      : {}

  return (
    <div
      className={
        isDiagramModifiable
          ? "react-flow-node-default"
          : "react-flow-node-assessment"
      }
      style={{ width, height }}
    >
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{
          border: "0px",
          left: adjustedWidth,
          top: verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={{
          border: "0px",
          top: verticalOffset,
          left: width / 2,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="top-right"
        type="source"
        position={Position.Top}
        style={{
          border: "0px",
          left: adjustedWidth + width / 2,
          top: verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />

      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{
          border: "0px",
          top: adjustedHeight + verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{
          border: "0px",
          top: height / 2 + verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="right-bottom"
        type="source"
        position={Position.Right}
        style={{
          border: "0px",
          top: height - adjustedHeight + verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{
          border: "0px",
          left: width / 2 + adjustedWidth,
          bottom: -1 * verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{
          border: "0px",
          bottom: -1 * verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="bottom-left"
        type="source"
        position={Position.Bottom}
        style={{
          border: "0px",
          left: adjustedWidth,
          bottom: -1 * verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{
          border: "0px",
          top: height - adjustedHeight + verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={{
          border: "0px",
          top: height / 2 + verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      <Handle
        id="left-top"
        type="source"
        position={Position.Left}
        style={{
          border: "0px",
          top: adjustedHeight + verticalOffset,
          ...selectedHandleStyle,
        }}
        isConnectable={isDiagramModifiable}
      />
      {children}
    </div>
  )
}
