import { NodeProps, NodeToolbar, Position, type Node } from "@xyflow/react"
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
import { DefaultNodeProps } from "@/types"
import { SfcJumpNodeSVG } from "@/components"
import { measureTextWidth, calculateMinWidth } from "@/utils"
import { DEFAULT_PADDING, DEFAULT_FONT } from "@/constants"

export function SfcJump({
  id,
  width,
  height,
  data: { name },
}: NodeProps<Node<DefaultNodeProps>>) {
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

  // Calculate minimum width based on text
  const minWidth = useMemo(() => {
    const textWidth = measureTextWidth(name || "", DEFAULT_FONT) + 8
    return calculateMinWidth(textWidth, DEFAULT_PADDING)
  }, [name])

  // Auto-expand/shrink width when text changes
  useEffect(() => {
    if (width && width !== minWidth) {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              width: minWidth,
              measured: {
                ...node.measured,
                width: minWidth,
              },
            }
          }
          return node
        })
      )
    }
  }, [minWidth, width, id, setNodes])

  const finalWidth = Math.max(width ?? 0, minWidth)

  return (
    <DefaultNodeWrapper width={finalWidth} height={height} elementId={id}>
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
      <div ref={svgWrapperRef}>
        <SfcJumpNodeSVG
          width={finalWidth}
          height={height}
          name={name}
          id={id}
        />
      </div>

      <PopoverManager
        anchorEl={svgWrapperRef.current}
        elementId={id}
        type="default"
      />
    </DefaultNodeWrapper>
  )
}
