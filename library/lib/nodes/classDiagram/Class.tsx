import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassPopover, ClassSVG, MinSize } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"

import { useClassNode } from "@/hooks"
import { useRef, useState } from "react"
import { Box } from "@mui/material"
import { ClassNodeProps } from "@/types"

export function Class({
  id,
  width,
  height,
  selected,
  data: { methods, attributes, stereotype, name },
}: NodeProps<Node<ClassNodeProps>>) {
  const [{ minHeight, minWidth }, setMinSize] = useState<MinSize>({
    minWidth: 0,
    minHeight: 0,
  })
  const [showEditPopover, setShowEditPopover] = useState(false)

  const svgRef = useRef<SVGSVGElement | null>(null)

  const handlePopoverClose = () => {
    setShowEditPopover(false)
  }
  const { handleNameChange, handleDelete } = useClassNode({
    id,
    selected: Boolean(selected),
  })

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper width={width} height={height}>
      <NodeResizer
        nodeId={id}
        isVisible={selected}
        minWidth={minWidth}
        minHeight={minHeight}
        maxHeight={minHeight}
        handleStyle={{ width: 8, height: 8 }}
      />
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        align="end"
        offset={10}
      >
        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <DeleteOutlineOutlinedIcon
            onClick={handleDelete}
            style={{ cursor: "pointer", width: 16, height: 16 }}
          />

          <EditIcon
            onClick={() => {
              setShowEditPopover(true)
            }}
            style={{ cursor: "pointer", width: 16, height: 16 }}
          />
        </Box>
      </NodeToolbar>
      <ClassSVG
        ref={svgRef}
        width={width}
        height={height}
        attributes={attributes}
        methods={methods}
        stereotype={stereotype}
        name={name}
        setMinSize={setMinSize}
        id={id}
      />
      <ClassPopover
        nodeId={id}
        anchorEl={svgRef.current}
        open={Boolean(showEditPopover)}
        onClose={handlePopoverClose}
        onNameChange={handleNameChange}
      />
    </DefaultNodeWrapper>
  )
}
