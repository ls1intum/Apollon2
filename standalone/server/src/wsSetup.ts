import { Server, WebSocket } from "ws"
import { setupWSConnection } from "./utils"

const serverHost = process.env.HOST || "localhost"

export function initializeWebSocketServer() {
  const wsServerPort = Number(process.env.WS_PORT) || 4444
  const wss = new Server({
    port: wsServerPort,
    host: serverHost,
  })

  wss.on("connection", (ws: WebSocket, req: Request) => {
    console.log("Client connected")
    setupWSConnection(ws, req)
  })

  console.log(
    `Yjs WebSocket server running on ws://${serverHost}//${wsServerPort}`
  )
}
