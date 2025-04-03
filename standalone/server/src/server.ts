import { Server, WebSocket } from "ws"
import { setupWSConnection, docs } from "./utils" // Assuming utils.ts exists or stays JS
import express, { Express } from "express"
import cors from "cors"
import diagramRouter from "./diagramRouter" // Assuming this is the correct path

const app: Express = express()

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())

// Mount the router at /api
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
