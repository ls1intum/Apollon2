import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassType, ExtraElement } from "@/types"
import { ClassPopover, ClassSVG } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import { useClassNode } from "@/hooks"
import { useState } from "react"

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
  data: { methods, attributes, stereotype, name },
}: NodeProps<ClassNodeProps>) {
  const [{ minWidth, minHeight }, setMinSize] = useState({
    minWidth: 0,
    minHeight: 0,
  })

  const { svgRef, anchorEl, handleClick, handleClose, handleNameChange } =
    useClassNode({ id, selected: Boolean(selected) })

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
      <NodeResizer
        nodeId={id}
        isVisible={selected}
        minWidth={minWidth}
        minHeight={minHeight}
        maxHeight={minHeight}
      />
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        align="end"
        offset={10}
      >
        <EditIcon
          onClick={handleClick}
          style={{ cursor: "pointer", width: 16, height: 16 }}
        />
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
        id={id}
        anchorEl={anchorEl}
        open={Boolean(selected)}
        onClose={handleClose}
        onNameChange={handleNameChange}
      />
    </DefaultNodeWrapper>
  )
}
