import { useEffect, useState } from "react"
import { useReactFlow } from "@xyflow/react"

export function useEdgePopOver({
  id,
  selected,
}: {
  id: string
  selected: boolean
}) {
  const reactFlow = useReactFlow()

  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null)

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
    handleSourceRoleChange,
    handleSourceMultiplicityChange,
    handleTargetRoleChange,
    handleTargetMultiplicityChange,
    handleEdgeTypeChange,
    handleSwap,
  }
}
