import { Handle, Position } from "@xyflow/react"

interface Props {
  children: React.ReactNode
}

export function DefaultNodeWrapper({ children }: Props) {
  return (
    <>
      <Handle
        id="top-left"
        type="source"
        position={Position.Top}
        style={{ border: "0px", left: "calc(15%)", top: "2px" }}
      />
      <Handle
        id="top"
        type="source"
        position={Position.Top}
        style={{ border: "0px", top: "2px" }}
      />
      <Handle
        id="top-right"
        type="source"
        position={Position.Top}
        style={{ border: "0px", left: "calc(85%)", top: "2px" }}
      />

      <Handle
        id="right-top"
        type="source"
        position={Position.Right}
        style={{ border: "0px", top: "calc(15%)", right: "2px" }}
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        style={{ border: "0px", right: "2px" }}
      />
      <Handle
        id="right-bottom"
        type="source"
        position={Position.Right}
        style={{ border: "0px", top: "calc(85%)", right: "2px" }}
      />
      <Handle
        id="bottom-right"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px", left: "calc(85%)", bottom: "2px" }}
      />
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px", bottom: "2px" }}
      />
      <Handle
        id="bottom-left"
        type="source"
        position={Position.Bottom}
        style={{ border: "0px", left: "calc(15%)", bottom: "2px" }}
      />
      <Handle
        id="left-bottom"
        type="source"
        position={Position.Left}
        style={{ border: "0px", top: "calc(85%)", left: "2px" }}
      />
      <Handle
        id="left"
        type="source"
        position={Position.Left}
        style={{ border: "0px", left: "2px" }}
      />
      <Handle
        id="left-top"
        type="source"
        position={Position.Left}
        style={{ border: "0px", top: "calc(15%)", left: "2px" }}
      />
      {children}
    </>
  )
}
