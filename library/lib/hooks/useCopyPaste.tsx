import { useCallback } from "react"
import { useDiagramStore } from "../store"
import { useShallow } from "zustand/shallow"
import { useClipboard } from "./useClipboard"
import { generateUUID } from "../utils"

const PASTE_OFFSET = 20

export const useCopyPaste = () => {
  const {
    nodes,
    edges,
    selectedElementIds,
    addNode,
    addEdge,
    setSelectedElementsId,
  } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      selectedElementIds: state.selectedElementIds,
      addNode: state.addNode,
      addEdge: state.addEdge,
      setSelectedElementsId: state.setSelectedElementsId,
    }))
  )

  const { copyToClipboard, readFromClipboard } = useClipboard()

  const copySelectedElements = useCallback(async () => {
    if (selectedElementIds.length === 0) {
      return false
    }

    // Get selected nodes and their connected edges
    const selectedNodes = nodes.filter((node) =>
      selectedElementIds.includes(node.id)
    )
    const selectedEdges = edges.filter((edge) =>
      selectedElementIds.includes(edge.id)
    )

    // Also include edges that connect selected nodes
    const connectedEdges = edges.filter(
      (edge) =>
        selectedElementIds.includes(edge.source) &&
        selectedElementIds.includes(edge.target)
    )

    // Combine selected edges and connected edges (remove duplicates)
    const allRelevantEdges = [...selectedEdges]
    connectedEdges.forEach((edge) => {
      if (!allRelevantEdges.some((e) => e.id === edge.id)) {
        allRelevantEdges.push(edge)
      }
    })

    const clipboardData = {
      nodes: selectedNodes,
      edges: allRelevantEdges,
      timestamp: Date.now(),
    }

    return await copyToClipboard(clipboardData)
  }, [selectedElementIds, nodes, edges, copyToClipboard])

  const pasteElements = useCallback(async () => {
    const clipboardData = await readFromClipboard()

    if (!clipboardData) {
      return false
    }

    // Create ID mappings for nodes
    const nodeIdMap = new Map<string, string>()
    const newNodeIds: string[] = []

    // Clone and paste nodes with new IDs and offset positions
    const pastedNodes = clipboardData.nodes.map((node) => {
      const newId = generateUUID()
      nodeIdMap.set(node.id, newId)
      newNodeIds.push(newId)

      return {
        ...node,
        id: newId,
        position: {
          x: node.position.x + PASTE_OFFSET,
          y: node.position.y + PASTE_OFFSET,
        },
        selected: true, // Select pasted elements
      }
    })

    // Clone and paste edges with updated source/target IDs
    const pastedEdges = clipboardData.edges
      .filter((edge) => {
        // Only paste edges where both source and target nodes are being pasted
        return nodeIdMap.has(edge.source) && nodeIdMap.has(edge.target)
      })
      .map((edge) => {
        const newId = generateUUID()
        newNodeIds.push(newId)

        return {
          ...edge,
          id: newId,
          source: nodeIdMap.get(edge.source)!,
          target: nodeIdMap.get(edge.target)!,
          selected: true, // Select pasted elements
        }
      })

    // Add pasted elements to the diagram
    pastedNodes.forEach((node) => addNode(node))
    pastedEdges.forEach((edge) => addEdge(edge))

    // Select the pasted elements
    setSelectedElementsId(newNodeIds)

    return true
  }, [readFromClipboard, addNode, addEdge, setSelectedElementsId])

  return {
    copySelectedElements,
    pasteElements,
    hasSelectedElements: selectedElementIds.length > 0,
  }
}
