// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useEffect, useState } from "react"
// import * as Y from "yjs"
// const ydoc = new Y.Doc()

// enum MessageType {
//   YjsSYNC = 0,
//   YjsUpdate = 1,
// }
// const ySharedNote = ydoc.getMap<string>("note")
// const ySharedNote2 = ydoc.getMap<{ id: string; name: string }>("note2")
// ySharedNote2.set("1", { id: "1", name: "test" })
// ySharedNote2.set("2", { id: "1", name: "test" })
// ySharedNote2.set("3", { id: "1", name: "test" })
// ySharedNote2.set("5", { id: "3", name: "test" })

// const CollabTextArea = () => {
//   const [note, setNote] = useState("")
//   const [note2, setNote2] = useState<{ id: string; name: string }>({
//     id: "",
//     name: "",
//   })

//   useEffect(() => {
//     // Initialize WebSocket
//     const ws = new WebSocket("ws://localhost:1111")

//     ws.onopen = () => {
//       ws.send(new Uint8Array([MessageType.YjsSYNC]))
//       console.log("Connected to WebSocket server")
//     }

//     ws.onmessage = (event: MessageEvent<Blob>) => {
//       event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
//         const data = new Uint8Array(buffer)
//         const messageType = data[0]

//         if (messageType === MessageType.YjsUpdate) {
//           const update = data.slice(1)
//           console.log("Received Yjs update:", update)
//           Y.applyUpdate(ydoc, update)
//         } else if (messageType === MessageType.YjsSYNC) {
//           const syncMessage = Y.encodeStateAsUpdate(ydoc)
//           const fullMessage = new Uint8Array(1 + syncMessage.length)
//           fullMessage[0] = MessageType.YjsUpdate
//           fullMessage.set(syncMessage, 1)
//           ws.send(fullMessage)
//         } else {
//           console.warn("Unknown message type:", messageType)
//         }
//       })
//     }
//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error)
//     }

//     ws.onclose = () => {
//       console.log("WebSocket closed")
//     }

//     // Observe Y.Map changes
//     ySharedNote.observe(() => {
//       const newNote = ySharedNote.get("note") || ""
//       console.log("Y.Map updated, note:", newNote)
//       setNote(newNote)
//     })
//     ySharedNote2.observe(() => {
//       const newNote2 = ySharedNote2.get("note") || { id: "", name: "" }
//       console.log("Y.Map updated, note2:", newNote2)
//       setNote2(newNote2)
//     })

//     // Send Yjs updates
//     ydoc.on("update", (update) => {
//       // console.log("Sending Yjs update:", update)
//       if (ws.readyState === WebSocket.OPEN) {
//         const fullMessage = new Uint8Array(1 + update.length)
//         fullMessage[0] = MessageType.YjsUpdate
//         fullMessage.set(update, 1)
//         ws.send(fullMessage)
//       }
//     })

//     // Clean up
//     return () => {
//       ws.close()
//       ydoc.destroy()
//     }
//   }, [])

//   const handleChange = (e: any) => {
//     const newValue = e.target.value
//     // console.log("Text area changed:", newValue)
//     ySharedNote.set("note", newValue)
//   }
//   const handleChange2 = (e: any) => {
//     const newValue = e.target.value
//     // console.log("Text area changed:", newValue)
//     ySharedNote2.set("note", { id: "1", name: newValue })
//   }

//   return (
//     <div>
//       <textarea
//         value={note}
//         onChange={handleChange}
//         placeholder="Collaborative text area"
//         style={{ width: "100%", height: "200px" }}
//       />
//       <textarea
//         value={note2.name}
//         onChange={handleChange2}
//         placeholder="Collaborative text area2"
//         style={{ width: "100%", height: "200px" }}
//       />
//     </div>
//   )
// }

// export default CollabTextArea

export default function CollabTextArea() {
  return <div />
}
