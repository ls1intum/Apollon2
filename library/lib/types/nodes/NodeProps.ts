import { ClassType } from "./enums"

export type ClassNodeElement = {
  id: string
  name: string
}

export type ClassNodeProps = {
  methods: ClassNodeElement[]
  attributes: ClassNodeElement[]
  stereotype?: ClassType
  name: string
}

export type PackageNodeProps = {
  name: string
}
