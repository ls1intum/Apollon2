import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassSVG } from "@/svgs"
import { ClassType, ExtraElements } from "@/types"
import { ClassPopover } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import { useClassNode } from "@/hooks" // Assuming you save the hook here
import { useState } from "react"

export type ClassNodeProps = Node<{
  methods: ExtraElements[]
  attributes: ExtraElements[]
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

  // useEffect(() => {
  //   if (svgWidth && svgHeight) {
  //     if (width < svgWidth) {
  //       reactFlow.updateNode(id, { width: svgWidth })
  //     }
  //     if (height < svgHeight) {
  //       reactFlow.updateNode(id, { height: svgHeight })
  //     }
  //     if (width > svgWidth) {
  //       reactFlow.updateNode(id, { width })
  //     }
  //     if (height > svgHeight) {
  //       reactFlow.updateNode(id, { height })
  //     }
  //   }
  // }, [svgHeight, svgWidth])
  return (
    <DefaultNodeWrapper>
      <NodeResizer
        isVisible={selected}
        minHeight={minHeight}
        minWidth={minWidth}
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
