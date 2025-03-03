/* eslint-disable @typescript-eslint/no-require-imports */
const { setupWSConnection } = require("y-websocket/bin/utils")
const { Server } = require("ws")

const wss = new Server({ port: 4444 })

wss.on("connection", (ws, req) => {
  console.log("Client connected")
  setupWSConnection(ws, req)
})

console.log("Yjs WebSocket server running on ws://localhost:4444")
