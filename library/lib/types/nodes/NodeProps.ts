import { ExtraElement } from "./ExtraElement"
import { ClassType } from "./enums"

export type ClassNodeProps = {
  methods: ExtraElement[]
  attributes: ExtraElement[]
  stereotype?: ClassType
  name: string
}

export type PackageNodeProps = {
  name: string
}
