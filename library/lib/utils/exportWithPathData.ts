import { Edge, Node } from "@xyflow/react"
import { ApollonEdge, UMLModel } from "@/typings"
import { mapFromReactFlowEdgeToApollonEdge, mapFromReactFlowNodeToApollonNode } from "./diagramTypeUtils"
import { getSmoothStepPath } from "@xyflow/react"
import { 
  adjustTargetCoordinates, 
  adjustSourceCoordinates,
  getEdgeMarkerStyles,
  simplifySvgPath,
  parseSvgPath,
  removeDuplicatePoints
} from "./edgeUtils"
import { tryFindStraightPath } from "@/edges/Connection"
import { MARKER_PADDING, SOURCE_CONNECTION_POINT_PADDING, STEP_BOARDER_RADIUS } from "@/constants"
import { Position } from "@xyflow/react"
import { IPoint } from "@/edges/types"

interface NodeWithPosition extends Node {
  width: number
  height: number
  position: { x: number; y: number }
}

interface EdgeWithPositions extends Edge {
  sourcePosition?: Position
  targetPosition?: Position
}

/**
 * Computes the current path points for an edge based on its current state
 */
function computeEdgePathPoints(
  edge: EdgeWithPositions, 
  sourceNode: NodeWithPosition, 
  targetNode: NodeWithPosition
): IPoint[] {
  // If edge already has custom points, use them
  if (edge.data?.points && Array.isArray(edge.data.points) && edge.data.points.length > 0) {
    return edge.data.points as IPoint[]
  }

  // Get edge styling information
  const { markerPadding = MARKER_PADDING } = getEdgeMarkerStyles(edge.type || "")
  
  // Calculate edge endpoints - use default positions if not specified
  const sourcePosition = edge.sourcePosition || Position.Right
  const targetPosition = edge.targetPosition || Position.Left
  
  // Use the edge's current coordinates or calculate from nodes
  const sourceX = sourceNode.position.x + (sourceNode.width || 0) / 2
  const sourceY = sourceNode.position.y + (sourceNode.height || 0) / 2
  const targetX = targetNode.position.x + (targetNode.width || 0) / 2
  const targetY = targetNode.position.y + (targetNode.height || 0) / 2

  const adjustedTargetCoordinates = adjustTargetCoordinates(
    targetX,
    targetY,
    targetPosition,
    markerPadding
  )
  const adjustedSourceCoordinates = adjustSourceCoordinates(
    sourceX,
    sourceY,
    sourcePosition,
    SOURCE_CONNECTION_POINT_PADDING
  )

  let points: IPoint[]

  // Try straight path first (similar to useStepPathEdge logic)
  const straightPathPoints = tryFindStraightPath(
    {
      position: { x: sourceNode.position.x, y: sourceNode.position.y },
      width: sourceNode.width || 100,
      height: sourceNode.height || 160,
      direction: sourcePosition,
    },
    {
      position: { x: targetNode.position.x, y: targetNode.position.y },
      width: targetNode.width || 100,
      height: targetNode.height || 160,
      direction: targetPosition,
    },
    markerPadding
  )

  if (straightPathPoints !== null) {
    points = straightPathPoints
  } else {
    // Fall back to smooth step path
    const [edgePath] = getSmoothStepPath({
      sourceX: adjustedSourceCoordinates.sourceX,
      sourceY: adjustedSourceCoordinates.sourceY,
      sourcePosition,
      targetX: adjustedTargetCoordinates.targetX,
      targetY: adjustedTargetCoordinates.targetY,
      targetPosition,
      borderRadius: STEP_BOARDER_RADIUS,
      offset: 30,
    })

    const simplifiedPath = simplifySvgPath(edgePath)
    points = removeDuplicatePoints(parseSvgPath(simplifiedPath))
  }

  return points
}

/**
 * Creates a UMLModel with complete path data for all edges
 */
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
  const apollonEdges: ApollonEdge[] = edges.map(edge => {
    const edgeWithPositions = edge as EdgeWithPositions
    const sourceNode = nodeMap.get(edge.source)
    const targetNode = nodeMap.get(edge.target)
    
    if (!sourceNode || !targetNode) {
      // If nodes are missing, use the original edge data
      return mapFromReactFlowEdgeToApollonEdge(edge)
    }

    // Compute current path points
    const pathPoints = computeEdgePathPoints(edgeWithPositions, sourceNode, targetNode)
    
    // Create enhanced edge with path points
    const edgeWithPoints: Edge = {
      ...edge,
      data: {
        ...edge.data,
        points: pathPoints
      }
    }

    return mapFromReactFlowEdgeToApollonEdge(edgeWithPoints)
  })

  return {
    version: "4.0.0",
    id: modelData.id,
    title: modelData.title,
    type: modelData.type,
    nodes: nodes.map(node => mapFromReactFlowNodeToApollonNode(node)),
    edges: apollonEdges,
    assessments: modelData.assessments,
  }
}

/**
 * Export hook that ensures all edges have path data
 */
export function exportModelWithPathData(
  nodes: Node[],
  edges: Edge[],
  modelData: {
    id: string
    title: string 
    type: any
    assessments: any
  }
): string {
  const modelWithPaths = createModelWithPathData(nodes, edges, modelData)
  return JSON.stringify(modelWithPaths, null, 2)
}
