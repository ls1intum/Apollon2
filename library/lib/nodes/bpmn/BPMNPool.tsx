import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
  OnResize,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import { useHandleOnResize } from "@/hooks"
import Box from "@mui/material/Box"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { useRef, useCallback } from "react"
import { usePopoverStore, useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { BPMNPoolProps } from "@/types"
import { BPMNPoolNodeSVG } from "@/components"

interface Swimlane {
  id: string
  name: string
}

export function BPMNPool({
  id,
  width,
  height,
  data,
  parentId,
}: NodeProps<Node<BPMNPoolProps & { swimlanes?: Swimlane[] }>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)
  const { onResize } = useHandleOnResize(parentId)
  const isDiagramModifiable = useDiagramModifiable()
  const selected = useIsOnlyThisElementSelected(id)
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const handleDelete = useHandleDelete(id)

  const { setNodes } = useDiagramStore(
    useShallow((state) => ({
      setNodes: state.setNodes,
    }))
  )

  // Get swimlanes from node data (internal state)
  const swimlanes = data.swimlanes || []

  // Custom resize handler
  const handlePoolResize: OnResize = useCallback(
    (event, params) => {
      // Call original resize handler
      onResize(event, params)

      // Update pool dimensions in node data
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              style: {
                ...node.style,
                width: params.width,
                height: params.height,
              },
              measured: {
                ...node.measured,
                width: params.width,
                height: params.height,
              },
            }
          }
          return node
        })
      )
    },
    [onResize, setNodes, id]
  )

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper width={width} height={height} elementId={id}>
      <NodeToolbar
        isVisible={isDiagramModifiable && !!selected}
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
        isVisible={isDiagramModifiable && !!selected}
        onResize={handlePoolResize}
        minHeight={120}
        minWidth={200}
        handleStyle={{ width: 8, height: 8 }}
      />
      <div ref={svgWrapperRef}>
        <BPMNPoolNodeSVG
          width={width}
          height={height}
          id={id}
          name={data.name}
          swimlanes={swimlanes}
        />
      </div>
      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="BPMNPool"
      />
    </DefaultNodeWrapper>
  )
}
