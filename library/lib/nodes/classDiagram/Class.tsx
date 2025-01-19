import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassType, ExtraElement } from "@/types"
import { ClassPopover, ClassSVG, MinSize } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import { useClassNode, useHandleOnResize } from "@/hooks"
import { useState } from "react"
import { Box } from "@mui/material"

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
  // const { updateNode, getNode } = useReactFlow()
  const {
    svgRef,
    anchorEl,
    handleClick,
    handleClose,
    handleNameChange,
    handleDelete,
  } = useClassNode({ id, selected: Boolean(selected) })

  const { onResize } = useHandleOnResize(parentId)
  if (!width || !height) {
    return null
  }

  // const handleOnResize: OnResize = (_, params) => {
  //   console.log("DEBUG params,", params)

  //   let tractParentId = parentId
  //   let cumulativedParantsOffsets = 0
  //   while (tractParentId) {
  //     const parent = getNode(tractParentId)

  //     if (parent) {
  //       if (
  //         parent.width! <
  //         params.width + params.x + cumulativedParantsOffsets
  //       ) {
  //         updateNode(tractParentId, {
  //           width: params.width + params.x + cumulativedParantsOffsets,
  //         })
  //         cumulativedParantsOffsets += parent.position.x
  //       }
  //     }
  //     tractParentId = parent?.parentId
  //   }
  // }

  return (
    <DefaultNodeWrapper>
      <NodeResizer
        nodeId={id}
        isVisible={selected}
        minWidth={minWidth}
        minHeight={minHeight}
        maxHeight={minHeight}
        onResize={onResize}
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
