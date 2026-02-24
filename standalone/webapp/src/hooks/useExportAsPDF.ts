import { useEditorContext } from "@/contexts"
import { jsPDF } from "jspdf"
import { log } from "@/logger"
import { isPlatform } from "@ionic/react"
import { Filesystem, Directory } from "@capacitor/filesystem"
import { Share } from "@capacitor/share"

export const useExportAsPDF = () => {
  const { editor } = useEditorContext()

  const exportAsPDF = async () => {
    if (!editor) return

    try {
      const ApollonSVG = await editor.exportAsSVG()
      const { svg: svgString, clip } = ApollonSVG
      const width = clip.width
      const height = clip.height

      const fileName = editor.getDiagramMetadata().diagramTitle || "diagram"
      const pdfFileName = `${fileName}.pdf`

      const pdf = new jsPDF({
        orientation: width > height ? "l" : "p",
        unit: "pt",
        format: [width, height],
        compress: true,
        precision: 2,
      })

      if (isPlatform("ios") || isPlatform("android")) {
        // Render SVG to canvas for iOS
        const canvas = await renderSVGToCanvas(svgString, width, height)
        if (!canvas) {
          log.error("Failed to render SVG to canvas")
          return
        }

        const pngData = canvas.toDataURL("image/png")
        pdf.addImage(pngData, "PNG", 0, 0, width, height)

        try {
          // Get PDF as blob
          const pdfBlob = pdf.output("blob") as Blob

          // Convert blob to base64 for Filesystem storage
          const base64String = await blobToBase64(pdfBlob)

          // Write to cache directory - Capacitor will handle base64 data properly
          await Filesystem.writeFile({
            path: pdfFileName,
            data: base64String,
            directory: Directory.Cache,
          })

          // Get the file URI
          const fileUri = await Filesystem.getUri({
            directory: Directory.Cache,
            path: pdfFileName,
          })

          // Share the file
          await Share.share({
            title: "Export PDF",
            url: fileUri.uri,
            dialogTitle: "Save PDF to Files",
          })

          log.debug("PDF export initiated on iOS")
        } catch (error) {
          log.error("Failed to export PDF on iOS", error as Error)
        }
      } else {
        // Render SVG to canvas for web
        const canvas = await renderSVGToCanvas(svgString, width, height)
        if (!canvas) {
          log.error("Failed to render SVG to canvas")
          return
        }

        const pngData = canvas.toDataURL("image/png")
        pdf.addImage(pngData, "PNG", 0, 0, width, height)

        // Web download
        pdf.save(pdfFileName)
      }
    } catch (error) {
      log.error("Failed to export PDF", error as Error)
    }
  }

  return exportAsPDF
}

// Helper function to render SVG string to canvas for web
function renderSVGToCanvas(
  svgString: string,
  width: number,
  height: number
): Promise<HTMLCanvasElement | null> {
  return new Promise((resolve) => {
    const scale = 2
    const canvas = document.createElement("canvas")
    canvas.width = width * scale
    canvas.height = height * scale

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      log.error("Could not get canvas context")
      resolve(null)
      return
    }

    // Use data URL instead of blob URL for iOS compatibility
    const svgString_encoded = encodeURIComponent(svgString)
    const dataUrl = `data:image/svg+xml,${svgString_encoded}`

    const img = new Image()

    img.onload = () => {
      ctx.setTransform(scale, 0, 0, scale, 0, 0)
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas)
    }

    img.onerror = () => {
      log.error("Failed to load SVG image for PDF conversion")
      resolve(null)
    }

    img.src = dataUrl
  })
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(",")[1]
      resolve(base64String)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
