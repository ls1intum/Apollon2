import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassSVG } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined"
import { useEffect, useMemo, useRef } from "react"
import { Box } from "@mui/material"
import { ClassNodeProps, ClassType } from "@/types"
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
  DEFAULT_HEADER_HEIGHT_WITH_STREOTYPE,
} from "@/constants"
import { useHandleDelete } from "@/hooks/useHandleDelete"
import { PopoverManager } from "@/components/popovers/PopoverManager"
import { useDiagramModifiable } from "@/hooks/useDiagramModifiable"
import { useIsOnlyThisElementSelected } from "@/hooks/useIsOnlyThisElementSelected"

export function Class({
  id,
  width,
  height,
  data: { methods, attributes, stereotype, name },
}: NodeProps<Node<ClassNodeProps>>) {
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

  const classSvgWrapperRef = useRef<HTMLDivElement | null>(null)
  const handleDelete = useHandleDelete(id)

  const showStereotype = stereotype
    ? stereotype !== ClassType.ObjectClass
    : false
  const headerHeight = showStereotype
    ? DEFAULT_HEADER_HEIGHT_WITH_STREOTYPE
    : DEFAULT_HEADER_HEIGHT

  const attributeHeight = DEFAULT_ATTRIBUTE_HEIGHT
  const methodHeight = DEFAULT_METHOD_HEIGHT
  const padding = DEFAULT_PADDING
  const font = DEFAULT_FONT

  // Calculate the widest text accurately
  const maxTextWidth = useMemo(() => {
    const headerTextWidths = [
      stereotype ? measureTextWidth(`«${stereotype}»`, font) : 0,
      measureTextWidth(name, font),
    ]
    const attributesTextWidths = attributes.map((attr) =>
      measureTextWidth(attr.name, font)
    )
    const methodsTextWidths = methods.map((method) =>
      measureTextWidth(method.name, font)
    )
    const allTextWidths = [
      ...headerTextWidths,
      ...attributesTextWidths,
      ...methodsTextWidths,
    ]

    const result = Math.max(...allTextWidths, 0)
    return result
  }, [stereotype, name, attributes, methods, font])

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
      selected={!!selected}
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

      <div ref={classSvgWrapperRef}>
        <ClassSVG
          width={finalWidth}
          height={minHeight}
          attributes={attributes}
          methods={methods}
          stereotype={stereotype}
          name={name}
          id={id}
          showAssessmentResults={!isDiagramModifiable}
        />
      </div>
      <PopoverManager
        anchorEl={classSvgWrapperRef.current}
        elementId={id}
        type={"class" as const}
      />
    </DefaultNodeWrapper>
  )
}
