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

export type ObjectNodeProps = {
  methods: ClassNodeElement[]
  attributes: ClassNodeElement[]
} & DefaultNodeProps

export type CommunicationObjectNodeProps = {
  methods: ClassNodeElement[]
  attributes: ClassNodeElement[]
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
