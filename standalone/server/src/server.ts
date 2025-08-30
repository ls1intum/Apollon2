// First load environment variables from .env file
import "./loadEnvironment"
import express from "express"
import { configureMiddlewares } from "./middlewares"
import diagramRouter from "./diagramRouter"
import { startSocketServer } from "./relaySocketServer"
import { connectToMongoDB } from "./database/connect"
import { startDiagramCleanupJob } from "./database/cleanupJob"

const PORT = process.env.PORT || 8000
const serverHost = process.env.HOST || "localhost"
// Default to localhost for local dev; Docker Compose sets MONGO_URI accordingly
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/apollon2DB"
const app = express()

// Configure middlewares
configureMiddlewares(app)

// Mount routes
app.use("/api", diagramRouter)

// Start servers immediately for a fast dev feedback loop
app.listen(PORT, () => {
  console.log(`HTTP server running on http://${serverHost}:${PORT}`)
})
startSocketServer()
startDiagramCleanupJob()

// Connect to DB in background; log status but don't block server startup
connectToMongoDB(mongoURI)
  .then(() => {
    console.log("Database connected")
  })
  .catch((err) => {
    console.warn(
      "Database not connected. Continuing without DB:",
      (err as Error)?.message || err
    )
  })
