import { Edge, EdgeProps } from "@xyflow/react"

export type CustomEdgeProps = {
  sourceRole: string | null
  sourceMultiplicity: string | null
  targetRole: string | null
  targetMultiplicity: string | null
}

export type ExtendedEdgeProps = EdgeProps<Edge<CustomEdgeProps>> & {
  markerEnd?: string
  markerPadding?: number
  strokeDashArray?: string
  type: string
}
