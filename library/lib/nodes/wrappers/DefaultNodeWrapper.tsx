import { Handle, Position } from "@xyflow/react"

interface Props {
  children: React.ReactNode
  width: number
  height: number
}

export function DefaultNodeWrapper({ children, width, height }: Props) {
  return (
    <>
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{ border: "0px", left: 20 }}
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
        style={{ border: "0px", left: width - 20 }}
      />

      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{ border: "0px", top: 20 }}
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
        style={{ border: "0px", top: height - 20 }}
      />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px", left: width - 20 }}
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
        style={{ border: "0px", left: 20 }}
      />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{ border: "0px", top: height - 20 }}
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
        style={{ border: "0px", top: 20 }}
      />
      {children}
    </>
  )
}
