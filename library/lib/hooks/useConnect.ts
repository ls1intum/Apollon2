import {
  type Edge,
  Connection,
  useReactFlow,
  OnConnectEnd,
  OnConnectStart,
  OnConnectStartParams,
  OnEdgesDelete,
} from "@xyflow/react"
import { useCallback, useRef } from "react"
import { findClosestHandle, generateUUID } from "@/utils"
import { useBoundStore } from "@/store"
import { useShallow } from "zustand/shallow"

const EDGE_TYPE = "ClassBidirectional"

export const useConnect = () => {
  const startEdge = useRef<Edge | null>(null)
  const connectionStartParams = useRef<OnConnectStartParams | null>(null)
  const { screenToFlowPosition, getIntersectingNodes, getInternalNode } =
    useReactFlow()
  const { setEdges, addEdge } = useBoundStore(
    useShallow((state) => ({
      setEdges: state.setEdges,
      addEdge: state.addEdge,
    }))
  )
  const edges = useBoundStore((state) => state.edges)

  // Helper to get drop position from event
  const getDropPosition = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event
      return screenToFlowPosition(
        { x: clientX, y: clientY },
        { snapToGrid: false }
      )
    },
    [screenToFlowPosition]
  )

  const onConnectStart: OnConnectStart = (event, params) => {
    connectionStartParams.current = params
    const dropPosition = getDropPosition(event)

    const intersectingNodes = getIntersectingNodes({
      x: dropPosition.x - 60,
      y: dropPosition.y - 60,
      width: 120,
      height: 120,
    })
    const intersectingNodesIds = intersectingNodes.map((node) => node.id)

    // Find any existing edge from the source node/handle that targets one of the intersecting nodes
    const existingEdges = [
      ...edges.filter(
        (edge) =>
          edge.source === params.nodeId &&
          edge.sourceHandle === params.handleId &&
          intersectingNodesIds.includes(edge.target)
      ),
      ...edges.filter(
        (edge) =>
          edge.target === params.nodeId &&
          edge.targetHandle === params.handleId &&
          intersectingNodesIds.includes(edge.source)
      ),
    ]
    if (existingEdges.length > 0) {
      startEdge.current = existingEdges[existingEdges.length - 1]
    }
  }

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: generateUUID(),
        type: EDGE_TYPE,
        selected: true,
      }

      addEdge(newEdge)
    },
    [addEdge]
  )

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const dropPosition = getDropPosition(event)
        const intersectingNodes = getIntersectingNodes({
          x: dropPosition.x - 5,
          y: dropPosition.y - 5,
          width: 10,
          height: 10,
        })

        if (intersectingNodes.length === 0) return // Not dropped on any node

        // Choose the node on top (last in array)
        const nodeOnTop = intersectingNodes[intersectingNodes.length - 1]
        const internalNodeData = getInternalNode(nodeOnTop.id)

        if (!internalNodeData) return // safeguard against missing internal data

        const targetHandle = findClosestHandle(dropPosition, {
          x: internalNodeData.internals.positionAbsolute.x,
          y: internalNodeData.internals.positionAbsolute.y,
          width: nodeOnTop.width!,
          height: nodeOnTop.height!,
        })

        if (startEdge.current) {
          // Update existing edge with new target or source based on connection start handle type
          const updatedEdge = edges.find(
            (edge) => edge.id === startEdge.current?.id
          )

          if (!updatedEdge) return
          const newEdge =
            connectionStartParams.current?.handleType === "source"
              ? { ...updatedEdge, target: nodeOnTop.id, targetHandle }
              : {
                  ...updatedEdge,
                  source: nodeOnTop.id,
                  sourceHandle: targetHandle,
                }

          setEdges((eds) =>
            eds.map((edge) =>
              edge.id === newEdge.id ? { ...edge, ...newEdge } : edge
            )
          )
        } else {
          // No start edge exists: create a new one
          setEdges((eds) =>
            eds.concat({
              id: generateUUID(),
              source: connectionState.fromNode!.id,
              target: nodeOnTop.id,
              type: EDGE_TYPE,
              sourceHandle: connectionState.fromHandle?.id,
              targetHandle,
            })
          )
        }
      }
      startEdge.current = null
      connectionStartParams.current = null
    },
    [edges, getDropPosition, getIntersectingNodes, setEdges]
  )

  const onEdgesDelete: OnEdgesDelete = useCallback(() => {
    startEdge.current = null
    connectionStartParams.current = null
  }, [])

  return { onConnect, onConnectEnd, onConnectStart, onEdgesDelete }
}
