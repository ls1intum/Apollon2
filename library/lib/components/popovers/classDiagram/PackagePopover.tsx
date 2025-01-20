import { useReactFlow } from "@xyflow/react"
import { GenericPopover } from "../GenericPopover"
import { TextField } from "@mui/material"
import { useViewportCenter } from "@/hooks"
import { getPopoverOrigin, getPositionOnCanvas, getQuadrant } from "@/utils"
import { PackageNodeProps } from "@/types"

interface PackageComponentProps {
  nodeId: string
  anchorEl: SVGSVGElement | null
  open: boolean
  onClose: () => void
  onNameChange: (newName: string) => void
}

export function PackagePopover({
  nodeId,
  anchorEl,
  open,
  onClose,
  onNameChange,
}: PackageComponentProps) {
  const { getNode, getNodes } = useReactFlow()
  const viewportCenter = useViewportCenter()

  if (!anchorEl || !open) {
    return null
  }

  const node = getNode(nodeId)!
  const nodePoistionOnCanvas = getPositionOnCanvas(node, getNodes())
  const nodeData = node.data as PackageNodeProps
  const quadrant = getQuadrant(nodePoistionOnCanvas, viewportCenter)
  const popoverOrigin = getPopoverOrigin(quadrant)

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
          onChange={(event) => onNameChange(event.target.value)}
          size="small"
          value={nodeData.name}
          sx={{ backgroundColor: "#fff" }}
        />
      </GenericPopover>
    </>
  )
}
