import { DefaultNodeProps } from "@/types"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { PopoverProps } from "./types"
import { StyleEditor } from "../ui/StyleEditor"

export const DefaultNodeEditPopover: React.FC<PopoverProps> = ({
  elementId,
  children,
  sideElements = [],
  placeholder,
}) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      setNodes: state.setNodes,
    }))
  )

  const handleDataFieldUpdate = (key: string, value: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          }
        }
        return node
      })
    )
  }

  const node = nodes.find((node) => node.id === elementId)
  if (!node) {
    return null
  }

  const nodeData = node.data as DefaultNodeProps

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyleEditor
        nodeData={nodeData}
        handleDataFieldUpdate={handleDataFieldUpdate}
        sideElements={sideElements}
        inputPlaceholder={placeholder}
      />

      {children}
    </div>
  )
}
