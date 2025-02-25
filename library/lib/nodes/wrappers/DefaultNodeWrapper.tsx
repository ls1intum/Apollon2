import { Handle, Position } from "@xyflow/react"

interface Props {
  children: React.ReactNode
  width: number
  height: number
}

function calculateAdjustedQuarter(x: number): number {
  const quarter = x / 4 // Calculate 1/4 of x
  return Math.floor(quarter / 10) * 10 // Round down to nearest multiple of 10
}

export function DefaultNodeWrapper({ children, width, height }: Props) {
  const adjustedWidth = calculateAdjustedQuarter(width)
  const adjustedHeight = calculateAdjustedQuarter(height)
  return (
    <>
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{ border: "0px", left: adjustedWidth }}
      />
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={{ border: "0px" }}
      />
      <Handle
        id="top-right"
        type="source"
        position={Position.Top}
        style={{ border: "0px", left: width - adjustedWidth }}
      />

      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{ border: "0px", top: adjustedHeight }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{ border: "0px" }}
      />
      <Handle
        id="right-bottom"
        type="source"
        position={Position.Right}
        style={{ border: "0px", top: height - adjustedHeight }}
      />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px", left: width - adjustedWidth }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px" }}
      />
      <Handle
        id="bottom-left"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px", left: adjustedWidth }}
      />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{ border: "0px", top: height - adjustedHeight }}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={{ border: "0px" }}
      />
      <Handle
        id="left-top"
        type="source"
        position={Position.Left}
        style={{ border: "0px", top: adjustedHeight }}
      />
      {children}
    </>
  )
}
