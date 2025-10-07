import { useEditorContext } from "@/contexts"
import { jsPDF } from "jspdf"
import { log } from "@/logger"

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
      const scale = 2

      const width = img.width
      const height = img.height

      const canvas = document.createElement("canvas")
      canvas.width = width * scale
      canvas.height = height * scale

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        log.error("Could not get canvas context")
        return
      }

      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.drawImage(img, 0, 0)

      const pngData = canvas.toDataURL("image/png")

      const pdf = new jsPDF({
        orientation: "l",
        unit: "pt",
        format: [width, height],
        compress: true,
        precision: 2,
      })

      pdf.addImage(pngData, "PNG", 0, 0, width, height)

      const fileName = editor.getDiagramMetadata().diagramTitle || "diagram"
      pdf.save(`${fileName}.pdf`)

      URL.revokeObjectURL(url)
    }

    img.onerror = (e) => {
      log.error("Failed to load SVG image", e as unknown as Error)
    }

    img.src = url
  }

  return exportAsPDF
}
