import { useEffect, useRef, useState } from "react"
import { useReactFlow } from "@xyflow/react"

export function useClassNode({
  id,
  selected,
}: {
  id: string
  selected: boolean
}) {
  const reactFlow = useReactFlow()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null)

  const handleClick = () => {
    if (svgRef.current) {
      setAnchorEl(svgRef.current)
    }
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleNameChange = (newName: string) => {
    reactFlow.updateNodeData(id, { name: newName })
  }
  const handleDelete = () => {
    reactFlow.deleteElements({
      nodes: [{ id }],
    })
  }

  useEffect(() => {
    if (!selected) {
      handlePopoverClose()
    }
  }, [selected])

  useEffect(() => {
    if (!anchorEl) {
      reactFlow.updateNode(id, { selected: false })
    }
  }, [anchorEl, reactFlow, id])

  return {
    svgRef,
    anchorEl,
    handleClick,
    handlePopoverClose,
    handleNameChange,
    handleDelete,
  }
}
