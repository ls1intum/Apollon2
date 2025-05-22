import { IPoint } from "@/edges/types"
import {
  ReactFlowInstance,
  getViewportForBounds,
  type Node,
  type Edge,
  Rect,
} from "@xyflow/react"

export const getSVG = (container: HTMLElement, bounds: Rect): string => {
  const emptySVG = "<svg></svg>"

  const margin = 10
  const clip = {
    x: bounds.x - margin,
    y: bounds.y - margin,
    width: bounds.width + 2 * margin,
    height: bounds.height + 2 * margin,
  }

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

  const vp = container.querySelector(".react-flow__viewport")

  if (!vp) return emptySVG

  const mainSVG = document.createElement("svg")
  mainSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  mainSVG.setAttribute(
    "viewBox",
    `${clip.x} ${clip.y} ${clip.width} ${clip.height}`
  )
  mainSVG.setAttribute("width", `${width}`)
  mainSVG.setAttribute("height", `${height}`)

  const svgMarkers = container
    .querySelector("#apollon2_svg-markers")
    ?.querySelector("defs")

  if (svgMarkers) {
    mainSVG.appendChild(svgMarkers)
  }

  const viewPointTranformation = document.createElement("g")
  viewPointTranformation.setAttribute(
    "transform",
    `translate(${viewport.x + padding}, ${viewport.y + padding}) scale(${viewport.zoom})`
  )
  mainSVG.appendChild(viewPointTranformation)

  // All nodoes and edges should be inside the viewPointTranformation

  const handles = vp.querySelectorAll(".react-flow__handle")
  handles.forEach((handle) => handle.remove())

  const MainNodesGTag = document.createElement("g")
  viewPointTranformation.appendChild(MainNodesGTag)
  const allNodes = vp.querySelectorAll(".react-flow__node")

  allNodes.forEach((node) => {
    const styles = extractStyles(node.getAttribute("style") ?? "")
    const newGTagForNode = document.createElement("g")
    const svgElement = node.querySelector("svg")

    newGTagForNode.setAttribute(
      "transform",
      `translate(${styles.transform.x}, ${styles.transform.y})`
    )
    if (svgElement) {
      newGTagForNode.appendChild(svgElement)
    }
    MainNodesGTag.appendChild(newGTagForNode)
  })
  const allEdges = vp.querySelectorAll(".react-flow__edge-path")

  const MainEdgesGTag = document.createElement("g")
  viewPointTranformation.appendChild(MainEdgesGTag)

  allEdges.forEach((edge) => MainEdgesGTag.appendChild(edge))

  return mainSVG.outerHTML
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

function extractStyles(styleString: string) {
  const transformMatch = styleString.match(
    /transform:\s*translate\((-?\d+\.?\d*)px,\s*(-?\d+\.?\d*)px\)/
  )
  const widthMatch = styleString.match(/width:\s*([^;]+)/)
  const heightMatch = styleString.match(/height:\s*([^;]+)/)

  const x = transformMatch ? parseFloat(transformMatch[1]) : 0
  const y = transformMatch ? parseFloat(transformMatch[2]) : 0

  return {
    transform: { x, y },
    width: widthMatch ? widthMatch[1].trim() : null,
    height: heightMatch ? heightMatch[1].trim() : null,
  }
}
