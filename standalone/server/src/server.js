const { Server } = require("ws")
const { setupWSConnection } = require("./utils")

const wss = new Server({ port: 3000 })

wss.on("connection", (ws, req) => {
  console.log("Client connected")
  setupWSConnection(ws, req)
})

console.log("Yjs WebSocket server running on ws://localhost:3000")
