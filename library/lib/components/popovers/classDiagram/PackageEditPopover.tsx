import { GenericPopover } from "../GenericPopover"
import { TextField } from "@mui/material"
import { PackageNodeProps } from "@/types"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { PopoverProps } from "../types"

export const PackageEditPopover: React.FC<PopoverProps> = ({
  nodeId,
  anchorEl,
  open,
  onClose,
  popoverOrigin,
}) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      setNodes: state.setNodes,
    }))
  )
  if (!anchorEl || !open) {
    return null
  }

  const handleNameChange = (newName: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === nodeId) {
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

  const node = nodes.find((node) => node.id === nodeId)
  if (!node) {
    return null
  }

  const nodeData = node.data as PackageNodeProps

  return (
    <>
      <GenericPopover
        id={`package-popover-${nodeId}`}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={popoverOrigin.anchorOrigin}
        transformOrigin={popoverOrigin.transformOrigin}
      >
        <TextField
          id="outlined-basic"
          variant="outlined"
          onChange={(event) => handleNameChange(event.target.value)}
          size="small"
          value={nodeData.name}
          sx={{ backgroundColor: "#fff" }}
        />
      </GenericPopover>
    </>
  )
}
