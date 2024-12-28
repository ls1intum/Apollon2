import { DragEvent } from "react"

import { v4 as uuidv4 } from "uuid"
import { ClassType, DropNodeData } from "@/types"
import { ClassSVG } from "@/svgs"

const onDragStart = (event: DragEvent, { type, data }: DropNodeData) => {
  event.dataTransfer.setData("text/plain", JSON.stringify({ type, data }))
  event.dataTransfer.effectAllowed = "move"
}

export const Sidebar = () => {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{ width: 100, height: 55 }}
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: "class",
            data: {
              methods: [{ id: uuidv4(), name: "+ method()" }],
              attributes: [{ id: uuidv4(), name: "+ attribute: Type" }],
            },
          })
        }
        draggable
      >
        <ClassSVG
          width={200}
          height={110}
          methods={[{ id: uuidv4(), name: "+ method()" }]}
          attributes={[{ id: uuidv4(), name: "+ attribute: Type" }]}
          name="Class"
          svgAttributes={{ transform: "scale(0.45)" }}
        />
      </div>
      <div
        style={{ width: 100, height: 55 }}
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: "class",
            data: {
              methods: [{ id: uuidv4(), name: "+ method()" }],
              attributes: [{ id: uuidv4(), name: "+ attribute: Type" }],
              stereotype: ClassType.Abstract,
            },
          })
        }
        draggable
      >
        <ClassSVG
          width={200}
          height={110}
          methods={[{ id: uuidv4(), name: "+ method()" }]}
          attributes={[{ id: uuidv4(), name: "+ attribute: Type" }]}
          name="Abstract"
          stereotype={ClassType.Abstract}
          svgAttributes={{ transform: "scale(0.45)" }}
        />
      </div>
      <div
        style={{ width: 100, height: 55 }}
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: "class",
            data: {
              methods: [{ id: uuidv4(), name: "+ method()" }],
              attributes: [{ id: uuidv4(), name: "+ attribute: Type" }],
              stereotype: ClassType.Enumeration,
            },
          })
        }
        draggable
      >
        <ClassSVG
          width={200}
          height={110}
          methods={[{ id: uuidv4(), name: "+ method()" }]}
          attributes={[{ id: uuidv4(), name: "+ attribute: Type" }]}
          name="Enumeration"
          stereotype={ClassType.Enumeration}
          svgAttributes={{ transform: "scale(0.45)" }}
        />
      </div>
      <div
        style={{ width: 100, height: 55 }}
        onDragStart={(event: DragEvent) =>
          onDragStart(event, {
            type: "class",
            data: {
              methods: [{ id: uuidv4(), name: "+ method()" }],
              attributes: [{ id: uuidv4(), name: "+ attribute: Type" }],
              stereotype: ClassType.Interface,
            },
          })
        }
        draggable
      >
        <ClassSVG
          width={200}
          height={110}
          methods={[{ id: uuidv4(), name: "+ method()" }]}
          attributes={[{ id: uuidv4(), name: "+ attribute: Type" }]}
          name="Interface"
          stereotype={ClassType.Interface}
          svgAttributes={{ transform: "scale(0.45)" }}
        />
      </div>
    </aside>
  )
}
