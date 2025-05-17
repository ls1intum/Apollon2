import {
  ReactFlowInstance,
  getViewportForBounds,
  getNodesBounds,
  type Node,
  type Edge,
  type Viewport,
} from "@xyflow/react"
import { toPng, toSvg } from "html-to-image"
import { PDFDocument } from "pdf-lib"
import { ExportFileFormat } from "../enums"
import { UMLModel } from "@/types/EditorOptions"

// Calculate dimensions based on nodes and viewport
const calculateDimensions = (
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
const captureAsImage = (
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
const downloadImage = (
  dataUrl: string,
  diagramName: string,
  fileFormat: ExportFileFormat
) => {
  const fileName = `${diagramName}.${fileFormat.toLowerCase()}`

  const link = document.createElement("a")
  link.href = dataUrl
  link.download = fileName
  link.click()
}

// Export the diagram as JSON
export const exportAsJSON = (model: UMLModel, diagramTitle: string) => {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(model)
  )}`
  const fileName = `${diagramTitle}.json`

  const link = document.createElement("a")
  link.href = jsonString
  link.download = fileName
  link.click()
}

// Export the diagram as PDF
export const exportAsPDF = async (
  diagramTitle: string,
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

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([width, height])

    // Embed the image in the PDF
    const pngImage = await pdfDoc.embedPng(dataUrl)
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width,
      height,
    })

    // Save the PDF and trigger download
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: "application/pdf" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${diagramTitle}.pdf`
    link.click()
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
