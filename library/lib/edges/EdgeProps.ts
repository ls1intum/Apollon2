import { Edge, EdgeProps } from "@xyflow/react"
import { IPoint } from "./Connection"

// Define message structure with direction
export interface MessageData {
  id: string
  text: string
  direction: "forward" | "backward" // forward = source to target, backward = target to source
}

export type CustomEdgeProps = {
  sourceRole: string | null
  sourceMultiplicity: string | null
  targetRole: string | null
  targetMultiplicity: string | null
  points: IPoint[]
  label?: string | null
  messages?: MessageData[] // For communication diagram edges with direction-aware messages
}

export type ExtendedEdgeProps = EdgeProps<Edge<CustomEdgeProps>> & {
  markerEnd?: string
  markerPadding?: number
  strokeDashArray?: string
  type: string
}
