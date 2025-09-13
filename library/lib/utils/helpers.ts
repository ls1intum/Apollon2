import { DiagramEdgeType, UMLModel } from "@/typings"

export type AssessmentViewData = {
  elementId: string
  elementType: string
  name: string
  feedback: string
  score: number
}

export const getEdgeAssessmentDataById = (
  edgeId: string,
  model: UMLModel
): AssessmentViewData | undefined => {
  const foundEdge = model.edges.find((edge) => edge.id === edgeId)
  const edgeAssessment = model.assessments[edgeId]
  if (!foundEdge || !edgeAssessment) {
    return undefined
  }

  const sourceNode = model.nodes.find((node) => node.id === foundEdge.source)
  const targetNode = model.nodes.find((node) => node.id === foundEdge.target)
  const name = `${sourceNode?.data?.name || sourceNode?.type || ""} ${getEdgeTypeSymbol(foundEdge.type)} ${targetNode?.data?.name || targetNode?.type || ""}`

  return {
    elementId: edgeId,
    elementType: foundEdge.type,
    name,
    feedback: edgeAssessment.feedback ?? "",
    score: edgeAssessment.score,
  }
}

export const getNodeAssessmentDataByNodeElementId = (
  nodeElementId: string,
  model: UMLModel
): AssessmentViewData | undefined => {
  const nodeAssessment = model.assessments[nodeElementId]

  // No Assessment found
  if (!nodeAssessment) {
    return undefined
  }

  // Search the children of nodes to find the node with the given elementId
  const foundNode = model.nodes.find((node) => node.id === nodeElementId)

  if (foundNode) {
    return {
      elementId: nodeElementId,
      elementType: nodeAssessment.elementType,
      name: foundNode.data?.name as string,
      feedback: nodeAssessment.feedback ?? "",
      score: nodeAssessment.score,
    }
  }

  // Check all gradable sub-elements in nodes here (e.g. attributes, methods, actionRow) for the given elementId

  return undefined
}

const getEdgeTypeSymbol = (edgeType: DiagramEdgeType) => {
  const loweredType = edgeType.toLowerCase()

  if (loweredType.includes("bidirectional")) return "<->"
  if (loweredType.includes("unidirectional")) return "-->"
  if (loweredType.includes("aggregation")) return "--◇"
  if (loweredType.includes("inheritance")) return "--▷"
  if (loweredType.includes("dependency")) return "⋯⋯>"
  if (loweredType.includes("composition")) return "--◆"
  if (loweredType.includes("controlflow")) return "-->"

  if (loweredType.includes("aggregation")) return "--◇"
  if (loweredType.includes("association")) return "—-"
  if (loweredType.includes("implementation")) return "⇨"
  if (loweredType.includes("generalization")) return "⇨"

  return "—-"
}
