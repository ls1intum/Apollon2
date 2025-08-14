/**
 * Determines if a node type can be dropped into a parent node type
 * based on BPMN rules and constraints
 */
export const canDropIntoParent = (
  childType: string,
  parentType: string
): boolean => {
  // BPMN Pool constraints
  if (parentType === "bpmnPool") {
    // Pools can contain most BPMN elements
    return (
      childType === "bpmnTask" ||
      childType === "bpmnStartEvent" ||
      childType === "bpmnIntermediateEvent" ||
      childType === "bpmnEndEvent" ||
      childType === "bpmnGateway" ||
      childType === "bpmnSubprocess" ||
      childType === "bpmnTransaction" ||
      childType === "bpmnCallActivity" ||
      childType === "bpmnDataObject" ||
      childType === "bpmnDataStore" ||
      childType === "bpmnAnnotation" ||
      childType === "bpmnGroup"
    )
  }

  // BPMN Group constraints
  if (parentType === "bpmnGroup") {
    // Groups can contain any BPMN elements
    return childType.startsWith("bpmn")
  }

  // BPMN Subprocess constraints
  if (
    parentType === "bpmnSubprocess" ||
    parentType === "bpmnTransaction" ||
    parentType === "bpmnCallActivity"
  ) {
    // Subprocesses can contain most BPMN elements except pools
    return (
      childType === "bpmnTask" ||
      childType === "bpmnStartEvent" ||
      childType === "bpmnIntermediateEvent" ||
      childType === "bpmnEndEvent" ||
      childType === "bpmnGateway" ||
      childType === "bpmnSubprocess" ||
      childType === "bpmnTransaction" ||
      childType === "bpmnCallActivity" ||
      childType === "bpmnDataObject" ||
      childType === "bpmnDataStore" ||
      childType === "bpmnAnnotation" ||
      childType === "bpmnGroup"
    )
  }

  // For non-BPMN parent types, use existing logic
  // Package can contain classes and other packages
  if (parentType === "package") {
    return childType === "class" || childType === "package"
  }

  // Activity can contain activity nodes
  if (parentType === "activity") {
    return childType.startsWith("activity")
  }

  // Use Case System can contain use cases and actors
  if (parentType === "useCaseSystem") {
    return childType === "useCase" || childType === "useCaseActor"
  }

  // Component Subsystem can contain components and interfaces
  if (parentType === "componentSubsystem") {
    return (
      childType === "component" ||
      childType === "componentInterface" ||
      childType === "componentSubsystem"
    )
  }

  // Deployment Node can contain deployment components and other nodes
  if (parentType === "deploymentNode") {
    return (
      childType === "deploymentComponent" ||
      childType === "deploymentArtifact" ||
      childType === "deploymentInterface" ||
      childType === "deploymentNode"
    )
  }

  // Deployment Component can contain artifacts and interfaces
  if (parentType === "deploymentComponent") {
    return (
      childType === "deploymentArtifact" || childType === "deploymentInterface"
    )
  }

  // Default: allow dropping
  return true
}
