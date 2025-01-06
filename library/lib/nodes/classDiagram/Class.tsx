import {
  NodeProps,
  NodeToolbar,
  Position,
  useReactFlow,
  type Node,
} from "@xyflow/react"
import { DefaultNodeWrapper } from "@/nodes/wrappers"
import { ClassSVG } from "@/svgs"
import { ClassType, ExtraElements } from "@/types"
import { useEffect, useRef, useState } from "react"
import { ClassPopover } from "@/components"
import EditIcon from "@mui/icons-material/Edit"

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
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null)

  const handleClick = () => {
    if (svgRef.current) {
      setAnchorEl(svgRef.current)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleNameChange = (newName: string) => {
    reactFlow.updateNodeData(id, { name: newName })
  }

  useEffect(() => {
    if (!selected) {
      handleClose()
    }
  }, [selected])

  useEffect(() => {
    if (!anchorEl) {
      reactFlow.updateNode(id, { selected: false })
    }
  }, [anchorEl])

  if (!width || !height) {
    return null
  }

  return (
    <DefaultNodeWrapper>
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

      <div style={{ display: "inline-block", cursor: "pointer" }}>
        <ClassSVG
          ref={svgRef}
          width={width}
          height={height}
          attributes={attributes}
          methods={methods}
          stereotype={stereotype}
          name={name}
        />
      </div>
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
