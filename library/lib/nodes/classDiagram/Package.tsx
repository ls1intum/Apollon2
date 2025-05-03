import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { PackagePopover, PackageSVG } from "@/components"
import { useHandleOnResize } from "@/hooks"
import { PackageNodeProps } from "@/types"
import Box from "@mui/material/Box"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { useEffect, useRef, useState } from "react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"

export default function Package({
  id,
  width,
  height,
  data: { name },
  parentId,
}: NodeProps<Node<PackageNodeProps>>) {
  const { onResize } = useHandleOnResize(parentId)
  const [showEditPopover, setShowEditPopover] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const { interactiveElementId, setNodes } = useDiagramStore(
    useShallow((state) => ({
      setNodes: state.setNodes,
      interactiveElementId: state.interactiveElementId,
    }))
  )
  const selected = id === interactiveElementId

  useEffect(() => {
    if (!selected) {
      setShowEditPopover(false)
    }
  }, [selected])

  const handlePopoverClose = () => {
    setShowEditPopover(false)
  }

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id))
  }
  const handleNameChange = (newName: string) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              name: newName,
            },
          }
        }
        return node
      })
    )
  }

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
              setShowEditPopover(true)
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
      <PackageSVG
        ref={svgRef}
        width={width}
        height={height}
        name={name}
        id={id}
      />
      <PackagePopover
        nodeId={id}
        anchorEl={showEditPopover ? svgRef.current : null}
        open={showEditPopover}
        onClose={handlePopoverClose}
        onNameChange={handleNameChange}
      />
    </DefaultNodeWrapper>
  )
}
