// First load environment variables from .env file
import "./loadEnvironment"
import express from "express"
import { configureMiddleware } from "./middlewares/middleware"
import diagramRouter from "./diagramRouter"
import { startSocketServer } from "./relaySocketServer"

const PORT = process.env.PORT || 8000
const serverHost = process.env.HOST || "localhost"
const app = express()

// Configure middleware
configureMiddleware(app)

// Mount routes
app.use("/api", diagramRouter)

// Start WebSocket server
startSocketServer()

// Start server
app.listen(PORT, () => {
  console.log(`HTTP server running on http://${serverHost}:${PORT}`)
})
