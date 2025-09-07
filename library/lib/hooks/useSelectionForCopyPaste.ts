import { useCallback } from "react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { generateUUID } from "@/utils"
import type { Node, Edge } from "@xyflow/react"

interface ClipboardData {
  nodes: Node[]
  edges: Edge[]
  timestamp: number
}

const PASTE_OFFSET = 20

export const useSelectionForCopyPaste = () => {
  const {
    nodes,
    edges,
    selectedElementIds,
    setSelectedElementsId,
    setNodes,
    setEdges,
  } = useDiagramStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      selectedElementIds: state.selectedElementIds,
      setSelectedElementsId: state.setSelectedElementsId,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
    }))
  )

  const hasSelectedElements = useCallback(() => {
    return selectedElementIds.length > 0
  }, [selectedElementIds])

  const selectAll = useCallback(() => {
    const allElementIds = [
      ...nodes.map((node) => node.id),
      ...edges.map((edge) => edge.id),
    ]

    setSelectedElementsId(allElementIds)

    setNodes(nodes.map((node) => ({ ...node, selected: true })))
    setEdges(edges.map((edge) => ({ ...edge, selected: true })))
  }, [nodes, edges, setSelectedElementsId, setNodes, setEdges])

  const clearSelection = useCallback(() => {
    setSelectedElementsId([])

    setNodes(nodes.map((node) => ({ ...node, selected: false })))
    setEdges(edges.map((edge) => ({ ...edge, selected: false })))
  }, [nodes, edges, setSelectedElementsId, setNodes, setEdges])

  const copySelectedElements = useCallback(async () => {
    if (selectedElementIds.length === 0) {
      return false
    }

    const selectedNodes = nodes.filter((node) =>
      selectedElementIds.includes(node.id)
    )
    const selectedEdges = edges.filter((edge) =>
      selectedElementIds.includes(edge.id)
    )

    const connectedEdges = edges.filter(
      (edge) =>
        selectedElementIds.includes(edge.source) &&
        selectedElementIds.includes(edge.target)
    )

    const allRelevantEdges = [...selectedEdges]
    connectedEdges.forEach((edge) => {
      if (!allRelevantEdges.some((e) => e.id === edge.id)) {
        allRelevantEdges.push(edge)
      }
    })

    const clipboardData: ClipboardData = {
      nodes: selectedNodes,
      edges: allRelevantEdges,
      timestamp: Date.now(),
    }

    try {
      const jsonString = JSON.stringify(clipboardData)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonString)
        return true
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }

    return false
  }, [selectedElementIds, nodes, edges])

  const pasteElements = useCallback(
    async (pasteCount: number = 1) => {
      try {
        let text: string
        if (navigator.clipboard && window.isSecureContext) {
          text = await navigator.clipboard.readText()
        } else {
          return false
        }

        const clipboardData = JSON.parse(text) as ClipboardData

        if (
          !clipboardData ||
          !Array.isArray(clipboardData.nodes) ||
          !Array.isArray(clipboardData.edges)
        ) {
          return false
        }

        const nodeIdMap = new Map<string, string>()
        const newElementIds: string[] = []
        const progressiveOffset = PASTE_OFFSET * pasteCount

        const pastedNodes = clipboardData.nodes.map((node: Node) => {
          const newId = generateUUID()
          nodeIdMap.set(node.id, newId)
          newElementIds.push(newId)

          return {
            ...node,
            id: newId,
            position: {
              x: node.position.x + progressiveOffset,
              y: node.position.y + progressiveOffset,
            },
            selected: true,
          }
        })

        const pastedEdges = clipboardData.edges
          .filter((edge: Edge) => {
            return nodeIdMap.has(edge.source) && nodeIdMap.has(edge.target)
          })
          .map((edge: Edge) => {
            const newId = generateUUID()
            newElementIds.push(newId)

            return {
              ...edge,
              id: newId,
              source: nodeIdMap.get(edge.source)!,
              target: nodeIdMap.get(edge.target)!,
              selected: true,
            }
          })

        setNodes([...nodes, ...pastedNodes])
        setEdges([...edges, ...pastedEdges])
        setSelectedElementsId(newElementIds)

        return true
      } catch (error) {
        console.error("Failed to paste from clipboard:", error)
        return false
      }
    },
    [nodes, edges, setNodes, setEdges, setSelectedElementsId]
  )

  return {
    selectedElementIds,
    hasSelectedElements,
    selectAll,
    clearSelection,
    copySelectedElements,
    pasteElements,
  }
}
