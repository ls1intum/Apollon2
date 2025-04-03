import express, { Router, Request, Response } from "express"
import { getYDoc } from "./utils"
import { Item } from "yjs"

const router: Router = express.Router()

interface DiagramData {
  title: string
  description: string
}

// POST /api/setDiagram
router.post("/setDiagram", (req, res: any) => {
  try {
    const { title, description } = req.body

    if (!title || !description) {
      return res.status(400).json({
        error: "Missing required fields: title and description are required",
      })
    }

    if (typeof title !== "string" || typeof description !== "string") {
      return res.status(400).json({
        error: "Invalid input: title and description must be strings",
      })
    }

    const diagramData: DiagramData & { timestamp: string } = {
      title,
      description,
      timestamp: new Date().toISOString(),
    }

    res.status(200).json({
      message: "Diagram data received successfully",
      data: diagramData,
    })
  } catch (error) {
    console.error("Error in setDiagram endpoint:", error)
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.get("/getDiagram/:id", (req, res: any) => {
  try {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({
        error: "Missing required parameter: id",
      })
    }
    const doc = getYDoc(id)
    // console.log("Shared diagram:", sharedDiagram)

    const nodes = doc.getMap("nodes")._map.values()
    const nodesArray = Array.from(nodes).filter((node: Item) => !node.deleted)

    console.log("Shared diagram aaa:", nodesArray)
    // console.log("Shared diagram stringifid:", JSON.stringify(sharedDiagram))
    res.status(200).json({
      message: "Diagram data retrieved successfully",
      data: "2",
    })
  } catch (error) {
    console.error("Error in getDiagram endpoint:", error)
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

export default router
