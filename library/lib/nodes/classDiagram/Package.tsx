import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { PackagePopover, PackageSVG } from "@/components"
import { useClassNode, useHandleOnResize } from "@/hooks"
import { PackageNodeProps } from "@/types"
import Box from "@mui/material/Box"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined"

export default function Package({
  id,
  width,
  height,
  selected,
  data: { name },
  parentId,
}: NodeProps<Node<PackageNodeProps>>) {
  const { onResize } = useHandleOnResize(parentId)
  const { updateNode, getInternalNode } = useReactFlow()
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

  const handleUnlink = () => {
    const nodeInternal = getInternalNode(id)
    updateNode(id, {
      parentId: undefined,
      position: {
        x: nodeInternal!.internals.positionAbsolute.x,
        y: nodeInternal!.internals.positionAbsolute.y,
      },
    })
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
          {parentId && (
            <LinkOffOutlinedIcon
              onClick={handleUnlink}
              style={{ cursor: "pointer", width: 16, height: 16 }}
            />
          )}
        </Box>
      </NodeToolbar>
      <NodeResizer
        isVisible={Boolean(selected)}
        onResize={onResize}
        // shouldResize={(event) => {
        //   const allNodes = getNodes()
        //   const allChildren = allNodes.filter((node) => node.parentId === id)

        //   if (allChildren.length === 0) return true

        //   const boundedBox = getNodesBounds(allChildren)
        //   const nodeLocation = getPositionOnCanvas(getNode(id)!, allNodes)

        //   const paddingLeft = boundedBox.x - nodeLocation.x
        //   const paddingTop = boundedBox.y - nodeLocation.y
        //   const paddingRight =
        //     nodeLocation.x + width - boundedBox.x - boundedBox.width
        //   const paddingBottom =
        //     nodeLocation.y + height - boundedBox.y - boundedBox.height

        //   const dx = event.dx
        //   const dy = event.dy

        //   let returnValue = true
        //   if (dx > 0 && paddingLeft < minPadding) returnValue = false
        //   if (dy > 0 && paddingTop < minPadding) returnValue = false
        //   if (dx < 0 && paddingRight < minPadding) returnValue = false
        //   if (dy < 0 && paddingBottom < minPadding) returnValue = false

        //   console.log("returnValue", returnValue)
        //   return returnValue
        // }}
      />
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
