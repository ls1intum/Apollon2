import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ObjectNameSVG } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import { useEffect, useMemo, useRef } from "react"
import { Box } from "@mui/material"
import { ObjectNodeProps } from "@/types"
import { useDiagramStore, usePopoverStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import {
  measureTextWidth,
  calculateMinWidth,
  calculateMinHeight,
} from "@/utils"
import {
  DEFAULT_ATTRIBUTE_HEIGHT,
  DEFAULT_METHOD_HEIGHT,
  DEFAULT_PADDING,
  DEFAULT_FONT,
  DEFAULT_HEADER_HEIGHT,
} from "@/constants"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"

export function ObjectName({
  id,
  width,
  height,
  data: { methods, attributes, name },
}: NodeProps<Node<ObjectNodeProps>>) {
  const { setNodes } = useDiagramStore(
    useShallow((state) => ({
      setNodes: state.setNodes,
    }))
  )
  const setPopOverElementId = usePopoverStore(
    useShallow((state) => state.setPopOverElementId)
  )
  const selected = useIsOnlyThisElementSelected(id)
  const isDiagramModifiable = useDiagramModifiable()

  const objectSvgWrapperRef = useRef<HTMLDivElement | null>(null)
  const handleDelete = useHandleDelete(id)

  // Object diagrams don't have stereotypes, so header height is consistent
  const headerHeight = DEFAULT_HEADER_HEIGHT
  const attributeHeight = DEFAULT_ATTRIBUTE_HEIGHT
  const methodHeight = DEFAULT_METHOD_HEIGHT
  const padding = DEFAULT_PADDING
  const font = DEFAULT_FONT

  // Calculate the widest text accurately
  const maxTextWidth = useMemo(() => {
    const headerTextWidth = measureTextWidth(name, font)
    const attributesTextWidths = attributes.map((attr: { name: string }) =>
      measureTextWidth(attr.name, font)
    )
    const methodsTextWidths = methods.map((method: { name: string }) =>
      measureTextWidth(method.name, font)
    )
    const allTextWidths = [
      headerTextWidth,
      ...attributesTextWidths,
      ...methodsTextWidths,
    ]

    const result = Math.max(...allTextWidths, 0)
    return result
  }, [name, attributes, methods, font])

  const minWidth = useMemo(() => {
    const result = calculateMinWidth(maxTextWidth, padding)
    return result
  }, [maxTextWidth, padding])

  // Calculate minimum dimensions
  const minHeight = useMemo(
    () =>
      calculateMinHeight(
        headerHeight,
        attributes.length,
        methods.length,
        attributeHeight,
        methodHeight
      ),
    [
      headerHeight,
      attributes.length,
      methods.length,
      attributeHeight,
      methodHeight,
    ]
  )

  useEffect(() => {
    if (height && height <= minHeight) {
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

  useEffect(() => {
    if (width && width <= minWidth) {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              width: Math.max(width ?? 0, minWidth),
              measured: {
                width: Math.max(width ?? 0, minWidth),
              },
            }
          }
          return node
        })
      )
    }
  }, [id, setNodes, minWidth])

  const finalWidth = Math.max(width ?? 0, minWidth)

  return (
    <DefaultNodeWrapper
      width={width}
      height={height}
      elementId={id}
      className="horizontally-not-resizable"
    >
      <NodeResizer
        nodeId={id}
        isVisible={isDiagramModifiable && !!selected}
        minWidth={minWidth}
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

      <div ref={objectSvgWrapperRef}>
        <ObjectNameSVG
          width={finalWidth}
          height={minHeight}
          attributes={attributes}
          methods={methods}
          name={name}
          id={id}
          showAssessmentResults={!isDiagramModifiable}
        />
      </div>
      <PopoverManager
        anchorEl={objectSvgWrapperRef.current}
        elementId={id}
        type={"objectName" as const}
      />
    </DefaultNodeWrapper>
  )
}
