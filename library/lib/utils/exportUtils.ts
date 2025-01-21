import {
  ReactFlowInstance,
  getViewportForBounds,
  getNodesBounds,
  type Node,
  type Edge,
  type Viewport,
} from "@xyflow/react"
import { toPng, toSvg } from "html-to-image"
import jsPDF from "jspdf"
import { ExportFileFormat } from "../enums"

// Calculate dimensions based on nodes and viewport
export const calculateDimensions = (
  reactFlowInstance: ReactFlowInstance<Node, Edge>
) => {
  const nodesBounds = getNodesBounds(reactFlowInstance.getNodes())
  const viewport = getViewportForBounds(
    nodesBounds,
    nodesBounds.width,
    nodesBounds.height,
    1,
    1,
    10
  )

  const padding = 50
  const width = nodesBounds.width + 2 * padding
  const height = nodesBounds.height + 2 * padding

  return { nodesBounds, viewport, padding, width, height }
}

// Prepare the download document by appending SVG markers
export const prepareDownloadDocument = (): HTMLElement | null => {
  const downloadDocument = document.querySelector(
    ".react-flow__viewport"
  ) as HTMLElement

  if (!downloadDocument) return null

  const svgMarkers = document.getElementById("apollon2_svg-markers")
  if (svgMarkers) {
    downloadDocument.appendChild(svgMarkers)
  }

  return downloadDocument
}

// Capture the element as an image (PNG or SVG)
export const captureAsImage = (
  element: HTMLElement,
  format: ExportFileFormat,
  width: number,
  height: number,
  viewport: Viewport,
  padding: number,
  isBackgroundTransparent?: boolean
): Promise<string> => {
  const options = {
    backgroundColor: isBackgroundTransparent ? "transparent" : "white",
    width,
    height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${viewport.x + padding}px, ${viewport.y + padding}px) scale(${viewport.zoom})`,
    },
  }

  if (format === ExportFileFormat.SVG) {
    return toSvg(element, options)
  } else {
    return toPng(element, options)
  }
}

// Trigger the download of the image
export const downloadImage = (
  dataUrl: string,
  diagramName: string,
  fileFormat: ExportFileFormat
) => {
  const link = document.createElement("a")
  link.setAttribute("download", `${diagramName}.${fileFormat.toLowerCase()}`)
  link.setAttribute("href", dataUrl)
  link.click()
}

// Export the diagram as JSON
export const exportAsJSON = (
  diagramName: string,
  reactFlowInstance: ReactFlowInstance<Node, Edge>
) => {
  const data = {
    version: "apollon2",
    title: diagramName,
    nodes: reactFlowInstance.getNodes(),
    edges: reactFlowInstance.getEdges(),
  }
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`
  const link = document.createElement("a")
  link.href = jsonString
  link.download = `${diagramName}.json`
  link.click()
}

// Export the diagram as PDF
export const exportAsPDF = async (
  diagramName: string,
  reactFlowInstance: ReactFlowInstance<Node, Edge>
) => {
  const { viewport, padding, width, height } =
    calculateDimensions(reactFlowInstance)
  const downloadDocument = prepareDownloadDocument()

  if (!downloadDocument) return

  try {
    const dataUrl = await captureAsImage(
      downloadDocument,
      ExportFileFormat.PNG, // Capture as PNG for PDF
      width,
      height,
      viewport,
      padding,
      false // White background
    )

    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "px",
      format: [width, height],
    })

    pdf.addImage(dataUrl, "PNG", 0, 0, width, height)
    pdf.save(`${diagramName}.pdf`)
  } catch (error) {
    console.error("Failed to export as PDF:", error)
  }
}

// Export the diagram as PNG
export const exportAsPNG = (
  diagramName: string,
  reactFlowInstance: ReactFlowInstance<Node, Edge>,
  isBackgroundTransparent: boolean = false
) => {
  const { viewport, padding, width, height } =
    calculateDimensions(reactFlowInstance)
  const downloadDocument = prepareDownloadDocument()

  if (!downloadDocument) return

  captureAsImage(
    downloadDocument,
    ExportFileFormat.PNG,
    width,
    height,
    viewport,
    padding,
    isBackgroundTransparent
  )
    .then((dataUrl) =>
      downloadImage(dataUrl, diagramName, ExportFileFormat.PNG)
    )
    .catch((error) => {
      console.error("Failed to export as PNG:", error)
    })
}

// Export the diagram as SVG
export const exportAsSVG = (
  diagramName: string,
  reactFlowInstance: ReactFlowInstance<Node, Edge>
) => {
  const { viewport, padding, width, height } =
    calculateDimensions(reactFlowInstance)
  const downloadDocument = prepareDownloadDocument()

  if (!downloadDocument) return

  captureAsImage(
    downloadDocument,
    ExportFileFormat.SVG,
    width,
    height,
    viewport,
    padding
  )
    .then((dataUrl) =>
      downloadImage(dataUrl, diagramName, ExportFileFormat.SVG)
    )
    .catch((error) => {
      console.error("Failed to export as SVG:", error)
    })
}
