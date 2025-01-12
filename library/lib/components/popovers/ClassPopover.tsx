import { ClassNodeProps } from "@/nodes/classDiagram"
import { ClassType } from "@/types"
import { useReactFlow } from "@xyflow/react"

import { GenericPopover } from "./GenericPopover"
import { DividerLine } from "../DividerLine"
import { EditableList } from "../EditableList"
import { StereotypeButtonGroup } from "../StereotypeButtonGroup"
import { TextField } from "@mui/material"

interface PopoverComponentProps {
  id: string
  anchorEl: SVGSVGElement | null
  open: boolean
  onClose: () => void
  onNameChange: (newName: string) => void
}

export function ClassPopover({
  id,
  anchorEl,
  open,
  onClose,
  onNameChange,
}: PopoverComponentProps) {
  const reactFlow = useReactFlow()

  if (!anchorEl || !open) {
    return null
  }

  const nodeData = reactFlow.getNode(id)?.data as ClassNodeProps["data"]

  const popoverId = open ? "class-popover" : undefined

  if (nodeData === undefined || popoverId === undefined) {
    return null
  }

  const classStereotype = nodeData.stereotype

  const handleStereotypeChange = (stereotype: ClassType | undefined) => {
    reactFlow.updateNodeData(id, { stereotype })
  }

  const handleAttributesChange = (
    newAttributes: { id: string; name: string }[]
  ) => {
    reactFlow.updateNodeData(id, { attributes: newAttributes })
  }

  const handleMethodsChange = (newMethods: { id: string; name: string }[]) => {
    reactFlow.updateNodeData(id, { methods: newMethods })
  }

  return (
    <GenericPopover
      id={popoverId}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
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
  )
}
