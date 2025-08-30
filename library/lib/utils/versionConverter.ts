import { UMLModel, ApollonNode, ApollonEdge, Assessment } from "../typings"
import { UMLDiagramType } from "../types/DiagramType"
import { ClassType } from "../types/nodes/enums"
import { IPoint } from "../edges/Connection"
import { getEdgeMarkerStyles } from "./edgeUtils"

/**
 * Legacy v3 diagram format types
 */
interface V3DiagramFormat {
  id: string
  title: string
  model: {
    version: string
    type: string
    size: { width: number; height: number }
    interactive: { elements: Record<string, unknown>; relationships: Record<string, unknown> }
    elements: Record<string, V3Element>
    relationships: Record<string, V3Relationship>
    assessments?: Record<string, unknown>
  }
}

interface V3Element {
  id: string
  name: string
  type: string
  owner: string | null
  bounds: { x: number; y: number; width: number; height: number }
  attributes?: string[]
  methods?: string[]
  stereotype?: string
}

interface V3Relationship {
  id: string
  name: string
  type: string
  owner: string | null
  bounds: { x: number; y: number; width: number; height: number }
  path: IPoint[]
  source: {
    direction: string
    element: string
    multiplicity: string
    role: string
  }
  target: {
    direction: string
    element: string
    multiplicity: string
    role: string
  }
  isManuallyLayouted: boolean
}



/**
 * Convert v3 handle directions to v4 handle IDs
 */
export function convertV3HandleToV4(v3Handle: string): string {
  const handleMap: Record<string, string> = {
    'Right': 'right',
    'Left': 'left', 
    'Top': 'top',
    'Bottom': 'bottom',
    'Up': 'top',
    'Down': 'bottom',
    // Add variations just in case
    'RIGHT': 'right',
    'LEFT': 'left',
    'TOP': 'top', 
    'BOTTOM': 'bottom',
  }
  
  return handleMap[v3Handle] || v3Handle.toLowerCase()
}

/**
 * Convert v3 node types to v4 node types (PascalCase to camelCase)
 */
export function convertV3NodeTypeToV4(v3Type: string): string {
  const typeMap: Record<string, string> = {
    // Class Diagram
    'Class': 'class',
    'AbstractClass': 'class',
    'Interface': 'class', 
    'Enumeration': 'class',
    'Package': 'package',
    'ClassAttribute': 'classAttribute',
    'ClassMethod': 'classMethod',
    
    // Activity Diagram
    'ActivityInitialNode': 'activityInitialNode',
    'ActivityFinalNode': 'activityFinalNode',
    'ActivityActionNode': 'activityActionNode',
    'ActivityObjectNode': 'activityObjectNode',
    'ActivityForkNode': 'activityForkNode',
    'ActivityForkNodeHorizontal': 'activityForkNodeHorizontal',
    'ActivityMergeNode': 'activityMergeNode',
    'ActivityDecisionNode': 'activityDecisionNode',
    
    // Use Case Diagram
    'UseCase': 'useCase',
    'Actor': 'actor',
    'UseCaseSystem': 'useCaseSystem',
    
    // Communication Diagram
    'CommunicationLink': 'communicationLink',
    'CommunicationObject': 'communicationObject',
    
    // Component Diagram
    'Component': 'component',
    'ComponentInterface': 'componentInterface',
    'ComponentSubsystem': 'componentSubsystem',
    
    // Deployment Diagram
    'DeploymentNode': 'deploymentNode',
    'DeploymentComponent': 'deploymentComponent',
    
    // Object Diagram
    'ObjectName': 'objectName',
    'ObjectAttribute': 'objectAttribute',
    'ObjectMethod': 'objectMethod',
    
    // Petri Net
    'PetriNetPlace': 'petriNetPlace',
    'PetriNetTransition': 'petriNetTransition',
    
    // Reachability Graph
    'ReachabilityGraphNode': 'reachabilityGraphNode',
    
    // Syntax Tree
    'SyntaxTreeNonterminal': 'syntaxTreeNonterminal',
    'SyntaxTreeTerminal': 'syntaxTreeTerminal',
    
    // Flowchart
    'FlowchartProcess': 'flowchartProcess',
    'FlowchartDecision': 'flowchartDecision',
    'FlowchartInputOutput': 'flowchartInputOutput',
    'FlowchartFunctionCall': 'flowchartFunctionCall',
    'FlowchartTerminal': 'flowchartTerminal',
  }
  
  return typeMap[v3Type] || v3Type.toLowerCase()
}

/**
 * Convert v3 edge types to v4 edge types
 */
export function convertV3EdgeTypeToV4(v3Type: string): string {
  const edgeTypeMap: Record<string, string> = {
    // Class Diagram
    'ClassBidirectional': 'ClassBidirectional',
    'ClassUnidirectional': 'ClassUnidirectional',
    'ClassInheritance': 'ClassInheritance',
    'ClassRealization': 'ClassRealization',
    'ClassDependency': 'ClassDependency',
    'ClassAggregation': 'ClassAggregation',
    'ClassComposition': 'ClassComposition',
    
    // Activity Diagram
    'ActivityControlFlow': 'ActivityControlFlow',
    
    // Use Case Diagram
    'UseCaseAssociation': 'UseCaseAssociation',
    'UseCaseInclude': 'UseCaseInclude',
    'UseCaseExtend': 'UseCaseExtend',
    'UseCaseGeneralization': 'UseCaseGeneralization',
    
    // Communication Diagram
    'CommunicationLink': 'CommunicationLink',
    
    // Component Diagram
    'ComponentDependency': 'ComponentDependency',
    'ComponentProvidedInterface': 'ComponentProvidedInterface',
    'ComponentRequiredInterface': 'ComponentRequiredInterface',
    'ComponentRequiredQuarterInterface': 'ComponentRequiredQuarterInterface',
    'ComponentRequiredThreeQuarterInterface': 'ComponentRequiredThreeQuarterInterface',
    
    // Deployment Diagram
    'DeploymentDependency': 'DeploymentDependency',
    'DeploymentAssociation': 'DeploymentAssociation',
    'DeploymentProvidedInterface': 'DeploymentProvidedInterface',
    'DeploymentRequiredInterface': 'DeploymentRequiredInterface',
    'DeploymentRequiredQuarterInterface': 'DeploymentRequiredQuarterInterface',
    'DeploymentRequiredThreeQuarterInterface': 'DeploymentRequiredThreeQuarterInterface',
    
    // Object Diagram
    'ObjectLink': 'ObjectLink',
    
    // Petri Net
    'PetriNetArc': 'PetriNetArc',
    
    // Reachability Graph
    'ReachabilityGraphArc': 'ReachabilityGraphArc',
    
    // Syntax Tree
    'SyntaxTreeLink': 'SyntaxTreeLink',
    
    // Flowchart
    'FlowChartFlowline': 'FlowChartFlowline',
    
    // BPMN
    'BPMNSequenceFlow': 'BPMNSequenceFlow',
    'BPMNMessageFlow': 'BPMNMessageFlow',
    'BPMNAssociationFlow': 'BPMNAssociationFlow',
    'BPMNDataAssociationFlow': 'BPMNDataAssociationFlow',
  }
  
  return edgeTypeMap[v3Type] || v3Type
}

/**
 * Calculate relative position within parent bounds
 */
function calculateRelativePosition(child: V3Element, parent: V3Element): { x: number; y: number } {
  return {
    x: child.bounds.x - parent.bounds.x,
    y: child.bounds.y - parent.bounds.y
  }
}

/**
 * Convert v3 element to v4 node
 */
function convertV3ElementToV4Node(element: V3Element, allElements: Record<string, V3Element>): ApollonNode {
  // Determine stereotype for special class types
  let stereotype: ClassType | undefined
  if (element.type === 'AbstractClass') {
    stereotype = ClassType.Abstract
  } else if (element.type === 'Interface') {
    stereotype = ClassType.Interface
  } else if (element.type === 'Enumeration') {
    stereotype = ClassType.Enumeration
  }

  // Convert child elements to method/attribute arrays (v4 format expects objects with id and name)
  const attributes: Array<{ id: string; name: string }> = []
  const methods: Array<{ id: string; name: string }> = []

  if (element.attributes) {
    element.attributes.forEach(attrId => {
      const attr = allElements[attrId]
      if (attr) {
        attributes.push({ id: attr.id, name: attr.name })
      }
    })
  }

  if (element.methods) {
    element.methods.forEach(methodId => {
      const method = allElements[methodId]
      if (method) {
        methods.push({ id: method.id, name: method.name })
      }
    })
  }

  // Calculate position (relative to parent if it has one)
  let position = { x: element.bounds.x, y: element.bounds.y }
  if (element.owner) {
    const parent = allElements[element.owner]
    if (parent) {
      position = calculateRelativePosition(element, parent)
    }
  }

  const baseNode: ApollonNode = {
    id: element.id,
    type: convertV3NodeTypeToV4(element.type) as any,
    position,
    width: element.bounds.width,
    height: element.bounds.height,
    measured: {
      width: element.bounds.width,
      height: element.bounds.height,
    },
    data: {
      name: element.name,
      ...(attributes.length > 0 && { attributes }),
      ...(methods.length > 0 && { methods }),
      ...(stereotype && { stereotype }),
    },
    ...(element.owner && { parentId: element.owner }),
  }

  return baseNode
}

/**
 * Convert v3 relationship to v4 edge
 */
function convertV3RelationshipToV4Edge(relationship: V3Relationship): ApollonEdge {
  // Get marker styles for this edge type to determine padding
  const edgeType = convertV3EdgeTypeToV4(relationship.type)
  const { markerPadding } = getEdgeMarkerStyles(edgeType)
  
  // Convert v3 path (relative to bounds) to v4 points (absolute coordinates)
  let points: IPoint[] = []
  
  if (relationship.path && relationship.path.length > 0) {
    // Convert relative path points to absolute coordinates
    points = relationship.path.map(point => ({
      x: point.x + relationship.bounds.x,
      y: point.y + relationship.bounds.y
    }))
    
    // Log essential positioning information
    console.log(`Edge ${relationship.id}:`)
    console.log(`  Source: ${relationship.source.element} (${relationship.source.direction})`)
    console.log(`  Target: ${relationship.target.element} (${relationship.target.direction})`)
    console.log(`  First point: (${points[0].x}, ${points[0].y})`)
    console.log(`  Last point: (${points[points.length - 1].x}, ${points[points.length - 1].y})`)
    console.log(`  Marker padding: ${markerPadding}`)
    
    // Adjust the last point (target end) to account for marker padding
    // This prevents the arrow from colliding with the target node
    if (points.length > 0 && markerPadding !== undefined) {
      const lastPoint = points[points.length - 1]
      const secondLastPoint = points.length > 1 ? points[points.length - 2] : lastPoint
      
      // Calculate direction vector from second-to-last to last point
      const dx = lastPoint.x - secondLastPoint.x
      const dy = lastPoint.y - secondLastPoint.y
      const length = Math.sqrt(dx * dx + dy * dy)
      
      if (length > 0) {
        // Normalize and apply padding offset
        const normalizedDx = dx / length
        const normalizedDy = dy / length
        
        const adjustedPoint = {
          x: lastPoint.x - normalizedDx * Math.abs(markerPadding + 2),
          y: lastPoint.y - normalizedDy * Math.abs(markerPadding + 2)
        }
        
        points[points.length - 1] = adjustedPoint
        console.log(`  Adjusted last point: (${adjustedPoint.x}, ${adjustedPoint.y})`)
      }
    }
  }

  const edge: ApollonEdge = {
    id: relationship.id,
    source: relationship.source.element,
    target: relationship.target.element,
    type: edgeType as any,
    sourceHandle: convertV3HandleToV4(relationship.source.direction || ""),
    targetHandle: convertV3HandleToV4(relationship.target.direction || ""),
    data: {
      name: relationship.name || "",
      // Include points only if we have them and they're meaningful
      ...(points.length > 0 && { points }),
      // Store source/target metadata
      sourceMultiplicity: relationship.source.multiplicity || "",
      targetMultiplicity: relationship.target.multiplicity || "",
      sourceRole: relationship.source.role || "",
      targetRole: relationship.target.role || "",
      isManuallyLayouted: relationship.isManuallyLayouted || false,
    },
  }

  return edge
}

/**
 * Main conversion function from v3 to v4 format
 */
export function convertV3ToV4(v3Data: V3DiagramFormat): UMLModel {
  const elements = v3Data.model.elements
  const relationships = v3Data.model.relationships
  
  // Convert elements to nodes
  const nodes: ApollonNode[] = Object.values(elements)
    .filter(element => !['ClassAttribute', 'ClassMethod', 'ObjectAttribute', 'ObjectMethod'].includes(element.type))
    .map(element => convertV3ElementToV4Node(element, elements))

  // Convert relationships to edges
  const edges: ApollonEdge[] = Object.values(relationships).map(relationship => 
    convertV3RelationshipToV4Edge(relationship)
  )

  // Convert assessments if they exist
  const assessments: Assessment[] = []
  if (v3Data.model.assessments) {
    Object.entries(v3Data.model.assessments).forEach(([id, assessment]) => {
      if (typeof assessment === 'object' && assessment !== null) {
        assessments.push({
          modelElementId: id,
          elementType: 'unknown',
          score: 0,
          ...assessment
        } as Assessment)
      }
    })
  }

  // Build v4 format
  const v4Model: UMLModel = {
    version: '4.0.0',
    id: v3Data.id,
    title: v3Data.title,
    type: v3Data.model.type as UMLDiagramType,
    nodes,
    edges,
    assessments: assessments.reduce((acc, assessment) => {
      acc[assessment.modelElementId] = assessment
      return acc
    }, {} as { [id: string]: Assessment }),
  }

  return v4Model
}

/**
 * Check if data is in v3 format
 */
export function isV3Format(data: any): data is V3DiagramFormat {
  return (
    data &&
    data.model &&
    data.model.version &&
    data.model.version.startsWith('3.') &&
    data.model.elements &&
    data.model.relationships &&
    typeof data.model.elements === 'object' &&
    typeof data.model.relationships === 'object'
  )
}

/**
 * Check if data is in v4 format
 */
export function isV4Format(data: any): data is UMLModel {
  return (
    data &&
    data.version &&
    data.version.startsWith('4.') &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.edges)
  )
}

/**
 * Universal import function that handles both v3 and v4 formats
 */
export function importDiagram(data: any): UMLModel {
  if (isV4Format(data)) {
    return data
  }
  
  if (isV3Format(data)) {
    return convertV3ToV4(data)
  }

  throw new Error("Unsupported diagram format. Only v3.x.x and v4.x.x formats are supported.")
}
