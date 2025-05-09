/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from "express"
import Diagram from "./models/Diagram"

const router = Router()

router.get("/:diagramID", async (req: Request, res: Response): Promise<any> => {
  try {
    const diagram = await Diagram.findById(req.params.diagramID)
    if (!diagram) {
      return res.status(404).json({ error: "Diagram not found" })
    }

    res.status(200).json(diagram)
  } catch (error) {
    console.error("Error in getDiagram endpoint:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, version, title, type, nodes, edges, assessments } = req.body

    if (!id || !version || !title || !type) {
      return res
        .status(400)
        .json({ error: "ID, version, title, and diagramType are required" })
    }

    const existingDiagram = await Diagram.findById(id)

    if (existingDiagram) {
      const updatedDiagram = await Diagram.findByIdAndUpdate(
        id,
        { version, title, type, nodes, edges },
        { new: true } // Return updated document
      )
      return res.status(200).json(updatedDiagram)
    }

    const newDiagram = new Diagram({
      _id: id,
      version,
      title,
      type,
      nodes: nodes || [],
      edges: edges || [],
      assessments: assessments || {},
    })

    const savedDiagram = await newDiagram.save()
    res.status(201).json(savedDiagram)
  } catch (error) {
    console.error("Error in setDiagram endpoint:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

router.put("/:diagramID", async (req: Request, res: Response): Promise<any> => {
  try {
    const { version, title, type, nodes, edges, assessments } = req.body

    // Validate required fields
    if (!version || !title || !type) {
      return res
        .status(400)
        .json({ error: "Version, title, and diagramType are required" })
    }

    // Update diagram
    const updatedDiagram = await Diagram.findByIdAndUpdate(
      req.params.diagramID,
      {
        $set: {
          version,
          title,
          type,
          nodes: nodes || [],
          edges: edges || [],
          assessments: assessments || {},
        },
      },
      {
        new: true, // Return updated document
        runValidators: true, // Ensure schema validation
      }
    )

    if (!updatedDiagram) {
      return res.status(404).json({ error: "Diagram not found" })
    }

    res.status(200).json(updatedDiagram)
  } catch (error) {
    console.error("Error in updateDiagram endpoint:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
