import { useReactFlow } from "@xyflow/react"

export function useEdgePopOver(id: string) {
  const reactFlow = useReactFlow()

  const handleEdgeTypeChange = (newType: string) => {
    const currentEdge = reactFlow.getEdge(id)
    const currentData = currentEdge?.data || {}
    
    // Store the current label as savedLabel when switching away from association
    if (currentEdge?.type === "UseCaseAssociation" && newType !== "UseCaseAssociation") {
      reactFlow.updateEdge(id, { 
        type: newType,
        data: {
          ...currentData,
          savedLabel: currentData.label, // Save current label
          label: undefined, // Remove active label
        }
      })
    }
    // Restore savedLabel when switching back to association
    else if (currentEdge?.type !== "UseCaseAssociation" && newType === "UseCaseAssociation") {
      reactFlow.updateEdge(id, { 
        type: newType,
        data: {
          ...currentData,
          label: currentData.savedLabel || "", // Restore saved label
        }
      })
    }
    // For all other edge type changes, just update the type
    else {
      reactFlow.updateEdge(id, { type: newType })
    }
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

  const handleLabelChange = (newLabel: string) => {
    reactFlow.updateEdgeData(id, { label: newLabel })
  }

  return {
    handleSourceRoleChange,
    handleSourceMultiplicityChange,
    handleTargetRoleChange,
    handleTargetMultiplicityChange,
    handleEdgeTypeChange,
    handleLabelChange,
    handleSwap,
  }
}