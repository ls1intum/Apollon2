import { TextField } from "@/components/ui"
import { DefaultNodeProps } from "@/types"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { PopoverProps } from "./types"

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

  const handleNameChange = (newName: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === elementId) {
          return {
            ...node,
            data: {
              ...node.data,
              name: newName,
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
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={(event) => handleNameChange(event.target.value)}
          size="small"
          value={nodeData.name}
          placeholder={placeholder}
          fullWidth
        />
        {sideElements}
      </div>
      {children}
    </div>
  )
}
