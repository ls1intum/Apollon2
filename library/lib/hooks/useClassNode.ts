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
  }, [anchorEl, reactFlow, id])

  return {
    svgRef,
    anchorEl,
    handleClick,
    handleClose,
    handleNameChange,
  }
}
