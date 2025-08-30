import mongoose from "mongoose"

export const connectToMongoDB = async (mongoURI: string): Promise<void> => {
  try {
    await mongoose.connect(mongoURI)
    console.log("Connected to MongoDB")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}
