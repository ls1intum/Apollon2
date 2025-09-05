import { IPoint } from "@/edges/types"
import { ReactFlowInstance, type Node, type Edge, Rect } from "@xyflow/react"

// Define CSS variables to embed in the SVG
// Light theme variables
const cssVariables = `
    :root {
      --apollon-primary: #3e8acc;
      --apollon-primary-contrast: #212529;
      --apollon-secondary: #6c757d;
      --apollon-alert-warning-yellow: #ffc107;
      --apollon-alert-warning-background: #fff3cd;
      --apollon-alert-warning-border: #ffeeba;
      --apollon-background: white;
      --apollon-background-inverse: #000000;
      --apollon-background-variant: #f8f9fa;
      --apollon-gray: #e9ecef;
      --apollon-grid: rgba(36, 39, 36, 0.1);
      --apollon-gray-variant: #495057;
      --apollon-alert-danger-color: #721c24;
      --apollon-alert-danger-background: #f8d7da;
      --apollon-alert-danger-border: #f5c6cb;
      --apollon-switch-box-border-color: #dee2e6;
      --apollon-list-group-color: #ffffff;
      --apollon-btn-outline-secondary-color: #6c757d;
      --apollon-modal-bottom-border: #e9ecef;
    }
  `

export const getSVG = (container: HTMLElement, clip: Rect): string => {
  const emptySVG = "<svg></svg>"

  const width = clip.width
  const height = clip.height

  const vp = container.querySelector(".react-flow__viewport")

  if (!vp) return emptySVG

  const SVG_NS = "http://www.w3.org/2000/svg"
  const mainSVG = document.createElementNS(SVG_NS, "svg")
  mainSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  mainSVG.appendChild(document.createElementNS(SVG_NS, "style")).textContent =
    cssVariables
  mainSVG.setAttribute("viewBox", `${clip.x} ${clip.y} ${width} ${height}`)
  mainSVG.setAttribute("width", `${width}`)
  mainSVG.setAttribute("height", `${height}`)

  const svgMarkers = container
    .querySelector("#apollon2_svg-markers")
    ?.querySelector("defs")

  if (svgMarkers) {
    mainSVG.appendChild(svgMarkers)
  }

  const handles = vp.querySelectorAll(".react-flow__handle")
  handles.forEach((handle) => handle.remove())

  const MainNodesGTag = document.createElement("g")
  mainSVG.appendChild(MainNodesGTag)
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
  mainSVG.appendChild(MainEdgesGTag)

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
