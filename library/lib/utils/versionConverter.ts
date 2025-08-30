import { UMLModel, ApollonNode, ApollonEdge, Assessment } from "../typings"
import { UMLDiagramType } from "../types/DiagramType"
import { ClassType } from "../types/nodes/enums"
import { IPoint } from "../edges/Connection"
import { getEdgeMarkerStyles } from "./edgeUtils"
import { 
  V3DiagramFormat, 
  V3UMLElement, 
  V3UMLRelationship, 
  V3Assessment 
} from "./v3Typings"

// Import V4 node prop types
import {
  ClassNodeProps,
  ObjectNodeProps,
  CommunicationObjectNodeProps,
  ComponentNodeProps,
  ComponentSubsystemNodeProps,
  DeploymentNodeProps,
  DeploymentComponentProps,
  PetriNetPlaceProps,
  BPMNTaskProps,
  BPMNGatewayProps,
  BPMNStartEventProps,
  BPMNIntermediateEventProps,
  BPMNEndEventProps,
  // BPMNSubprocessProps,
  // BPMNTransactionProps,
  // BPMNCallActivityProps,
  // BPMNAnnotationProps,
  // BPMNDataObjectProps,
  // BPMNDataStoreProps,
  // BPMNPoolProps,
  // BPMNGroupProps,
  ReachabilityGraphMarkingProps,
  // SfcActionTableProps
} from "../types/nodes/NodeProps"

// V2 format interface for type checking (corrected based on real V2 format)
interface V2DiagramFormat {
  version: string;
  size: {
    width: number;
    height: number;
  };
  type: string;
  interactive: {
    elements: string[];
    relationships: string[];
  };
  elements: V3UMLElement[];
  relationships: V3UMLRelationship[];
  assessments: V3Assessment[];
}

/**
 * Convert v2 format to v4 format
 */
export function convertV2ToV4(v2Data: V2DiagramFormat): UMLModel {
  // First convert v2 to v3 structure
  const v3Data: V3DiagramFormat = {
    id: 'converted-diagram-' + Date.now(), // Generate a unique ID
    title: 'Converted Diagram',
    model: {
      version: "3.0.0",
      type: v2Data.type as any, // Cast to any to bypass strict typing during conversion
      size: v2Data.size,
      interactive: {
        elements: {},
        relationships: {}
      },
      elements: {},
      relationships: {},
      assessments: {}
    }
  };

  // Convert interactive arrays to objects
  if (v2Data.interactive?.elements) {
    v2Data.interactive.elements.forEach(id => {
      v3Data.model.interactive.elements[id] = true;
    });
  }
  
  if (v2Data.interactive?.relationships) {
    v2Data.interactive.relationships.forEach(id => {
      v3Data.model.interactive.relationships[id] = true;
    });
  }

  // Convert elements array to object
  if (v2Data.elements) {
    v2Data.elements.forEach(element => {
      v3Data.model.elements[element.id] = element;
    });
  }

  // Convert relationships array to object
  if (v2Data.relationships) {
    v2Data.relationships.forEach(relationship => {
      v3Data.model.relationships[relationship.id] = relationship;
    });
  }

  // Convert assessments array to object
  if (v2Data.assessments) {
    v2Data.assessments.forEach(assessment => {
      v3Data.model.assessments[assessment.modelElementId] = assessment;
    });
  }

  // Now convert v3 to v4 using existing function
  return convertV3ToV4(v3Data);
}

/**
 * Check if data is in v2 format
 */
export function isV2Format(data: any): data is V2DiagramFormat {
  return (
    data &&
    data.version &&
    data.version.startsWith('2.') &&
    // V2 has flat structure (no nested 'model' object)
    data.size &&
    data.type &&
    Array.isArray(data.elements) &&
    Array.isArray(data.relationships) &&
    Array.isArray(data.assessments) &&
    data.interactive &&
    Array.isArray(data.interactive.elements) &&
    Array.isArray(data.interactive.relationships) &&
    // Ensure it's NOT V3 format (which has nested 'model')
    !data.model
  )
}

/**
 * Convert v3 handle directions to v4 handle IDs
 * V3 uses Direction enum, V4 uses HandleId enum
 */
export function convertV3HandleToV4(v3Handle: string): string {
  const handleMap: Record<string, string> = {
    // Main directions
    'Up': 'top',
    'Right': 'right', 
    'Down': 'bottom',
    'Left': 'left',
    
    // Diagonal/corner handles
    'Upright': 'right-top',
    'Upleft': 'left-top',
    'Downright': 'right-bottom', 
    'Downleft': 'left-bottom',
    
    // Handle intermediate positions if they exist in V3
    'RightTop': 'top-right',
    'RightBottom': 'bottom-right',
    'LeftTop': 'top-left',
    'LeftBottom': 'bottom-left',
  }
  
  return handleMap[v3Handle] || v3Handle.toLowerCase()
}

/**
 * Convert v3 node types to v4 node types
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
    'Activity': 'activity',
    
    // Use Case Diagram
    'UseCase': 'useCase',
    'UseCaseActor': 'useCaseActor',
    'UseCaseSystem': 'useCaseSystem',
    
    // Communication Diagram
    'CommunicationObject': 'communicationObjectName',
    
    // Component Diagram
    'Component': 'component',
    'ComponentInterface': 'componentInterface',
    'ComponentSubsystem': 'componentSubsystem',
    
    // Deployment Diagram
    'DeploymentNode': 'deploymentNode',
    'DeploymentComponent': 'deploymentComponent',
    'DeploymentArtifact': 'deploymentArtifact',
    'DeploymentInterface': 'deploymentInterface',
    
    // Object Diagram
    'ObjectName': 'objectName',
    'ObjectAttribute': 'objectAttribute',
    'ObjectMethod': 'objectMethod',
    
    // Petri Net
    'PetriNetPlace': 'petriNetPlace',
    'PetriNetTransition': 'petriNetTransition',
    
    // Reachability Graph
    'ReachabilityGraphNode': 'reachabilityGraphMarking',
    
    // Syntax Tree
    'SyntaxTreeNonterminal': 'syntaxTreeNonterminal',
    'SyntaxTreeTerminal': 'syntaxTreeTerminal',
    
    // Flowchart
    'FlowchartProcess': 'flowchartProcess',
    'FlowchartDecision': 'flowchartDecision',
    'FlowchartInputOutput': 'flowchartInputOutput',
    'FlowchartFunctionCall': 'flowchartFunctionCall',
    'FlowchartTerminal': 'flowchartTerminal',
    
    // BPMN
    'BPMNTask': 'bpmnTask',
    'BPMNGateway': 'bpmnGateway',
    'BPMNStartEvent': 'bpmnStartEvent',
    'BPMNIntermediateEvent': 'bpmnIntermediateEvent',
    'BPMNEndEvent': 'bpmnEndEvent',
    'BPMNSubprocess': 'bpmnSubprocess',
    'BPMNTransaction': 'bpmnTransaction',
    'BPMNCallActivity': 'bpmnCallActivity',
    'BPMNAnnotation': 'bpmnAnnotation',
    'BPMNDataObject': 'bpmnDataObject',
    'BPMNDataStore': 'bpmnDataStore',
    'BPMNPool': 'bpmnPool',
    'BPMNGroup': 'bpmnGroup',
    
    // SFC Diagram
    'SfcStart': 'sfcStart',
    'SfcStep': 'sfcStep',
    'SfcActionTable': 'sfcActionTable',
    'SfcTransitionBranch': 'sfcTransitionBranch',
    'SfcJump': 'sfcJump',
    'SfcPreviewSpacer': 'sfcPreviewSpacer',
    
    // Special nodes
    'ColorDescription': 'colorDescription',
    'TitleAndDescription': 'titleAndDesctiption', // Note the typo in V4: "desctiption"
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
function calculateRelativePosition(child: V3UMLElement, parent: V3UMLElement): { x: number; y: number } {
  return {
    x: child.bounds.x - parent.bounds.x,
    y: child.bounds.y - parent.bounds.y
  }
}

/**
 * Convert V3 node data to V4 node data format
 */
function convertV3NodeDataToV4(element: V3UMLElement, allElements: Record<string, V3UMLElement>): any {
  const baseData = {
    name: element.name,
    // Visual properties
    ...(element.fillColor && { fillColor: element.fillColor }),
    ...(element.strokeColor && { strokeColor: element.strokeColor }),
    ...(element.textColor && { textColor: element.textColor }),
    ...(element.highlight && { highlight: element.highlight }),
    ...(element.assessmentNote && { assessmentNote: element.assessmentNote }),
  }

  // Convert based on element type
  switch (element.type) {
    case 'Class':
    case 'AbstractClass':
    case 'Interface':
    case 'Enumeration': {
      // Collect attributes and methods from child elements
      const attributes: Array<{ id: string; name: string }> = []
      const methods: Array<{ id: string; name: string }> = []

      // Find child attributes and methods
      Object.values(allElements).forEach(childElement => {
        if (childElement.owner === element.id) {
          if (childElement.type === 'ClassAttribute') {
            attributes.push({ id: childElement.id, name: childElement.name })
          } else if (childElement.type === 'ClassMethod') {
            methods.push({ id: childElement.id, name: childElement.name })
          }
        }
      })

      // Also handle attributes/methods stored as ID arrays
      if (element.attributes && Array.isArray(element.attributes)) {
        element.attributes.forEach(attrId => {
          const attr = allElements[attrId]
          if (attr && !attributes.find(a => a.id === attr.id)) {
            attributes.push({ id: attr.id, name: attr.name })
          }
        })
      }

      if (element.methods && Array.isArray(element.methods)) {
        element.methods.forEach(methodId => {
          const method = allElements[methodId]
          if (method && !methods.find(m => m.id === method.id)) {
            methods.push({ id: method.id, name: method.name })
          }
        })
      }

      // Determine stereotype
      let stereotype: ClassType | undefined
      if (element.type === 'AbstractClass') {
        stereotype = ClassType.Abstract
      } else if (element.type === 'Interface') {
        stereotype = ClassType.Interface
      } else if (element.type === 'Enumeration') {
        stereotype = ClassType.Enumeration
      }

      const classData: ClassNodeProps = {
        ...baseData,
        methods,
        attributes,
        ...(stereotype && { stereotype }),
      }
      return classData
    }

    case 'ObjectName': {
      // Similar to class but for objects
      const attributes: Array<{ id: string; name: string }> = []
      const methods: Array<{ id: string; name: string }> = []

      Object.values(allElements).forEach(childElement => {
        if (childElement.owner === element.id) {
          if (childElement.type === 'ObjectAttribute') {
            attributes.push({ id: childElement.id, name: childElement.name })
          } else if (childElement.type === 'ObjectMethod') {
            methods.push({ id: childElement.id, name: childElement.name })
          }
        }
      })

      const objectData: ObjectNodeProps = {
        ...baseData,
        methods,
        attributes,
      }
      return objectData
    }

    case 'CommunicationObject': {
      const attributes: Array<{ id: string; name: string }> = []
      const methods: Array<{ id: string; name: string }> = []

      const communicationData: CommunicationObjectNodeProps = {
        ...baseData,
        methods,
        attributes,
      }
      return communicationData
    }

    case 'Component': {
      const componentData: ComponentNodeProps = {
        ...baseData,
        isComponentHeaderShown: element.displayStereotype !== false,
      }
      return componentData
    }

    case 'ComponentSubsystem': {
      const subsystemData: ComponentSubsystemNodeProps = {
        ...baseData,
        isComponentSubsystemHeaderShown: element.displayStereotype !== false,
      }
      return subsystemData
    }

    case 'DeploymentNode': {
      const deploymentData: DeploymentNodeProps = {
        ...baseData,
        isComponentHeaderShown: element.displayStereotype !== false,
        stereotype: element.stereotype || '',
      }
      return deploymentData
    }

    case 'DeploymentComponent': {
      const deploymentComponentData: DeploymentComponentProps = {
        ...baseData,
        isComponentHeaderShown: element.displayStereotype !== false,
      }
      return deploymentComponentData
    }

    case 'PetriNetPlace': {
      // Handle capacity type conversion - V3 allows string, V4 only allows number | "Infinity"
      let capacity: number | "Infinity" = "Infinity"
      if (element.capacity !== undefined) {
        if (typeof element.capacity === 'number') {
          capacity = element.capacity
        } else if (typeof element.capacity === 'string') {
          if (element.capacity === "Infinity" || element.capacity === "∞") {
            capacity = "Infinity"
          } else {
            // Try to parse as number
            const parsed = parseFloat(element.capacity)
            capacity = isNaN(parsed) ? "Infinity" : parsed
          }
        }
      }

      const petriNetData: PetriNetPlaceProps = {
        ...baseData,
        tokens: element.amountOfTokens || 0,
        capacity,
      }
      return petriNetData
    }

    case 'BPMNTask': {
      const bpmnTaskData: BPMNTaskProps = {
        ...baseData,
        taskType: (element.taskType as any) || 'default',
        marker: (element.marker as any) || 'none',
      }
      return bpmnTaskData
    }

    case 'BPMNGateway': {
      const bpmnGatewayData: BPMNGatewayProps = {
        ...baseData,
        gatewayType: (element.gatewayType as any) || 'exclusive',
      }
      return bpmnGatewayData
    }

    case 'BPMNStartEvent': {
      const bpmnStartEventData: BPMNStartEventProps = {
        ...baseData,
        eventType: (element.eventType as any) || 'default',
      }
      return bpmnStartEventData
    }

    case 'BPMNIntermediateEvent': {
      const bpmnIntermediateEventData: BPMNIntermediateEventProps = {
        ...baseData,
        eventType: (element.eventType as any) || 'default',
      }
      return bpmnIntermediateEventData
    }

    case 'BPMNEndEvent': {
      const bpmnEndEventData: BPMNEndEventProps = {
        ...baseData,
        eventType: (element.eventType as any) || 'default',
      }
      return bpmnEndEventData
    }

    case 'ReachabilityGraphNode': {
      const reachabilityData: ReachabilityGraphMarkingProps = {
        ...baseData,
        isInitialMarking: element.isInitialMarking || false,
      }
      return reachabilityData
    }

    // For other BPMN elements that just need base data
    case 'BPMNSubprocess':
    case 'BPMNTransaction':
    case 'BPMNCallActivity':
    case 'BPMNAnnotation':
    case 'BPMNDataObject':
    case 'BPMNDataStore':
    case 'BPMNPool':
    case 'BPMNGroup':
      return baseData

    default:
      // For all other node types, return base data
      return baseData
  }
}

/**
 * Convert v3 element to v4 node
 */
function convertV3ElementToV4Node(element: V3UMLElement, allElements: Record<string, V3UMLElement>): ApollonNode {
  // Calculate position (relative to parent if it has one)
  let position = { x: element.bounds.x, y: element.bounds.y }
  if (element.owner) {
    const parent = allElements[element.owner]
    if (parent) {
      position = calculateRelativePosition(element, parent)
    }
  }

  // Convert element data to V4 format
  const data = convertV3NodeDataToV4(element, allElements)

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
    data,
    ...(element.owner && { parentId: element.owner }),
  }

  return baseNode
}

/**
 * Convert v3 relationship to v4 edge
 */
function convertV3RelationshipToV4Edge(relationship: V3UMLRelationship): ApollonEdge {
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

  // Build data object with V3 relationship properties
  const data: any = {
    name: relationship.name || "",
    // Include points only if we have them and they're meaningful
    ...(points.length > 0 && { points }),
    // Store source/target metadata
    sourceMultiplicity: relationship.source.multiplicity || "",
    targetMultiplicity: relationship.target.multiplicity || "",
    sourceRole: relationship.source.role || "",
    targetRole: relationship.target.role || "",
    isManuallyLayouted: relationship.isManuallyLayouted || false,
    // Communication Link specific
    ...(relationship.messages && { messages: relationship.messages }),
    // BPMN specific
    ...(relationship.flowType && { flowType: relationship.flowType }),
    // Visual properties
    ...(relationship.fillColor && { fillColor: relationship.fillColor }),
    ...(relationship.strokeColor && { strokeColor: relationship.strokeColor }),
    ...(relationship.textColor && { textColor: relationship.textColor }),
    ...(relationship.highlight && { highlight: relationship.highlight }),
    ...(relationship.assessmentNote && { assessmentNote: relationship.assessmentNote }),
  }

  const edge: ApollonEdge = {
    id: relationship.id,
    source: relationship.source.element,
    target: relationship.target.element,
    type: edgeType as any,
    sourceHandle: convertV3HandleToV4(relationship.source.direction || ""),
    targetHandle: convertV3HandleToV4(relationship.target.direction || ""),
    data,
  }

  return edge
}

/**
 * Convert V3 assessment to V4 assessment
 */
function convertV3AssessmentToV4(v3Assessment: V3Assessment): Assessment {
  return {
    modelElementId: v3Assessment.modelElementId,
    elementType: v3Assessment.elementType as any, // This needs proper typing
    score: v3Assessment.score,
    ...(v3Assessment.feedback && { feedback: v3Assessment.feedback }),
    ...(v3Assessment.dropInfo && { dropInfo: v3Assessment.dropInfo }),
    ...(v3Assessment.label && { label: v3Assessment.label }),
    ...(v3Assessment.labelColor && { labelColor: v3Assessment.labelColor }),
    ...(v3Assessment.correctionStatus && { correctionStatus: v3Assessment.correctionStatus }),
  }
}

/**
 * Main conversion function from v3 to v4 format
 */
export function convertV3ToV4(v3Data: V3DiagramFormat): UMLModel {
  const elements = v3Data.model.elements
  const relationships = v3Data.model.relationships
  
  console.log('Converting V3 elements:', Object.keys(elements).length)
  console.log('Element types found:', Object.values(elements).map(el => el.type))
  console.log('Diagram type:', v3Data.model.type) // Now using the diagram type
  
  // Convert elements to nodes, but exclude attribute/method elements since they're part of their parent class
  const nodes: ApollonNode[] = Object.values(elements)
    .filter(element => !['ClassAttribute', 'ClassMethod', 'ObjectAttribute', 'ObjectMethod'].includes(element.type))
    .map(element => {
      const node = convertV3ElementToV4Node(element, elements)
      
      // Safe access to attributes and methods for logging
      const nodeData = node.data as any
      const attributesCount = (nodeData && nodeData.attributes && Array.isArray(nodeData.attributes)) ? nodeData.attributes.length : 0
      const methodsCount = (nodeData && nodeData.methods && Array.isArray(nodeData.methods)) ? nodeData.methods.length : 0
      
      console.log(`Converted ${element.type} "${element.name}" with ${attributesCount} attributes and ${methodsCount} methods`)
      return node
    })

  // Convert relationships to edges
  const edges: ApollonEdge[] = Object.values(relationships).map(relationship => 
    convertV3RelationshipToV4Edge(relationship)
  )

  // Convert assessments from v3 to v4 format using the proper conversion function
  const assessments: Record<string, Assessment> = {}
  if (v3Data.model.assessments) {
    console.log('Converting assessments:', Object.keys(v3Data.model.assessments).length)
    Object.entries(v3Data.model.assessments).forEach(([id, v3Assessment]) => {
      try {
        assessments[id] = convertV3AssessmentToV4(v3Assessment)
        console.log(`Converted assessment for element ${id}`)
      } catch (error) {
        console.warn(`Failed to convert assessment for element ${id}:`, error)
      }
    })
  }

  
  // Validate diagram type compatibility
  const supportedDiagramTypes: UMLDiagramType[] = [
    'ClassDiagram',
    'ObjectDiagram', 
    'ActivityDiagram',
    'UseCaseDiagram',
    'CommunicationDiagram',
    'ComponentDiagram',
    'DeploymentDiagram',
    'PetriNet',
    'ReachabilityGraph',
    'SyntaxTree',
    'Flowchart',
    'BPMN',
    'Sfc'
  ]

  if (!supportedDiagramTypes.includes(v3Data.model.type as UMLDiagramType)) {
    console.warn(`Diagram type '${v3Data.model.type}' may not be fully supported in V4`)
  }

  // Build v4 format with proper type validation
  const v4Model: UMLModel = {
    version: '4.0.0',
    id: v3Data.id,
    title: v3Data.title,
    type: v3Data.model.type as UMLDiagramType, // Now properly typed
    nodes,
    edges,
    assessments,
  }

  console.log('Final converted model:', {
    ...v4Model,
    nodeCount: v4Model.nodes.length,
    edgeCount: v4Model.edges.length,
    assessmentCount: Object.keys(v4Model.assessments).length
  })
  
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
 * Universal import function that handles v2, v3 and v4 formats
 */
export function importDiagram(data: any): UMLModel {
  if (isV4Format(data)) {
    return data
  }
  
  if (isV3Format(data)) {
    return convertV3ToV4(data)
  }

  if (isV2Format(data)) {
    return convertV2ToV4(data)
  }

  throw new Error("Unsupported diagram format. Only 2.x.x, 3.x.x and 4.x.x formats are supported.")
}
