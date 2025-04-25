// First load environment variables from .env file
import "./loadEnvironment"
import express from "express"
import { configureMiddlewares } from "./middlewares"
import diagramRouter from "./diagramRouter"
import { startSocketServer } from "./relaySocketServer"

const PORT = process.env.PORT || 8000
const serverHost = process.env.HOST || "localhost"
const app = express()

// Configure middlewares
configureMiddlewares(app)

// Mount routes
app.use("/api", diagramRouter)

// Start WebSocket server
startSocketServer()

// Start server
app.listen(PORT, () => {
  console.log(`HTTP server running on http://${serverHost}:${PORT}`)
})
