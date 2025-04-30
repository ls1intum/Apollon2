import { ClassNodeProps } from "@/types"
import { GenericPopover } from "../GenericPopover"
import { DividerLine } from "../../DividerLine"
import { StereotypeButtonGroup } from "../../StereotypeButtonGroup"
import { TextField } from "@mui/material"
import { useViewportCenter } from "@/hooks"
import { getPopoverOrigin, getPositionOnCanvas, getQuadrant } from "@/utils"
import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { EditableAttributeList } from "./EditableAttributesList"
import { EditableMethodsList } from "./EditableMethodsList"

interface PopoverComponentProps {
  nodeId: string
  anchorEl?: HTMLElement | null
  open: boolean
  onClose: () => void
  onNameChange: (newName: string) => void
}

export function ClassPopover({
  nodeId,
  anchorEl,
  open,
  onClose,
  onNameChange,
}: PopoverComponentProps) {
  const { nodes } = useDiagramStore(
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
  const nodePoistionOnCanvas = getPositionOnCanvas(node, nodes)
  const nodeData = node.data as ClassNodeProps
  const quadrant = getQuadrant(nodePoistionOnCanvas, viewportCenter)
  const popoverOrigin = getPopoverOrigin(quadrant)

  return (
    <>
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
          onChange={(event) => onNameChange(event.target.value)}
          size="small"
          value={nodeData.name}
          sx={{ backgroundColor: "#fff" }}
        />
        <DividerLine width="100%" />

        <StereotypeButtonGroup nodeId={nodeId} />
        <DividerLine width="100%" />

        <EditableAttributeList nodeId={nodeId} />
        <DividerLine width="100%" />
        <EditableMethodsList nodeId={nodeId} />
      </GenericPopover>
    </>
  )
}
