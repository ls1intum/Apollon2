// First load environment variables from .env file
import dotenv from "dotenv"
dotenv.config()

import express, { Express } from "express"
import { configureMiddleware } from "./middleware"
import { initializeWebSocketServer } from "./wsSetup"
import diagramRouter from "./diagramRouter"

// Load environment variables
dotenv.config()

const app: Express = express()

// Configure middleware
configureMiddleware(app)

// Mount routes
app.use("/diagram", diagramRouter)

// Start WebSocket server
initializeWebSocketServer()

const PORT = process.env.PORT || 8000
const serverHost = process.env.HOST || "localhost"
// Start server
app.listen(PORT, () => {
  console.log(`HTTP server running on http://${serverHost}:${PORT}`)
})
