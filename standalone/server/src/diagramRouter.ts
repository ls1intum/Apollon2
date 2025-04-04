import { Router } from "express"
import { getPersistence, WSSharedDoc } from "./utils"
import { Item } from "yjs"
import { database } from "./database"

const router = Router()

router.get("/:id", async (req, res: any) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        error: "Missing required parameter: id",
      })
    }

    const doc = await database.getYDoc(id)

    const nodeItems = doc.getMap("nodes")._map.values()
    const edgeItems = doc.getMap("edges")._map.values()
    const docMetadata = doc.getMap("diagramMetadata")

    const nodes = Array.from(nodeItems)
      .filter((node: Item) => !node.deleted)
      .map((node: Item) => {
        return node.content.getContent()[0]
      })

    const edges = Array.from(edgeItems)
      .filter((edge: Item) => !edge.deleted)
      .map((edge: Item) => {
        return edge.content.getContent()[0]
      })

    const metadata = {
      diagramName: docMetadata.get("diagramName"),
      diagramType: docMetadata.get("diagramType"),
    }

    res.status(200).json({
      message: "Diagram data retrieved successfully",
      data: { nodes, edges, metadata },
    })
  } catch (error) {
    console.error("Error in getDiagram endpoint:", error)
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.post("/", async (req, res: any) => {
  try {
    const { nodes, edges, metadata } = req.body

    if (!nodes || !edges || !metadata) {
      return res.status(400).json({
        error:
          "Missing required fields: nodes, edges and metadata are required",
      })
    }

    const docName = metadata.diagramId

    const newYDoc = new WSSharedDoc(docName)

    const docNodes = newYDoc.getMap("nodes")
    const docEdges = newYDoc.getMap("edges")
    const docMetadata = newYDoc.getMap("diagramMetadata")

    nodes.forEach((node: any) => {
      docNodes.set(node.id, node)
    })
    edges.forEach((edge: any) => {
      docEdges.set(edge.id, edge)
    })

    docMetadata.set("diagramName", metadata.diagramName)
    docMetadata.set("diagramType", metadata.diagramType)

    await getPersistence().writeState(docName, newYDoc)

    res.status(200).json({
      message: `Diagram data received successfully docName: ${docName}`,
      newDiagramId: docName,
    })
  } catch (error) {
    console.error("Error in setDiagram endpoint:", error)
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

export default router
