import ReactDOM from "react-dom/client"
import { AppWithProvider } from "./App"
import {
  ReactFlowInstance,
  getViewportForBounds,
  getNodesBounds,
  type Node,
  type Edge,
} from "@xyflow/react"
import { toPng, toSvg } from "html-to-image"
export { type Node } from "@xyflow/react"

export enum FileFormat {
  SVG = "svg",
  PNG = "png",
}

export class Apollon2 {
  private root: ReactDOM.Root | null = null
  private reactFlowInstance: ReactFlowInstance<Node, Edge> | null = null

  constructor(element: HTMLElement) {
    this.root = ReactDOM.createRoot(element)
    this.root.render(
      <AppWithProvider onReactFlowInit={this.setReactFlowInstance.bind(this)} />
    )
  }

  private setReactFlowInstance(instance: ReactFlowInstance) {
    this.reactFlowInstance = instance
  }

  public getNodes(): Node[] {
    if (this.reactFlowInstance) {
      return this.reactFlowInstance.getNodes()
    }
    return []
  }

  public exportAsJson(diagramName: string) {
    if (this.reactFlowInstance) {
      const data = {
        version: "apollon2",
        title: diagramName,
        nodes: this.reactFlowInstance.getNodes(),
        edges: this.reactFlowInstance.getEdges(),
      }
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify(data)
      )}`
      const link = document.createElement("a")
      link.href = jsonString
      link.download = `${diagramName}.json`

      link.click()
    }
    return []
  }

  public exportImagePNG(
    diagramName: string,
    isBackgroundTransparent: boolean = false
  ) {
    if (this.reactFlowInstance) {
      const nodesBounds = getNodesBounds(this.reactFlowInstance.getNodes())
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

      const downloadDocument = document.querySelector(
        ".react-flow__viewport"
      ) as HTMLElement

      if (!downloadDocument) return

      const svgMarkers = document.getElementById("apollon2_svg-markers")
      if (svgMarkers) {
        downloadDocument.appendChild(svgMarkers)
      }

      console.log("DEBUG downloadDocument,", downloadDocument)

      toPng(downloadDocument, {
        backgroundColor: isBackgroundTransparent ? "transparent" : "white",
        width: width,
        height: height,
        style: {
          width: width.toString(),
          height: height.toString(),
          transform: `translate(${viewport.x + padding}px, ${viewport.y + padding}px) scale(${viewport.zoom})`,
        },
      }).then((res) => this.downloadImage(res, diagramName, FileFormat.PNG))
    }
  }
  public exportImageAsSVG(diagramName: string) {
    if (this.reactFlowInstance) {
      const nodesBounds = getNodesBounds(this.reactFlowInstance.getNodes())
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

      const downloadDocument = document.querySelector(
        ".react-flow__viewport"
      ) as HTMLElement

      if (!downloadDocument) return

      const svgMarkers = document.getElementById("apollon2_svg-markers")
      if (svgMarkers) {
        downloadDocument.appendChild(svgMarkers)
      }

      console.log("DEBUG downloadDocument,", downloadDocument)

      toSvg(downloadDocument, {
        backgroundColor: "white",
        width: width,
        height: height,
        style: {
          width: width.toString(),
          height: height.toString(),
          transform: `translate(${viewport.x + padding}px, ${viewport.y + padding}px) scale(${viewport.zoom})`,
        },
      }).then((res) => this.downloadImage(res, diagramName, FileFormat.SVG))
    }
  }

  public getEdges(): Edge[] {
    if (this.reactFlowInstance) {
      return this.reactFlowInstance.getEdges()
    }
    return []
  }

  public resetDiagram() {
    if (this.reactFlowInstance) {
      this.reactFlowInstance.setEdges([])
      this.reactFlowInstance.setNodes([])
    }
  }

  public dispose() {
    if (this.root) {
      this.root.unmount()
      this.root = null
    }
  }

  private downloadImage(
    dataUrl: string,
    diagramName: string,
    fileFormat: FileFormat
  ) {
    const a = document.createElement("a")

    a.setAttribute("download", `${diagramName}.${fileFormat}`)
    a.setAttribute("href", dataUrl)
    a.click()
  }
}
