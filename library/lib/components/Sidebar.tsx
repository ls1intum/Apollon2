import React, { FC, useCallback, useEffect, useState } from "react"
import {
  DropElementConfig,
  dropElementConfigs,
  transformScale,
} from "@/constants/dropElementConfig"
import { DividerLine } from "./DividerLine"
import { DiagramType, DropNodeData } from "@/types"
import { createPortal } from "react-dom"
import { useReactFlow, type Node } from "@xyflow/react"
import { MOUSE_UP_OFFSET_IN_PIXELS } from "@/constants"
import { useBoundStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { generateUUID, getPositionOnCanvas, resizeAllParents } from "@/utils"

/* ========================================================================
   Utility functions to manage page scrolling during dragging
   ======================================================================== */
const disableScroll = () => {
  document.body.style.overflow = "hidden"
  document.body.style.touchAction = "none"
}

const enableScroll = () => {
  document.body.style.overflow = ""
  document.body.style.touchAction = ""
}

/* ========================================================================
   Sidebar Component
   Renders the draggable elements based on the selected diagram type.
   ======================================================================== */
interface SidebarProps {
  selectedDiagramType: DiagramType
}

export const Sidebar: FC<SidebarProps> = ({ selectedDiagramType }) => {
  return (
    <aside style={{ height: "100%", backgroundColor: "#f0f0f0" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          margin: "10px",
        }}
      >
        {dropElementConfigs[selectedDiagramType].map((config) => (
          <React.Fragment key={`${config.type}_${config.defaultData.name}`}>
            {config.type === "colorDescription" && (
              <DividerLine style={{ margin: "3px 0" }} height={2} />
            )}
            <DraggableGhost dropElementConfig={config}>
              <div
                className="prevent-select"
                style={{
                  width: config.width * transformScale,
                  height: config.height * transformScale,
                  overflow: "hidden",
                  zIndex: 2,
                }}
              >
                {React.createElement(config.svg, {
                  width: config.width,
                  height: config.height,
                  ...config.defaultData,
                  transformScale,
                  id: "2",
                })}
              </div>
            </DraggableGhost>
          </React.Fragment>
        ))}
      </div>
    </aside>
  )
}

/* ========================================================================
   DraggableGhost Component
   Wraps a child element with drag & drop behavior and drop logic.
   ======================================================================== */
interface DraggableGhostProps {
  children: React.ReactNode
  dropElementConfig: DropElementConfig
}

const DraggableGhost: React.FC<DraggableGhostProps> = ({
  children,
  dropElementConfig,
}) => {
  // Hooks from react-flow and zustand store for node management
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow()
  const { setNodes, nodes } = useBoundStore(
    useShallow((state) => ({ setNodes: state.setNodes, nodes: state.nodes }))
  )

  // Local state to track drag status, ghost position, and pointer offset
  const [isDragging, setIsDragging] = useState(false)
  const [ghostPosition, setGhostPosition] = useState({ x: 0, y: 0 })
  const [clickOffset, setClickOffset] = useState({ x: 0, y: 0 })

  /* ----------------------------------------------------------------------
     onDrop: Handles the pointer up event by calculating the drop position,
     checking boundaries, and creating/updating the new node.
     ---------------------------------------------------------------------- */
  const onDrop = useCallback(
    (event: PointerEvent) => {
      event.preventDefault()

      const canvas = document.getElementById("react-flow-library")
      if (!canvas) {
        console.warn("Canvas element not found")
        return
      }

      // Convert drop position from screen to flow coordinates (with grid snapping)
      const dropPosition = screenToFlowPosition(
        { x: event.clientX, y: event.clientY },
        { snapToGrid: true }
      )

      // Check if the drop occurred outside the canvas bounds
      const canvasBounding = canvas.getBoundingClientRect()
      const isOutsideCanvas =
        event.clientX < canvasBounding.left ||
        event.clientY < canvasBounding.top ||
        event.clientX > canvasBounding.right ||
        event.clientY > canvasBounding.bottom

      if (isOutsideCanvas) {
        console.warn("Drop cancelled: Outside canvas or on sidebar")
        return
      }

      // Prepare the drop data including offset adjustments
      const dropData: DropNodeData = {
        type: dropElementConfig.type,
        data: dropElementConfig.defaultData,
        offsetX: clickOffset.x / transformScale,
        offsetY: clickOffset.y / transformScale,
      }

      // Adjust node position based on pointer offset
      const position = {
        x: dropPosition.x - dropData.offsetX,
        y: dropPosition.y - dropData.offsetY,
      }

      // Find potential parent node by checking intersections with "package" type nodes
      const intersectingNodes = getIntersectingNodes({
        x: dropPosition.x,
        y: dropPosition.y,
        width: MOUSE_UP_OFFSET_IN_PIXELS,
        height: MOUSE_UP_OFFSET_IN_PIXELS,
      }).filter((node) => node.type === "package")
      const parentNode = intersectingNodes[intersectingNodes.length - 1]
      const parentId = parentNode ? parentNode.id : undefined

      // Create the new node with a unique ID and calculated position
      const newNode: Node = {
        id: generateUUID(),
        width: dropElementConfig.width,
        height: dropElementConfig.height,
        type: dropData.type,
        position: { ...position },
        data: { ...dropElementConfig.defaultData, ...dropData.data },
        parentId,
      }

      // Adjust position relative to parent if a parent exists
      if (parentId) {
        const parentPositionOnCanvas = getPositionOnCanvas(parentNode, nodes)
        newNode.position.x -= parentPositionOnCanvas.x
        newNode.position.y -= parentPositionOnCanvas.y
      }

      // Update nodes and resize parent nodes if necessary
      const updatedNodes = [...nodes, newNode]
      if (parentId) {
        resizeAllParents(newNode, updatedNodes)
      }
      setNodes(updatedNodes)
    },
    [
      screenToFlowPosition,
      setNodes,
      getIntersectingNodes,
      nodes,
      clickOffset.x,
      clickOffset.y,
      dropElementConfig,
    ]
  )

  /* ----------------------------------------------------------------------
     Pointer Event Handlers
     ---------------------------------------------------------------------- */
  // Initiate drag: disable scrolling and record click offset
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    disableScroll()

    const elementRect = (event.target as HTMLElement).getBoundingClientRect()
    const offsetX = event.clientX - elementRect.left
    const offsetY = event.clientY - elementRect.top

    setClickOffset({ x: offsetX, y: offsetY })
    setGhostPosition({ x: event.clientX - offsetX, y: event.clientY - offsetY })
    setIsDragging(true)
  }

  // Update ghost position during dragging
  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging) return
    setGhostPosition({
      x: event.clientX - clickOffset.x,
      y: event.clientY - clickOffset.y,
    })
  }

  // End dragging: re-enable scrolling, reset state, and trigger drop logic
  const handlePointerUp = (event: PointerEvent) => {
    enableScroll()
    setIsDragging(false)
    setGhostPosition({ x: 0, y: 0 })
    onDrop(event)
  }

  /* ----------------------------------------------------------------------
     Attach global pointer event listeners when dragging
     ---------------------------------------------------------------------- */
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("pointermove", handlePointerMove)
      document.addEventListener("pointerup", handlePointerUp)
    } else {
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", handlePointerUp)
    }
    return () => {
      document.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerup", handlePointerUp)
    }
  }, [isDragging, clickOffset, onDrop])

  /* ----------------------------------------------------------------------
     Render the ghost element via a portal when dragging
     ---------------------------------------------------------------------- */
  const ghostElement = (
    <div
      style={{
        position: "absolute",
        left: `${ghostPosition.x}px`,
        top: `${ghostPosition.y}px`,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0.8,
      }}
    >
      {children}
    </div>
  )

  return (
    <>
      <div onPointerDown={handlePointerDown}>{children}</div>
      {isDragging && createPortal(ghostElement, document.body)}
    </>
  )
}
