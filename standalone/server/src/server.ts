// First load environment variables from .env file
import "./loadEnvironment"
import express from "express"
import mongoose from "mongoose"
import { configureMiddlewares } from "./middlewares"
import diagramRouter from "./diagramRouter"
import { startSocketServer } from "./relaySocketServer"

const PORT = process.env.PORT || 8000
const serverHost = process.env.HOST || "localhost"
const mongoURI = process.env.MONGO_URI || "mongodb://db:27017/apollon2DB"
const app = express()

// Configure middlewares
configureMiddlewares(app)

// Mount routes
app.use("/api", diagramRouter)

console.log("Mongo URI:", mongoURI)
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB")
    // Start server

    app.listen(PORT, () => {
      console.log(`HTTP server running on http://${serverHost}:${PORT}`)
    })
    // Start WebSocket server
    startSocketServer()
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
    process.exit(1) // Exit if cannot connect to DB
  })
