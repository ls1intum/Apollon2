import { UMLModel, ApollonNode, ApollonEdge, Assessment } from "../typings"
import { UMLDiagramType } from "../types/DiagramType"
import { ClassType } from "../types/nodes/enums"
import { IPoint } from "../edges/Connection"

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
  [key: string]: unknown
}

interface V3Relationship {
  id: string
  name?: string
  type: string
  owner: string | null
  bounds: { x: number; y: number; width: number; height: number }
  path?: Array<{ x: number; y: number }>
  source: {
    direction: string
    element: string
    multiplicity?: string
    role?: string
  }
  target: {
    direction: string
    element: string
    multiplicity?: string
    role?: string
  }
  isManuallyLayouted?: boolean
  [key: string]: unknown
}

/**
 * Convert v3 handle directions to v4 handle IDs
 */
function convertV3HandleToV4(v3Handle: string): string {
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
function convertV3NodeTypeToV4(v3Type: string): string {
  const typeMap: Record<string, string> = {
    // Class Diagram - these all become 'class' but with different stereotypes
    'Class': 'class',
    'AbstractClass': 'class',
    'Interface': 'class', 
    'Enumeration': 'class',
    'Package': 'package',
    'ClassAttribute': 'classAttribute',
    'ClassMethod': 'classMethod',
    // Object Diagram  
    'ObjectName': 'objectName',
    // Activity Diagram
    'Activity': 'activity',
    'ActivityInitialNode': 'activityInitialNode',
    'ActivityFinalNode': 'activityFinalNode',
    'ActivityActionNode': 'activityActionNode',
    'ActivityObjectNode': 'activityObjectNode',
    'ActivityMergeNode': 'activityMergeNode',
    'ActivityForkNode': 'activityForkNode',
    'ActivityForkNodeHorizontal': 'activityForkNodeHorizontal',
    // Use Case Diagram
    'UseCase': 'useCase',
    'UseCaseActor': 'useCaseActor',
    'UseCaseSystem': 'useCaseSystem',
    // Communication Diagram
    'CommunicationObjectName': 'communicationObjectName',
    // Component Diagram
    'Component': 'component',
    'ComponentSubsystem': 'componentSubsystem',
    // Deployment Diagram
    'DeploymentNode': 'deploymentNode',
    'DeploymentComponent': 'deploymentComponent',
    // BPMN
    'BPMNTask': 'bpmnTask',
    'BPMNStartEvent': 'bpmnStartEvent',
    'BPMNIntermediateEvent': 'bpmnIntermediateEvent',
    'BPMNEndEvent': 'bpmnEndEvent',
    'BPMNGateway': 'bpmnGateway',
    'BPMNSubprocess': 'bpmnSubprocess',
    'BPMNTransaction': 'bpmnTransaction',
    'BPMNCallActivity': 'bpmnCallActivity',
    'BPMNAnnotation': 'bpmnAnnotation',
    'BPMNDataObject': 'bpmnDataObject',
    'BPMNDataStore': 'bpmnDataStore',
    'BPMNPool': 'bpmnPool',
    'BPMNGroup': 'bpmnGroup',
    // Petri Net
    'PetriNetPlace': 'petriNetPlace',
    'PetriNetTransition': 'petriNetTransition',
    // Other diagrams
    'FlowchartTerminal': 'flowchartTerminal',
    'FlowchartProcess': 'flowchartProcess',
    'FlowchartDecision': 'flowchartDecision',
    'FlowchartInputOutput': 'flowchartInputOutput',
    'FlowchartFunctionCall': 'flowchartFunctionCall',
    // Fallback
    'TitleAndDesctiption': 'titleAndDesctiption',
  }
  
  return typeMap[v3Type] || v3Type.toLowerCase()
}

/**
 * Convert v3 edge types to v4 edge types
 */
function convertV3EdgeTypeToV4(v3Type: string): string {
  const typeMap: Record<string, string> = {
    // Class Diagram
    'ClassAssociation': 'ClassAssociation',
    'ClassAggregation': 'ClassAggregation', 
    'ClassComposition': 'ClassComposition',
    'ClassInheritance': 'ClassInheritance',
    'ClassRealization': 'ClassRealization',
    'ClassBidirectional': 'ClassBidirectional',
    'ClassUnidirectional': 'ClassUnidirectional',
    'ClassDependency': 'ClassDependency',
    
    // Activity Diagram
    'ActivityControlFlow': 'ActivityControlFlow',
    
    // Object Diagram
    'ObjectLink': 'ObjectLink',
    
    // Communication Diagram  
    'CommunicationLink': 'CommunicationLink',
    
    // Component Diagram
    'ComponentAssociation': 'ComponentDependency', // v3 Association -> v4 Dependency
    'ComponentDependency': 'ComponentDependency',
    'ComponentInterfaceProvided': 'ComponentProvidedInterface', 
    'ComponentInterfaceRequired': 'ComponentRequiredInterface',
    'ComponentProvidedInterface': 'ComponentProvidedInterface', 
    'ComponentRequiredInterface': 'ComponentRequiredInterface',
    'ComponentRequiredThreeQuarterInterface': 'ComponentRequiredThreeQuarterInterface',
    'ComponentRequiredQuarterInterface': 'ComponentRequiredQuarterInterface',
    
    // Use Case Diagram
    'UseCaseAssociation': 'UseCaseAssociation',
    'UseCaseGeneralization': 'UseCaseGeneralization',
    'UseCaseInclude': 'UseCaseInclude',
    'UseCaseExtend': 'UseCaseExtend',
    
    // Deployment Diagram
    'DeploymentAssociation': 'DeploymentAssociation',
    'DeploymentDependency': 'DeploymentDependency',
    'DeploymentInterfaceProvided': 'DeploymentProvidedInterface',
    'DeploymentInterfaceRequired': 'DeploymentRequiredInterface',
    'DeploymentProvidedInterface': 'DeploymentProvidedInterface',
    'DeploymentRequiredInterface': 'DeploymentRequiredInterface',
    'DeploymentRequiredThreeQuarterInterface': 'DeploymentRequiredThreeQuarterInterface',
    'DeploymentRequiredQuarterInterface': 'DeploymentRequiredQuarterInterface',
    
    // BPMN
    'BPMNSequenceFlow': 'BPMNSequenceFlow',
    'BPMNMessageFlow': 'BPMNMessageFlow',
    'BPMNAssociation': 'BPMNAssociationFlow',
    'BPMNAssociationFlow': 'BPMNAssociationFlow',
    'BPMNDataAssociation': 'BPMNDataAssociationFlow',
    'BPMNDataAssociationFlow': 'BPMNDataAssociationFlow',
    
    // Petri Net
    'PetriNetFlow': 'PetriNetFlow', // Keep as is even if not in current types
    
    // Flowchart
    'FlowchartFlow': 'FlowChartFlowline',
    'FlowChartFlow': 'FlowChartFlowline',
    'FlowChartFlowline': 'FlowChartFlowline',
    
    // Syntax Tree
    'SyntaxTreeLink': 'SyntaxTreeLink',
    
    // SFC
    'SfcDiagramEdge': 'SfcDiagramEdge',
    
    // Reachability Graph
    'ReachabilityGraphArc': 'ReachabilityGraphArc',
  }
  
  return typeMap[v3Type] || v3Type
}

/**
 * Convert v3 diagram format to v4 UMLModel format
 */
export function convertV3ToV4(v3Data: V3DiagramFormat): UMLModel {
  const { id, title, model } = v3Data

  // First, separate main elements from child elements (attributes/methods)
  const mainElements: Record<string, V3Element> = {}
  const childElements: Record<string, V3Element> = {}

  Object.values(model.elements).forEach((element) => {
    if (['ClassAttribute', 'ClassMethod'].includes(element.type)) {
      childElements[element.id] = element
    } else {
      mainElements[element.id] = element
    }
  })

  // Convert main elements to nodes
  const nodes: ApollonNode[] = Object.values(mainElements).map((element) => {
    // Convert attributes from ID arrays to actual objects
    const attributes = element.attributes ? element.attributes.map(attrId => {
      const attrElement = childElements[attrId]
      return attrElement ? {
        id: attrElement.id,
        name: attrElement.name,
      } : null
    }).filter(Boolean) : []

    // Convert methods from ID arrays to actual objects  
    const methods = element.methods ? element.methods.map(methodId => {
      const methodElement = childElements[methodId]
      return methodElement ? {
        id: methodElement.id,
        name: methodElement.name,
      } : null
    }).filter(Boolean) : []

    // Calculate position - relative to parent if it has one
    let position = { x: element.bounds.x, y: element.bounds.y }
    
    if (element.owner) {
      const parentElement = mainElements[element.owner]
      if (parentElement) {
        // Convert absolute position to relative position
        position = {
          x: element.bounds.x - parentElement.bounds.x,
          y: element.bounds.y - parentElement.bounds.y,
        }
      }
    }

    // Determine stereotype for class-based nodes
    let stereotype: ClassType | undefined = undefined
    if (element.type === 'AbstractClass') {
      stereotype = ClassType.Abstract
    } else if (element.type === 'Interface') {
      stereotype = ClassType.Interface
    } else if (element.type === 'Enumeration') {
      stereotype = ClassType.Enumeration
    }

    const node: ApollonNode = {
      id: element.id,
      width: element.bounds.width,
      height: element.bounds.height,
      type: convertV3NodeTypeToV4(element.type) as any,
      position,
      data: {
        name: element.name,
        ...(stereotype && { stereotype }),
        ...(attributes.length > 0 && { attributes }),
        ...(methods.length > 0 && { methods }),
        // Copy any other properties from the v3 element (excluding structural ones)
        ...Object.fromEntries(
          Object.entries(element).filter(([key]) => 
            !['id', 'name', 'type', 'owner', 'bounds', 'attributes', 'methods'].includes(key)
          )
        ),
      },
      parentId: element.owner || undefined,
      measured: {
        width: element.bounds.width,
        height: element.bounds.height,
      },
    }

    return node
  })

  // Convert relationships to edges
  const edges: ApollonEdge[] = Object.values(model.relationships).map((relationship) => {
    // Convert v3 path (relative to bounds) to v4 points (absolute coordinates)
    const points: IPoint[] = relationship.path?.map(point => ({
      x: (relationship.bounds?.x || 0) + point.x,
      y: (relationship.bounds?.y || 0) + point.y,
    })) || []
    
    const edge: ApollonEdge = {
      id: relationship.id,
      source: relationship.source.element,
      target: relationship.target.element,
      type: convertV3EdgeTypeToV4(relationship.type) as any,
      sourceHandle: convertV3HandleToV4(relationship.source.direction || ""),
      targetHandle: convertV3HandleToV4(relationship.target.direction || ""),
      data: {
        name: relationship.name || "",
        // v4 requires points array for edge rendering with absolute coordinates
        ...(points.length > 0 && { points }),
        // Store source/target metadata
        sourceMultiplicity: relationship.source.multiplicity || "",
        targetMultiplicity: relationship.target.multiplicity || "",
        sourceRole: relationship.source.role || "",
        targetRole: relationship.target.role || "",
        isManuallyLayouted: relationship.isManuallyLayouted || false,
        // Copy bounds for positioning info (keeping for reference)
        bounds: relationship.bounds,
        // Copy any other properties from the v3 relationship
        ...Object.fromEntries(
          Object.entries(relationship).filter(([key]) => 
            !['id', 'name', 'type', 'owner', 'bounds', 'source', 'target', 'path', 'isManuallyLayouted'].includes(key)
          )
        ),
      },
    }

    return edge
  })

  // Convert assessments if they exist
  const assessments: { [id: string]: Assessment } = {}
  
  if (model.assessments) {
    for (const [key, value] of Object.entries(model.assessments)) {
      // Convert v3 assessment format to v4 if needed
      if (value && typeof value === 'object') {
        assessments[key] = value as Assessment
      }
    }
  }

  const v4Model: UMLModel = {
    version: "4.0.0",
    id: id,
    title: title,
    type: model.type as UMLDiagramType,
    nodes: nodes,
    edges: edges,
    assessments: assessments,
  }

  return v4Model
}

/**
 * Check if the input data is v3 format
 */
export function isV3Format(data: any): data is V3DiagramFormat {
  return (
    data &&
    typeof data === 'object' &&
    data.model &&
    data.model.version &&
    data.model.version.startsWith('3.') &&
    data.model.elements &&
    data.model.relationships
  )
}

/**
 * Check if the input data is v4 format
 */
export function isV4Format(data: any): data is UMLModel {
  return (
    data &&
    typeof data === 'object' &&
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
