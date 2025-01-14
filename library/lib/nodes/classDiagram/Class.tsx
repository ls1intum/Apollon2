import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassType, ExtraElement } from "@/types"
import { ClassPopover, ClassSVG, MinSize } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import { useClassNode } from "@/hooks"
import { useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import { getPositionOnCanvas } from "@/utils"

export type ClassNodeProps = Node<{
  methods: ExtraElement[]
  attributes: ExtraElement[]
  stereotype?: ClassType
  name: string
}>

export function Class({
  id,
  width,
  height,
  selected,
  parentId,
  data: { methods, attributes, stereotype, name },
}: NodeProps<ClassNodeProps>) {
  const [{ minHeight, minWidth }, setMinSize] = useState<MinSize>({
    minWidth: 0,
    minHeight: 0,
  })
  const { updateNode, getNode, getNodes } = useReactFlow()
  const {
    svgRef,
    anchorEl,
    handleClick,
    handleClose,
    handleNameChange,
    handleDelete,
  } = useClassNode({ id, selected: Boolean(selected) })

  if (!width || !height) {
    return null
  }

  const handleExtract = () => {
    const nodeself = getNode(id)!
    const allNodes = getNodes()

    const nodePositionOnCanvas = getPositionOnCanvas(nodeself, allNodes)

    updateNode(id, {
      position: {
        x: nodePositionOnCanvas.x,
        y: nodePositionOnCanvas.y,
      },
      parentId: undefined,
    })
  }

  return (
    <DefaultNodeWrapper>
      <NodeResizer
        nodeId={id}
        isVisible={selected}
        minWidth={minWidth}
        minHeight={minHeight}
        maxHeight={minHeight}
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
            onClick={handleClick}
            style={{ cursor: "pointer", width: 16, height: 16 }}
          />

          {parentId && (
            <Button onClick={handleExtract}>
              <Typography variant="caption">Extract</Typography>
            </Button>
          )}
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
        anchorEl={anchorEl}
        open={Boolean(selected)}
        onClose={handleClose}
        onNameChange={handleNameChange}
      />
    </DefaultNodeWrapper>
  )
}
