import { useEditorContext } from "@/contexts"
import { jsPDF } from "jspdf"

export const useExportAsPDF = () => {
  const { editor } = useEditorContext()

  const exportAsPDF = async () => {
    if (!editor) return

    const ApollonSVG = await editor.exportAsSVG()

    const blob = new Blob([ApollonSVG.svg], {
      type: "image/svg+xml;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)

    const img = new Image()
    img.onload = () => {
      const scale = 2 // Increase for higher resolution

      const width = img.width
      const height = img.height

      const canvas = document.createElement("canvas")
      canvas.width = width * scale
      canvas.height = height * scale

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        console.error("Could not get canvas context")
        return
      }

      // Improve image quality
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.drawImage(img, 0, 0)

      const pngData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("l", "pt", [width, height])
      pdf.addImage(pngData, "PNG", 0, 0, width, height)

      const fileName = editor.getDiagramMetadata().diagramTitle || "diagram"
      pdf.save(`${fileName}.pdf`)

      URL.revokeObjectURL(url)
    }

    img.onerror = (e) => {
      console.error("Failed to load SVG image", e)
    }

    img.src = url
  }

  return exportAsPDF
}
