import { useCallback } from "react"
import { useDiagramStore } from "@/store/context"
import { useShallow } from "zustand/shallow"
import { generateUUID, sortNodesTopologically } from "@/utils"
import type { Node, Edge } from "@xyflow/react"

interface ClipboardData {
  nodes: Node[]
  edges: Edge[]
  parentChildRelations: Array<{
    parentId: string
    childId: string
    relativePosition: { x: number; y: number }
  }>
  timestamp: number
}

const PASTE_OFFSET = 20

// Helper function to calculate relative position of child to parent
const calculateRelativePosition = (childNode: Node, parentNode: Node) => {
  return {
    x: childNode.position.x - parentNode.position.x,
    y: childNode.position.y - parentNode.position.y,
  }
}

const getAllDescendants = (nodeIds: string[], allNodes: Node[]): Node[] => {
  const descendants: Node[] = []
  const visited = new Set<string>()

  const findChildren = (parentIds: string[]) => {
    const children = allNodes.filter(
      (node) =>
        node.parentId &&
        parentIds.includes(node.parentId) &&
        !visited.has(node.id)
    )

    children.forEach((child) => visited.add(child.id))
    descendants.push(...children)

    if (children.length > 0) {
      findChildren(children.map((child) => child.id))
    }
  }

  findChildren(nodeIds)
  return descendants
}

const getAllNodesToInclude = (
  selectedElementIds: string[],
  allNodes: Node[]
) => {
  const selectedNodes = allNodes.filter((node) =>
    selectedElementIds.includes(node.id)
  )
  const descendants = getAllDescendants(selectedElementIds, allNodes)
  return [...selectedNodes, ...descendants]
}

const getRelevantEdges = (
  selectedElementIds: string[],
  nodeIds: string[],
  allEdges: Edge[]
) => {
  const selectedEdges = allEdges.filter((edge) =>
    selectedElementIds.includes(edge.id)
  )
  const connectedEdges = allEdges.filter(
    (edge) => nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
  )

  const allRelevantEdges = [...selectedEdges]
  connectedEdges.forEach((edge) => {
    if (!allRelevantEdges.some((e) => e.id === edge.id)) {
      allRelevantEdges.push(edge)
    }
  })

  return allRelevantEdges
}

const buildParentChildRelations = (
  nodesToInclude: Node[],
  nodeIds: string[]
) => {
  const parentChildRelations: Array<{
    parentId: string
    childId: string
    relativePosition: { x: number; y: number }
  }> = []

  nodesToInclude.forEach((node) => {
    if (node.parentId && nodeIds.includes(node.parentId)) {
      const parentNode = nodesToInclude.find((n) => n.id === node.parentId)
      if (parentNode) {
        parentChildRelations.push({
          parentId: node.parentId,
          childId: node.id,
          relativePosition: calculateRelativePosition(node, parentNode),
        })
      }
    }
  })

  return parentChildRelations
}

const getEdgesToRemove = (
  selectedElementIds: string[],
  expandedNodeIds: string[],
  allEdges: Edge[]
) => {
  const selectedEdges = allEdges.filter((edge) =>
    selectedElementIds.includes(edge.id)
  )
  const connectedEdges = allEdges.filter(
    (edge) =>
      expandedNodeIds.includes(edge.source) ||
      expandedNodeIds.includes(edge.target)
  )

  return new Set([
    ...selectedEdges.map((e) => e.id),
    ...connectedEdges.map((e) => e.id),
  ])
}

const createClipboardData = (
  selectedElementIds: string[],
  allNodes: Node[],
  allEdges: Edge[]
): ClipboardData => {
  const allNodesToCopy = getAllNodesToInclude(selectedElementIds, allNodes)
  const allNodeIds = allNodesToCopy.map((node) => node.id)
  const allRelevantEdges = getRelevantEdges(
    selectedElementIds,
    allNodeIds,
    allEdges
  )
  const parentChildRelations = buildParentChildRelations(
    allNodesToCopy,
    allNodeIds
  )

  return {
    nodes: allNodesToCopy,
    edges: allRelevantEdges,
    parentChildRelations,
    timestamp: Date.now(),
  }
}

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

    const clipboardData = createClipboardData(selectedElementIds, nodes, edges)

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

        clipboardData.nodes.forEach((node) => {
          const newId = generateUUID()
          nodeIdMap.set(node.id, newId)
          newElementIds.push(newId)
        })

        const rootParentIds = new Set(
          clipboardData.nodes
            .filter((node) => !node.parentId)
            .map((node) => node.id)
        )

        const sortedNodes = sortNodesTopologically(clipboardData.nodes)
        const nodePositions = new Map<string, { x: number; y: number }>()

        const pastedNodes = sortedNodes.map((node: Node) => {
          const newId = nodeIdMap.get(node.id)!

          if (node.parentId && nodeIdMap.has(node.parentId)) {
            const newParentId = nodeIdMap.get(node.parentId)!
            const relation = clipboardData.parentChildRelations?.find(
              (r) => r.childId === node.id && r.parentId === node.parentId
            )

            if (relation) {
              const parentNewPosition = nodePositions.get(node.parentId)

              if (parentNewPosition) {
                const newPosition = {
                  x: parentNewPosition.x + relation.relativePosition.x,
                  y: parentNewPosition.y + relation.relativePosition.y,
                }
                nodePositions.set(node.id, newPosition)

                return {
                  ...node,
                  id: newId,
                  parentId: newParentId,
                  position: newPosition,
                  selected: true,
                }
              }
            }
          }

          const newPosition = rootParentIds.has(node.id)
            ? {
                x: node.position.x + progressiveOffset,
                y: node.position.y + progressiveOffset,
              }
            : {
                x: node.position.x + progressiveOffset,
                y: node.position.y + progressiveOffset,
              }

          nodePositions.set(node.id, newPosition)

          return {
            ...node,
            id: newId,
            position: newPosition,
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

        const updatedNodes = sortNodesTopologically([...nodes, ...pastedNodes])

        setNodes(updatedNodes)
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

  const cutSelectedElements = useCallback(async () => {
    if (selectedElementIds.length === 0) {
      return false
    }

    const clipboardData = createClipboardData(selectedElementIds, nodes, edges)

    try {
      const jsonString = JSON.stringify(clipboardData)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonString)
      } else {
        return false
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
      return false
    }

    const allNodesToCut = getAllNodesToInclude(selectedElementIds, nodes)
    const expandedNodeIds = allNodesToCut.map((node) => node.id)
    const edgeIdsToRemove = getEdgesToRemove(
      selectedElementIds,
      expandedNodeIds,
      edges
    )

    const remainingNodes = nodes.filter(
      (node) => !expandedNodeIds.includes(node.id)
    )
    const remainingEdges = edges.filter((edge) => !edgeIdsToRemove.has(edge.id))

    setNodes(remainingNodes)
    setEdges(remainingEdges)
    setSelectedElementsId([])

    return true
  }, [
    selectedElementIds,
    nodes,
    edges,
    setNodes,
    setEdges,
    setSelectedElementsId,
  ])

  return {
    selectedElementIds,
    hasSelectedElements,
    selectAll,
    clearSelection,
    copySelectedElements,
    pasteElements,
    cutSelectedElements,
  }
}
