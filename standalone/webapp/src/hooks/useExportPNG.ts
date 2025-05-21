import { SVG } from "@tumaet/apollon"
import { useFileDownload } from "./useFileDownload"
import { useEditorContext } from "@/contexts"
import { sanitizeSVG } from "@/utils/svgUtils"

type exportAsPNGOptions = {
  setWhiteBackground: boolean
}
export const useExportPNG = () => {
  const { editor } = useEditorContext()
  const downloadFile = useFileDownload()

  const exportAsPNG = async ({ setWhiteBackground }: exportAsPNGOptions) => {
    if (!editor) {
      console.error("Editor context is not available")
      return
    }

    const apollonSVG: SVG = await editor.exportAsSVG()

    const pngBlob: Blob = await convertRenderedSVGToPNG(
      apollonSVG,
      setWhiteBackground
    )
    const fileName = `${editor.model.title}.png`

    const fileToDownload = new File([pngBlob], fileName, {
      type: "image/png",
    })

    downloadFile({ file: fileToDownload, filename: fileName })
  }

  return exportAsPNG
}

function convertRenderedSVGToPNG(
  renderedSVG: SVG,
  whiteBackground: boolean
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById("canvas")! as HTMLCanvasElement

    const sanitizedSVG = sanitizeSVG(renderedSVG.svg)

    const svgBlob = new Blob(
      [`<?xml version="1.0" standalone="no"?>\r\n${sanitizedSVG}`],
      { type: "image/svg+xml;charset=utf-8" }
    )

    const url = URL.createObjectURL(svgBlob)
    const img = new Image()

    img.onload = () => {
      canvas.width = renderedSVG.clip.width
      canvas.height = renderedSVG.clip.height

      const ctx = canvas.getContext("2d")!
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (whiteBackground) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error("Canvas toBlob failed"))
        }
      }, "image/png")
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load SVG into Image"))
    }

    img.src = url
  })
}
