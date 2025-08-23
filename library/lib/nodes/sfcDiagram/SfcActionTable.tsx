import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "../wrappers"
import Box from "@mui/material/Box"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"
import { useRef, useMemo, useEffect } from "react"
import { usePopoverStore, useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"
import { SfcActionTableProps } from "@/types"
import { SfcActionTableNodeSVG } from "@/components"
import { DEFAULT_ATTRIBUTE_HEIGHT } from "@/constants"

export function SfcActionTable({
  id,
  width,
  height,
  data,
}: NodeProps<Node<SfcActionTableProps>>) {
  const svgWrapperRef = useRef<HTMLDivElement | null>(null)
  const isDiagramModifiable = useDiagramModifiable()
  const selected = useIsOnlyThisElementSelected(id)
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const { setNodes } = useDiagramStore(
    useShallow((state) => ({
      setNodes: state.setNodes,
    }))
  )
  const handleDelete = useHandleDelete(id)

  if (!width || !height) {
    return null
  }

  const actionRows = data?.actionRows || []

  // Calculate minimum height based on rows (no header needed)
  const minHeight = useMemo(() => {
    const rowsHeight = actionRows.length * DEFAULT_ATTRIBUTE_HEIGHT
    // Ensure minimum height for at least one row
    return Math.max(rowsHeight, DEFAULT_ATTRIBUTE_HEIGHT)
  }, [actionRows.length])

  // Auto-expand height when content changes (like class diagram)
  useEffect(() => {
    if (height && height < minHeight) {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              height: minHeight,
              measured: {
                ...node.measured,
                height: minHeight,
              },
            }
          }
          return node
        })
      )
    }
  }, [minHeight, height, id, setNodes])

  return (
    <DefaultNodeWrapper width={width} height={height} elementId={id}>
      <NodeResizer
        nodeId={id}
        isVisible={isDiagramModifiable && !!selected}
        minWidth={120}
        minHeight={minHeight}
        maxHeight={minHeight}
        handleStyle={{ width: 8, height: 8 }}
      />
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
            onClick={(e) => {
              e.stopPropagation()
              setPopOverElementId(id)
            }}
            style={{ cursor: "pointer", width: 16, height: 16 }}
          />
        </Box>
      </NodeToolbar>

      <div ref={svgWrapperRef}>
        <SfcActionTableNodeSVG
          width={width}
          height={minHeight}
          id={id}
          actionRows={actionRows}
        />
      </div>

      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="SfcActionTable"
      />
    </DefaultNodeWrapper>
  )
}
