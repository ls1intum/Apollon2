import { ClassType } from "./enums"

export type DefaultNodeProps = {
  name: string
}

export type ClassNodeElement = {
  id: string
  name: string
}

export type ClassNodeProps = {
  methods: ClassNodeElement[]
  attributes: ClassNodeElement[]
  stereotype?: ClassType
} & DefaultNodeProps

export type ComponentNodeProps = {
  isComponentHeaderShown: boolean
} & DefaultNodeProps

export type ComponentSubsystemNodeProps = {
  isComponentSubsystemHeaderShown: boolean
} & DefaultNodeProps

export type DeploymentNodeProps = {
  isComponentHeaderShown: boolean
  stereotype: string
} & DefaultNodeProps

export type DeploymentComponentProps = {
  isComponentHeaderShown: boolean
} & DefaultNodeProps

export type BPMNTaskType =
  | "default"
  | "user"
  | "send"
  | "receive"
  | "manual"
  | "business-rule"
  | "script"

export type BPMNMarkerType =
  | "none"
  | "parallel multi instance"
  | "sequential multi instance"
  | "loop"

export type BPMNTaskProps = DefaultNodeProps & {
  taskType: BPMNTaskType
  marker: BPMNMarkerType
}

export type BPMNStartEventType =
  | "default"
  | "message"
  | "timer"
  | "conditional"
  | "signal"

export type BPMNIntermediateEventType =
  | "default"
  | "message-catch"
  | "message-throw"
  | "timer-catch"
  | "escalation-throw"
  | "conditional-catch"
  | "link-catch"
  | "link-throw"
  | "compensation-throw"
  | "signal-catch"
  | "signal-throw"

export type BPMNEndEventType =
  | "default"
  | "message"
  | "escalation"
  | "error"
  | "compensation"
  | "signal"
  | "terminate"

export type BPMNStartEventProps = DefaultNodeProps & {
  eventType: BPMNStartEventType
}

export type BPMNIntermediateEventProps = DefaultNodeProps & {
  eventType: BPMNIntermediateEventType
}

export type BPMNEndEventProps = DefaultNodeProps & {
  eventType: BPMNEndEventType
}

export type BPMNGatewayType =
  | "complex"
  | "event-based"
  | "exclusive"
  | "inclusive"
  | "parallel"

export type BPMNGatewayProps = DefaultNodeProps & {
  gatewayType: BPMNGatewayType
}

export type BPMNSubprocessProps = DefaultNodeProps
export type BPMNTransactionProps = DefaultNodeProps
export type BPMNCallActivityProps = DefaultNodeProps
export type BPMNAnnotationProps = DefaultNodeProps
export type BPMNDataObjectProps = DefaultNodeProps
export type BPMNDataStoreProps = DefaultNodeProps
export type BPMNPoolProps = DefaultNodeProps
export type BPMNSwimlaneProps = DefaultNodeProps
export type BPMNGroupProps = DefaultNodeProps
