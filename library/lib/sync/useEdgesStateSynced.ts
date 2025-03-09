import { useCallback, useEffect, useState } from "react"
import { type Edge, type OnEdgesChange, applyEdgeChanges } from "@xyflow/react"

import ydoc from "./ydoc"

// Please see the comments in useNodesStateSynced.ts.
// This is the same thing but for edges.
export const edgesMap = ydoc.getMap<Edge>("edges")

export function useEdgesStateSynced(): [
  Edge[],
  React.Dispatch<React.SetStateAction<Edge[]>>,
  OnEdgesChange,
] {
  const [edges, setEdges] = useState<Edge[]>([])

  const setEdgesSynced = useCallback(
    (edgesOrUpdater: React.SetStateAction<Edge[]>) => {
      const next =
        typeof edgesOrUpdater === "function"
          ? edgesOrUpdater([...edgesMap.values()])
          : edgesOrUpdater

      const seen = new Set<string>()

      for (const edge of next) {
        seen.add(edge.id)
        edgesMap.set(edge.id, edge)
      }

      for (const edge of edgesMap.values()) {
        if (!seen.has(edge.id)) {
          edgesMap.delete(edge.id)
        }
      }
    },
    []
  )

  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    const edges = Array.from(edgesMap.values())
    const nextEdges = applyEdgeChanges(changes, edges)

    for (const change of changes) {
      if (change.type === "add" || change.type === "replace") {
        edgesMap.set(change.item.id, change.item)
      } else if (change.type === "remove" && edgesMap.has(change.id)) {
        edgesMap.delete(change.id)
      } else {
        const edge = nextEdges.find((n) => n.id === change.id)
        if (edge) {
          edgesMap.set(change.id, edge)
        } else {
          console.warn(`Edge with id ${change.id} not found in nextEdges.`)
        }
      }
    }
  }, [])

  useEffect(() => {
    const observer = () => {
      setEdges(Array.from(edgesMap.values()))
    }

    setEdges(Array.from(edgesMap.values()))
    edgesMap.observe(observer)

    return () => edgesMap.unobserve(observer)
  }, [setEdges])

  return [edges, setEdgesSynced, onEdgesChange]
}
