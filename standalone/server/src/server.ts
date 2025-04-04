// First load environment variables from .env file
import dotenv from "dotenv"
dotenv.config()

import { Server, WebSocket } from "ws"
import { setupWSConnection } from "./utils" // Assuming utils.ts exists or stays JS
import express, { Express } from "express"
import cors from "cors"
import diagramRouter from "./diagramRouter" // Assuming this is the correct path

const app: Express = express()

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || ""], // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
)
app.use(express.json())

// Mount the diagram router
app.use("/diagram", diagramRouter)

const wss = new Server({ port: Number(process.env.WSSPORT) || 4444 })

wss.on("connection", (ws: WebSocket, req: Request) => {
  console.log("Client connected")
  setupWSConnection(ws, req)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`)
})

console.log("Yjs WebSocket server running on ws://localhost:4444")
