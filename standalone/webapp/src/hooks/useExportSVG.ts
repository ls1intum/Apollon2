import { sanitizeSVG } from "@/utils/svgUtils"
import { useFileDownload } from "./useFileDownload"
import { useEditorContext } from "@/contexts"

export const useExportSVG = () => {
  const { editor } = useEditorContext()
  const downloadFile = useFileDownload()

  const exportSVG = async () => {
    const apollonSVG = await editor?.exportAsSVG()
    if (!apollonSVG) {
      console.error("Failed to export SVG")
      return
    }
    const diagramTitle = editor?.model.title || "diagram"
    const fileName = `${diagramTitle}.svg`

    const sanitizedSVG = sanitizeSVG(apollonSVG.svg)
    const fileToDownload = new File([sanitizedSVG], fileName, {
      type: "image/svg+xml",
    })

    downloadFile({ file: fileToDownload, filename: fileName })
  }

  return exportSVG
}
