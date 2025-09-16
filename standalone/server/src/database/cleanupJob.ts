import cron from "node-cron"
import Diagram from "./models/Diagram"
import { log } from "../logger"

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

      log.debug(`Deleted ${result.deletedCount} diagrams older than 30 days.`)
    } catch (error) {
      log.error("Error during scheduled diagram cleanup:", error as Error)
    }
  })
}
