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
const mongoURI = process.env.MONGO_URI || "mongodb://db:27017/apollon2DB"
const app = express()

// Configure middlewares
configureMiddlewares(app)

// Mount routes
app.use("/api", diagramRouter)

connectToMongoDB(mongoURI).then(() => {
  app.listen(PORT, () => {
    console.log(`HTTP server running on http://${serverHost}:${PORT}`)
  })

  startSocketServer()
  startDiagramCleanupJob()
})
