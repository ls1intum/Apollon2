import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { PackagePopover, PackageSVG } from "@/components"
import { useClassNode, useHandleOnResize } from "@/hooks"
import { PackageNodeProps } from "@/types"
import Box from "@mui/material/Box"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"

export default function Package({
  id,
  width,
  height,
  selected,
  data: { name },
  parentId,
}: NodeProps<Node<PackageNodeProps>>) {
  const { onResize } = useHandleOnResize(parentId)
  const {
    svgRef,
    anchorEl,
    handlePopoverClose,
    handleNameChange,
    handleClick,
    handleDelete,
  } = useClassNode({ id, selected: Boolean(selected) })

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
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
      <NodeResizer isVisible={Boolean(selected)} onResize={onResize} />
      <PackageSVG
        ref={svgRef}
        width={width}
        height={height}
        name={name}
        id={id}
      />
      <PackagePopover
        nodeId={id}
        anchorEl={anchorEl}
        open={Boolean(selected)}
        onClose={handlePopoverClose}
        onNameChange={handleNameChange}
      />
    </DefaultNodeWrapper>
  )
}

// export default memo(Package, (prev, next) => {
//   return (
//     prev.data.name === next.data.name &&
//     prev.width === next.width &&
//     prev.height === next.height &&
//     prev.selected === next.selected
//   )
// })
