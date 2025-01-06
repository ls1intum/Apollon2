import { Handle, Position } from "@xyflow/react"

interface Props {
  children: React.ReactNode
}

export function DefaultNodeWrapper({ children }: Props) {
  return (
    <>
      {children}
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{ left: "calc(15%)" }}
      />
      <Handle id="top" type="source" position={Position.Top} />
      <Handle
        id="top-right"
        type="source"
        position={Position.Top}
        style={{ left: "calc(85%)" }}
      />
      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{ top: "calc(15%)" }}
      />
      <Handle id="right" type="source" position={Position.Right} />
      <Handle
        id="right-bottom"
        type="source"
        position={Position.Right}
        style={{ top: "calc(85%)" }}
      />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{ left: "calc(85%)" }}
      />
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle
        id="bottom-left"
        type="source"
        position={Position.Bottom}
        style={{ left: "calc(15%)" }}
      />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{ top: "calc(85%)" }}
      />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle
        id="left-top"
        type="source"
        position={Position.Left}
        style={{ top: "calc(15%)" }}
      />
    </>
  )
}
