import { TextField } from "@mui/material"
import { PackageNodeProps } from "@/types"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { PopoverProps } from "../types"

export const PackageEditPopover: React.FC<PopoverProps> = ({ elementId }) => {
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

  const nodeData = node.data as PackageNodeProps

  return (
    <TextField
      id="outlined-basic"
      variant="outlined"
      onChange={(event) => handleNameChange(event.target.value)}
      size="small"
      value={nodeData.name}
      sx={{ backgroundColor: "#fff" }}
    />
  )
}
