import { DragEvent } from "react"
import { v4 as uuidv4 } from "uuid"
import { ClassType, DropNodeData } from "@/types"
import { ClassSVG, PackageSVG } from "@/svgs"

const SideBarElementWidth = 100
const SideBarElementHeight = 55
const SideBarElementScale = 0.45

const onDragStart = (event: DragEvent, { type, data }: DropNodeData) => {
  event.dataTransfer.setData("text/plain", JSON.stringify({ type, data }))
  event.dataTransfer.effectAllowed = "move"
}

// Common configuration for sidebar elements
const sideBarElements = [
  {
    name: "Class",
    type: "class",
    stereotype: undefined,
  },
  {
    name: "Abstract",
    type: "class",
    stereotype: ClassType.Abstract,
  },
  {
    name: "Enumeration",
    type: "class",
    stereotype: ClassType.Enumeration,
  },
  {
    name: "Interface",
    type: "class",
    stereotype: ClassType.Interface,
  },
]

export const Sidebar = () => {
  return (
    <aside style={{ height: "100%", backgroundColor: "#f0f0f0" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          margin: "10px",
        }}
      >
        <div
          onDragStart={(event: DragEvent) =>
            onDragStart(event, {
              type: "package",
              data: {
                name: "Package",
              },
            })
          }
          draggable
          style={{ width: SideBarElementWidth, height: SideBarElementHeight }}
        >
          <PackageSVG
            width={SideBarElementWidth / SideBarElementScale}
            height={SideBarElementHeight / SideBarElementScale}
            name="Package"
            svgAttributes={{ transform: `scale(${SideBarElementScale})` }}
          />
        </div>
        {sideBarElements.map(({ name, type, stereotype }) => (
          <div
            key={name}
            style={{ width: SideBarElementWidth, height: SideBarElementHeight }}
            onDragStart={(event: DragEvent) =>
              onDragStart(event, {
                type,
                data: {
                  name,
                  methods: [{ id: uuidv4(), name: "+ method()" }],
                  attributes: [{ id: uuidv4(), name: "+ attribute: Type" }],
                  stereotype,
                },
              })
            }
            draggable
          >
            <ClassSVG
              width={SideBarElementWidth / SideBarElementScale}
              height={SideBarElementHeight / SideBarElementScale}
              methods={[{ id: uuidv4(), name: "+ method()" }]}
              attributes={[{ id: uuidv4(), name: "+ attribute: Type" }]}
              name={name}
              stereotype={stereotype}
              svgAttributes={{ transform: `scale(${SideBarElementScale})` }}
            />
          </div>
        ))}
      </div>
    </aside>
  )
}
