import mongoose from "mongoose"
import { log } from "../logger"

export const connectToMongoDB = async (mongoURI: string): Promise<void> => {
  try {
    await mongoose.connect(mongoURI)
    log.debug("Connected to MongoDB")
  } catch (error) {
    log.error("MongoDB connection error:", error as Error)
    throw error
  }
}
