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
