import { Router, Request, Response } from "express"
import Diagram from "./models/Diagram"

const router = Router()

router.get("/:diagramID", async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Received request for diagram ID:", req.params.diagramID)
    const diagram = await Diagram.findById(req.params.diagramID)
    console.log("Found diagram:", diagram)
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
    const { id, version, title, type, nodes, edges } = req.body

    console.log("Received diagram data:", req.body)
    if (!id || !version || !title || !type) {
      return res
        .status(400)
        .json({ error: "ID, version, title, and diagramType are required" })
    }

    const existingDiagram = await Diagram.findById(id)

    if (existingDiagram) {
      // Option 1: Return error if diagram exists
      // return res.status(409).json({ error: "Diagram with this ID already exists" });

      // Option 2: Update existing diagram (uncomment if preferred)
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
    const { version, title, diagramType, nodes, edges } = req.body

    // Validate required fields
    if (!version || !title || !diagramType) {
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
          diagramType,
          nodes: nodes || [],
          edges: edges || [],
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

    console.log("Updated diagram:", updatedDiagram)
    res.status(200).json(updatedDiagram)
  } catch (error) {
    console.error("Error in updateDiagram endpoint:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
