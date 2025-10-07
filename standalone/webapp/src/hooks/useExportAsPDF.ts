import { useEditorContext } from "@/contexts"
import { jsPDF } from "jspdf"
import { log } from "@/logger"
import { svg2pdf } from "svg2pdf.js"

export const useExportAsPDF = () => {
  const { editor } = useEditorContext()

  const exportAsPDF = async () => {
    if (!editor) return

    const ApollonSVG = await editor.exportAsSVG()

    // Parse the SVG string into a DOM element
    const parser = new DOMParser()
    const svgDoc = parser.parseFromString(ApollonSVG.svg, "image/svg+xml")
    const svgElement = svgDoc.documentElement as unknown as SVGSVGElement

    // Get dimensions from the SVG
    const width = ApollonSVG.clip.width
    const height = ApollonSVG.clip.height

    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation: width > height ? "l" : "p",
      unit: "pt",
      format: [width, height],
    })

    try {
      // Convert SVG to PDF
      await svg2pdf(svgElement, pdf, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      })

      const fileName = editor.getDiagramMetadata().diagramTitle || "diagram"
      pdf.save(`${fileName}.pdf`)
    } catch (e) {
      log.error("Failed to export PDF", e as unknown as Error)
    }
  }

  return exportAsPDF
}
