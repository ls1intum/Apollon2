import { Edge, Node } from "@xyflow/react"
import { UMLModel } from "@/typings"
import { mapFromReactFlowEdgeToApollonEdge, mapFromReactFlowNodeToApollonNode } from "./diagramTypeUtils"
// 

interface NodeWithPosition extends Node {
  width: number
  height: number
  position: { x: number; y: number }
}


export function createModelWithPathData(
  nodes: Node[], 
  edges: Edge[], 
  modelData: {
    id: string
    title: string
    type: any
    assessments: any
  }
): UMLModel {
  // Create a map of nodes by ID for quick lookup
  const nodeMap = new Map<string, NodeWithPosition>()
  
  nodes.forEach(node => {
    nodeMap.set(node.id, {
      ...node,
      width: node.width || 100,
      height: node.height || 160,
      position: node.position
    })
  })

  // Process edges and ensure they all have path points
  // const apollonEdges: ApollonEdge[] = edges.map(edge => {
  //   const edgeWithPositions = edge as EdgeWithPositions
  //   const sourceNode = nodeMap.get(edge.source)
  //   const targetNode = nodeMap.get(edge.target)
    
  //   if (!sourceNode || !targetNode) {
  //     // If nodes are missing, use the original edge data
  //     return mapFromReactFlowEdgeToApollonEdge(edge)
  //   }

  //   // // Compute current path points
  //   // const pathPoints = computeEdgePathPoints(edgeWithPositions, sourceNode, targetNode)
    
  //   // // Create enhanced edge with path points
  //   // const edgeWithPoints: Edge = {
  //   //   ...edge,
  //   //   data: {
  //   //     ...edge.data,
  //   //     points: pathPoints
  //   //   }
  //   // }

  //   //return mapFromReactFlowEdgeToApollonEdge(edgeWithPoints)
  // })

  return {
    version: "4.0.0",
    id: modelData.id,
    title: modelData.title,
    type: modelData.type,
    nodes: nodes.map(node => mapFromReactFlowNodeToApollonNode(node)),
    edges: edges.map(edge => mapFromReactFlowEdgeToApollonEdge(edge)),
    assessments: modelData.assessments,
  }
}

/**
 * Export hook that ensures all edges have path data
 */
// export function exportModelWithPathData(
//   nodes: Node[],
//   edges: Edge[],
//   modelData: {
//     id: string
//     title: string 
//     type: any
//     assessments: any
//   }
// ): string {
//   const modelWithPaths = createModelWithPathData(nodes, edges, modelData)
//   return JSON.stringify(modelWithPaths, null, 2)
// }
