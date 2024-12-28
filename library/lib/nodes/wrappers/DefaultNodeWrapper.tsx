import { Handle, Position } from "@xyflow/react"

interface Props {
  children: React.ReactNode
}

export function DefaultNodeWrapper({ children }: Props) {
  return (
    <>
      {children}
      <Handle id="top" type="source" position={Position.Top} />
      <Handle id="right" type="source" position={Position.Right} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="left" type="source" position={Position.Left} />
    </>
  )
}
