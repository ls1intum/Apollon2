import { ClassNodeProps } from "@/nodes/classDiagram"
import { ClassType } from "@/types"
import { useReactFlow } from "@xyflow/react"
import { GenericPopover } from "./GenericPopover"
import { DividerLine } from "../DividerLine"
import { EditableList } from "../EditableList"
import { StereotypeButtonGroup } from "../StereotypeButtonGroup"
import { TextField } from "@mui/material"
import { useViewportCenter } from "@/hooks"
import { getPopoverOrigin, getQuadrant } from "@/utils"

interface PopoverComponentProps {
  nodeId: string
  anchorEl: SVGSVGElement | null
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
  const { getNode, updateNodeData } = useReactFlow()
  const viewportCenter = useViewportCenter()

  if (!anchorEl || !open) {
    return null
  }

  const node = getNode(nodeId)!
  const nodeData = node.data as ClassNodeProps["data"]
  const quadrant = getQuadrant(node.position, viewportCenter)
  const popoverOrigin = getPopoverOrigin(quadrant)
  const classStereotype = nodeData.stereotype

  const handleStereotypeChange = (stereotype: ClassType | undefined) => {
    updateNodeData(nodeId, { stereotype })
  }

  const handleAttributesChange = (
    newAttributes: { id: string; name: string }[]
  ) => {
    updateNodeData(nodeId, { attributes: newAttributes })
  }

  const handleMethodsChange = (newMethods: { id: string; name: string }[]) => {
    updateNodeData(nodeId, { methods: newMethods })
  }

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
        {/* Stereotype Selection */}
        <StereotypeButtonGroup
          selected={classStereotype}
          onChange={handleStereotypeChange}
        />
        <DividerLine width="100%" />
        {/* Attributes Section */}
        <EditableList
          title="Attributes"
          items={nodeData.attributes}
          onItemsChange={handleAttributesChange}
          placeholder="+ Add attribute"
        />
        <DividerLine width="100%" />
        {/* Methods Section */}
        <EditableList
          title="Methods"
          items={nodeData.methods}
          onItemsChange={handleMethodsChange}
          placeholder="+ Add method"
        />
      </GenericPopover>
    </>
  )
}
