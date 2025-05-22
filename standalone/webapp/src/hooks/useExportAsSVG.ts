import { useFileDownload } from "./useFileDownload"
import { useEditorContext } from "@/contexts"

export const useExportAsSVG = () => {
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

    const fileToDownload = new File([apollonSVG.svg], fileName, {
      type: "image/svg+xml",
    })

    downloadFile({ file: fileToDownload, fileName })
  }

  return exportSVG
}
