import { IPoint } from "@/edges/types"
import { ReactFlowInstance, type Node, type Edge, Rect } from "@xyflow/react"

// Define CSS variables to embed in the SVG
// Light theme variables
const cssVariables = `
    :root {
  --apollon2-primary: var(--apollon-primary, #3e8acc);
  --apollon2-primary-contrast: var(--apollon-primary-contrast, #212529);
  --apollon2-secondary: var(--apollon-secondary, #6c757d);
  --apollon2-alert-warning-yellow: var(--apollon-alert-warning-yellow, #ffc107);
  --apollon2-alert-warning-background: var(--apollon-alert-warning-background, #fff3cd);
  --apollon2-alert-warning-border: var(--apollon-alert-warning-border, #ffeeba);
  --apollon2-background: var(--apollon-background, white);
  --apollon2-background-inverse: var(--apollon-background-inverse, #000000);
  --apollon2-background-variant: var(--apollon-background-variant, #f8f9fa);
  --apollon2-gray: var(--apollon-gray, #e9ecef);
  --apollon2-grid: var(--apollon-grid, rgba(36, 39, 36, 0.1));
  --apollon2-gray-variant: var(--apollon-gray-variant, #495057);
  --apollon2-alert-danger-color: var(--apollon-alert-danger-color, #721c24);
  --apollon2-alert-danger-background: var(--apollon-alert-danger-background, #f8d7da);
  --apollon2-alert-danger-border: var(--apollon-alert-danger-border, #f5c6cb);
  --apollon2-switch-box-border-color: var(--apollon-switch-box-border-color, #dee2e6);
  --apollon2-list-group-color: var(--apollon-list-group-color, #ffffff);
  --apollon2-btn-outline-secondary-color: var(--apollon-btn-outline-secondary-color, #6c757d);
  --apollon2-modal-bottom-border: var(--apollon-modal-bottom-border, #e9ecef);
    }
    text {
      font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    }
  `

export const getSVG = (container: HTMLElement, clip: Rect): string => {
  const emptySVG = "<svg></svg>"

  const width = clip.width
  const height = clip.height

  const vp = container.querySelector(".react-flow__viewport")

  if (!vp) {
    console.warn("React Flow viewport not found")
    return emptySVG
  }

  console.debug("Viewport found, scanning for edges/nodes...", {
    viewportChildren: vp.children.length,
    nodeElements: vp.querySelectorAll(".react-flow__node").length,
    edgeElements: vp.querySelectorAll(".react-flow__edge").length,
  })

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

  // Get all edge elements
  const allEdgeElements = vp.querySelectorAll(".react-flow__edge")

  const MainEdgesGTag = document.createElement("g")
  mainSVG.appendChild(MainEdgesGTag)

  const edgeCircles = vp.querySelectorAll(".edge-circle")
  edgeCircles.forEach((circle) => circle.remove())

  // Log edge rendering status
  if (allEdgeElements.length === 0) {
    console.warn("[SVG Export] No edge elements found in viewport - edges may be missing from export")
    console.warn("[SVG Export] Viewport innerHTML sample:", vp.innerHTML.substring(0, 500))
  } else {
    console.debug(`[SVG Export] Found ${allEdgeElements.length} edge elements to export`)
  }

  // Add all SVG elements from each edge container
  // Deep clone the entire edge container to preserve all nested structure
  allEdgeElements.forEach((edgeContainer, index) => {
    const children = Array.from(edgeContainer.children)
    console.debug(`[SVG Export] Edge ${index}: ${children.length} children`)
    
    // Clone the entire edge element with all its children
    const clonedEdge = edgeContainer.cloneNode(true) as Element
    MainEdgesGTag.appendChild(clonedEdge)
  })

  console.debug(`[SVG Export] Added ${allEdgeElements.length} edges to SVG`)

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
