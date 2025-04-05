import { Server, WebSocket } from "ws"
import { setupWSConnection } from "./utils"

export function initializeWebSocketServer() {
  const wsServerPort = Number(process.env.WS_PORT) || 4444
  const wss = new Server({ port: wsServerPort })

  wss.on("connection", (ws: WebSocket, req: Request) => {
    console.log("Client connected")
    setupWSConnection(ws, req)
  })

  const serverHost = process.env.host || "localhost"
  console.log(
    `Yjs WebSocket server running on ws://${serverHost}//${wsServerPort}`
  )
}
