import { useEffect, useRef, useState } from "react"
import { useReactFlow } from "@xyflow/react"

export function useEdgePopOver({
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

  const handleEdgeTypeChange = (newType: string) => {
    reactFlow.updateEdge(id, { type: newType })
  }

  const handleSwap = () => {
    const edge = reactFlow.getEdge(id)
    reactFlow.updateEdge(id, {
      source: edge?.target,
      sourceHandle: edge?.targetHandle,
      target: edge?.source,
      targetHandle: edge?.sourceHandle,
    })
  }

  const handleNameChange = (newName: string) => {
    reactFlow.updateNodeData(id, { name: newName })
  }

  const handleTargetRoleChange = (newRole: string) => {
    reactFlow.updateEdgeData(id, { targetRole: newRole })
  }

  const handleTargetMultiplicityChange = (newMultiplicity: string) => {
    reactFlow.updateEdgeData(id, { targetMultiplicity: newMultiplicity })
  }

  const handleSourceRoleChange = (newRole: string) => {
    reactFlow.updateEdgeData(id, { sourceRole: newRole })
  }

  const handleSourceMultiplicityChange = (newMultiplicity: string) => {
    reactFlow.updateEdgeData(id, { sourceMultiplicity: newMultiplicity })
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
    handleTargetRoleChange,
    handleTargetMultiplicityChange,
    handleSourceRoleChange,
    handleSourceMultiplicityChange,
    handleEdgeTypeChange,
    handleSwap,
  }
}

export function useToolbar({ id }: { id: string }) {
  const reactFlow = useReactFlow()
  const svgRef = useRef<SVGSVGElement | null>(null)

  const handleDelete = () => {
    reactFlow.deleteElements({
      edges: [{ id }],
    })
  }
  return {
    svgRef,
    handleDelete,
  }
}
