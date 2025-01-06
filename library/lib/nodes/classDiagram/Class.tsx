import {
  NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
  useReactFlow,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassSVG } from "@/svgs"
import { ClassType, ExtraElements } from "@/types"
import { ClassPopover } from "@/components"
import EditIcon from "@mui/icons-material/Edit"
import { useClassNode } from "@/hooks" // Assuming you save the hook here
import { useEffect } from "react"

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
  const reactFlow = useReactFlow()
  const { svgRef, anchorEl, handleClick, handleClose, handleNameChange } =
    useClassNode({ id, selected: Boolean(selected) })

  if (!width || !height) {
    return null
  }

  const svgWidth = svgRef.current?.getAttribute("width")
    ? Number(svgRef.current?.getAttribute("width"))
    : 0
  const svgHeight = svgRef.current?.getAttribute("height")
    ? Number(svgRef.current?.getAttribute("height"))
    : 0

  console.log("DEBUG svgWidth", svgWidth)
  console.log("DEBUG svgHeight", svgHeight)

  useEffect(() => {
    if (svgWidth && svgHeight) {
      if (width < svgWidth) {
        reactFlow.updateNode(id, { width: svgWidth })
      }
      if (height < svgHeight) {
        reactFlow.updateNode(id, { height: svgHeight })
      }
      if (width > svgWidth) {
        reactFlow.updateNode(id, { width: svgWidth })
      }
      if (height > svgHeight) {
        reactFlow.updateNode(id, { height: height })
      }
    }
  }, [svgHeight, svgWidth])
  return (
    <DefaultNodeWrapper>
      <NodeResizer isVisible={selected} minHeight={svgHeight} />
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
