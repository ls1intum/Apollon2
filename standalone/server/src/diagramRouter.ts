import { Router } from "express"

const router = Router()

router.get("/:diagramID", async (req, res: any) => {
  try {
  } catch (error) {
    console.error("Error in getDiagram endpoint:", error)
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.post("/", async (req, res: any) => {
  try {
  } catch (error) {
    console.error("Error in setDiagram endpoint:", error)
    res.status(500).json({
      error: "Internal server error",
    })
  }
})

export default router
