import {
  DividerLine,
  GenericPopover,
  StereotypeButtonGroup,
} from "@/components"
import { useViewportCenter } from "@/hooks"
import { useDiagramStore } from "@/store"
import { ClassNodeProps } from "@/types"
import { getPositionOnCanvas, getQuadrant, getPopoverOrigin } from "@/utils"
import { TextField } from "@mui/material"
import { useShallow } from "zustand/shallow"
import { EditableAttributeList } from "./EditableAttributesList"
import { EditableMethodsList } from "./EditableMethodsList"

interface PopoverComponentProps {
  nodeId: string
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
}

// Popover for editing class details
export const ClassEditPopover = ({
  nodeId,
  anchorEl,
  open,
  onClose,
}: PopoverComponentProps) => {
  const { nodes, setNodes } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      setNodes: state.setNodes,
    }))
  )
  const viewportCenter = useViewportCenter()

  if (!anchorEl || !open) {
    return null
  }

  const node = nodes.find((node) => node.id === nodeId)
  if (!node) {
    return null
  }
  const nodePositionOnCanvas = getPositionOnCanvas(node, nodes)
  const nodeData = node.data as ClassNodeProps
  const quadrant = getQuadrant(nodePositionOnCanvas, viewportCenter)
  const popoverOrigin = getPopoverOrigin(quadrant)

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

  return (
    <GenericPopover
      id={`class-popover-${nodeId}`}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={popoverOrigin.anchorOrigin}
      transformOrigin={popoverOrigin.transformOrigin}
      maxHeight={700}
    >
      <TextField
        id="outlined-basic"
        variant="outlined"
        onChange={(event) => handleNameChange(event.target.value)}
        size="small"
        value={nodeData.name}
        sx={{ backgroundColor: "#fff" }}
      />
      <DividerLine width="100%" />
      <StereotypeButtonGroup
        nodeId={nodeId}
        selectedStereotype={nodeData.stereotype}
      />
      <DividerLine width="100%" />
      <EditableAttributeList nodeId={nodeId} />
      <DividerLine width="100%" />
      <EditableMethodsList nodeId={nodeId} />
    </GenericPopover>
  )
}
