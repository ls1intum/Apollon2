import { useReactFlow } from "@xyflow/react"
import { GenericPopover } from "../GenericPopover"
import { TextField } from "@mui/material"
import { useViewportCenter } from "@/hooks"
import { getPopoverOrigin, getQuadrant } from "@/utils"
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
  const { getNode } = useReactFlow()
  const viewportCenter = useViewportCenter()

  if (!anchorEl || !open) {
    return null
  }

  const node = getNode(nodeId)!
  const nodeData = node.data as PackageNodeProps
  const quadrant = getQuadrant(node.position, viewportCenter)
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
