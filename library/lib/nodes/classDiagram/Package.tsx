import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { PackageSVG } from "@/components"
import { useHandleOnResize } from "@/hooks"
import { PackageNodeProps } from "@/types"
import Box from "@mui/material/Box"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { useRef } from "react"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { PopoverManager } from "@/components/popovers/PopoverManager"

export default function Package({
  id,
  width,
  height,
  data: { name },
  parentId,
  type,
}: NodeProps<Node<PackageNodeProps>>) {
  const { onResize } = useHandleOnResize(parentId)
  const packageSvgWrapperRef = useRef<HTMLDivElement | null>(null)
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const handleDelete = useHandleDelete(id)

  const { interactiveElementId } = useDiagramStore(
    useShallow((state) => ({
      setNodes: state.setNodes,
      interactiveElementId: state.interactiveElementId,
    }))
  )
  const selected = id === interactiveElementId

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper width={width} height={height} elementId={id}>
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
              setPopOverElementId(id)
            }}
            style={{ cursor: "pointer", width: 16, height: 16 }}
          />
        </Box>
      </NodeToolbar>
      <NodeResizer
        isVisible={Boolean(selected)}
        onResize={onResize}
        minHeight={50}
        minWidth={50}
        handleStyle={{ width: 8, height: 8 }}
      />
      <div ref={packageSvgWrapperRef}>
        <PackageSVG width={width} height={height} name={name} id={id} />
      </div>

      <PopoverManager
        anchorEl={packageSvgWrapperRef.current}
        nodeId={id}
        type={type as "package"}
      />
      {/*       
      <PackagePopover
        nodeId={id}
        anchorEl={showEditPopover ? svgRef.current : null}
        open={showEditPopover}
        onClose={handlePopoverClose}
        onNameChange={handleNameChange}
      /> */}
    </DefaultNodeWrapper>
  )
}
