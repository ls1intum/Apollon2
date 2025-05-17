import { UMLDiagramType } from "@/types"
import { UMLModel } from "@/types/EditorOptions"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validateParsedJSON = (json: any): UMLModel | string => {
  if (
    typeof json !== "object" ||
    json === null ||
    typeof json.version !== "string" ||
    typeof json.title !== "string" ||
    typeof json.type !== "string" ||
    !Array.isArray(json.nodes) ||
    !Array.isArray(json.edges)
  ) {
    return "Invalid JSON structure. Required fields: version, title, nodes, edges."
  }

  //Validate diagramType
  if (!(json.diagramType in UMLDiagramType)) {
    return "Invalid diagram type"
  }

  // Validate nodes
  for (const node of json.nodes) {
    if (
      typeof node.id !== "string" ||
      typeof node.type !== "string" ||
      typeof node.position !== "object" ||
      typeof node.position.x !== "number" ||
      typeof node.position.y !== "number" ||
      typeof node.width !== "number" ||
      typeof node.height !== "number" ||
      typeof node.data !== "object" ||
      node.data === null
    ) {
      return `Invalid node structure`
    }
  }

  // Validate edges
  for (const edge of json.edges) {
    if (
      typeof edge.id !== "string" ||
      typeof edge.source !== "string" ||
      typeof edge.target !== "string" ||
      typeof edge.type !== "string" ||
      typeof edge.sourceHandle !== "string" ||
      typeof edge.targetHandle !== "string"
    ) {
      return `Invalid edge structure`
    }
  }

  return json
}
