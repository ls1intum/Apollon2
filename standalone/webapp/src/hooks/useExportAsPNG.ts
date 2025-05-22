import { SVG } from "@tumaet/apollon"
import { useFileDownload } from "./useFileDownload"
import { useEditorContext } from "@/contexts"

type exportAsPNGOptions = {
  setWhiteBackground: boolean
}
export const useExportAsPNG = () => {
  const { editor } = useEditorContext()
  const downloadFile = useFileDownload()

  const exportAsPNG = async ({ setWhiteBackground }: exportAsPNGOptions) => {
    if (!editor) {
      console.error("Editor context is not available")
      return
    }

    const apollonSVG: SVG = await editor.exportAsSVG()

    const pngBlob = await convertRenderedSVGToPNG(
      apollonSVG,
      setWhiteBackground
    )
    const fileName = `${editor.model.title}.png`

    const fileToDownload = new File([pngBlob], fileName, {
      type: "image/png",
    })

    downloadFile({ file: fileToDownload, fileName })
  }

  return exportAsPNG
}

function convertRenderedSVGToPNG(
  renderedSVG: SVG,
  whiteBackground: boolean
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { width, height } = renderedSVG.clip

    const blob = new Blob([renderedSVG.svg], { type: "image/svg+xml" })
    const blobUrl = URL.createObjectURL(blob)

    const image = new Image()
    image.width = width
    image.height = height
    image.src = blobUrl

    image.onload = () => {
      const canvas = document.createElement("canvas")
      const scale = 1.5 // Adjust scale if necessary
      canvas.width = width * scale + 100
      canvas.height = height * scale + 100

      const context = canvas.getContext("2d")!

      if (whiteBackground) {
        context.fillStyle = "white"
        context.fillRect(0, 0, canvas.width, canvas.height)
      }

      context.scale(scale, scale)
      context.drawImage(image, 0, 0)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(blobUrl) // Cleanup the blob URL
        resolve(blob as Blob)
      })
    }

    image.onerror = (error) => {
      reject(error)
    }
  })
}
