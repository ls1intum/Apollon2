import { IPoint } from "@/edges/types"
import {
  ReactFlowInstance,
  getViewportForBounds,
  type Node,
  type Edge,
  Rect,
} from "@xyflow/react"
import { toSvg } from "html-to-image"

export const getSVG = async (
  container: HTMLElement,
  bounds: Rect
): Promise<string> => {
  const emptySVG = "<svg></svg>"

  const viewport = getViewportForBounds(
    bounds,
    bounds.width,
    bounds.height,
    1,
    1,
    10
  )

  const padding = 50
  const width = bounds.width + 2 * padding
  const height = bounds.height + 2 * padding

  const downloadDocument = container.querySelector(
    ".react-flow__viewport"
  ) as HTMLElement

  if (!downloadDocument) return emptySVG

  const svgMarkers = document.getElementById("apollon2_svg-markers")
  if (svgMarkers) {
    downloadDocument.appendChild(svgMarkers)
  }

  const options = {
    backgroundColor: "white",
    width,
    height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${viewport.x + padding}px, ${viewport.y + padding}px) scale(${viewport.zoom})`,
    },
  }

  try {
    const dataUrl = await toSvg(downloadDocument, options)
    const prefix = "data:image/svg+xml;charset=utf-8,"
    const encodedSvg = dataUrl.replace(prefix, "")
    return decodeURIComponent(encodedSvg)
  } catch {
    console.error("Failed to export as SVG:")
    return emptySVG
  }
}

function getBoundingBox(edges: Edge[]) {
  const allPoints: IPoint[] = edges.flatMap(
    (edge) => (edge.data?.points as IPoint[]) ?? []
  )

  if (allPoints.length === 0) {
    return undefined // No points to calculate bounds
  }

  const xs = allPoints.map((p) => p.x)
  const ys = allPoints.map((p) => p.y)

  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

function mergeBounds(a: Rect, b: Rect): Rect {
  const minX = Math.min(a.x, b.x)
  const minY = Math.min(a.y, b.y)
  const maxX = Math.max(a.x + a.width, b.x + b.width)
  const maxY = Math.max(a.y + a.height, b.y + b.height)

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

export function getDiagramBounds(
  reactFlow: ReactFlowInstance<Node, Edge>
): Rect {
  const nodeBounds = reactFlow.getNodesBounds(reactFlow.getNodes())
  const edgeBounds = getBoundingBox(reactFlow.getEdges())

  if (!edgeBounds) return nodeBounds

  return mergeBounds(nodeBounds, edgeBounds)
}
