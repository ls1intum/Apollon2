import cron from "node-cron"
import Diagram from "./models/Diagram"

export const startDiagramCleanupJob = (): void => {
  // every day at 00:00 (midnight).
  // Schedule a cron job to delete diagrams older than 60 days
  cron.schedule("0 0 * * *", async () => {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - 60)

      const result = await Diagram.deleteMany({
        updatedAt: { $lt: cutoffDate },
      })

      console.log(`Deleted ${result.deletedCount} diagrams older than 30 days.`)
    } catch (error) {
      console.error("Error during scheduled diagram cleanup:", error)
    }
  })
}
