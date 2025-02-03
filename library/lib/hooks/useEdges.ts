import { useEffect, useRef, useState } from "react"
import { useReactFlow } from "@xyflow/react"

export function useEdgePopOver({
  id,
  selected,
}: {
  id: string
  selected: boolean
}) {
  const reactFlow = useReactFlow()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null)

  const handleClick = () => {
    if (svgRef.current) {
      setAnchorEl(svgRef.current)
    }
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleEdgeTypeChange = (newType: string) => {
    reactFlow.setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            type: newType, // update the edge type
            markerEnd: edge.markerEnd, // preserve markerEnd
            data: {
              ...edge.data,
              // preserve the custom data fields (with fallback empty strings)
              sourceRole: edge.data?.sourceRole ?? "",
              sourceMultiplicity: edge.data?.sourceMultiplicity ?? "",
              targetRole: edge.data?.targetRole ?? "",
              targetMultiplicity: edge.data?.targetMultiplicity ?? "",
            },
          }
        }
        return edge
      })
    )
  }

  const handleSwap = () => {
    console.log("SAWP CALLED")
    reactFlow.setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            source: edge.target,
            target: edge.source,

            // type: edge.type, // update the edge type
            // markerEnd: edge.markerStart, // preserve markerEnd
            // markerStart: edge.markerEnd,
            // data: {
            //   ...edge.data,
            //   // preserve the custom data fields (with fallback empty strings)
            //   targetRole: edge.data?.sourceRole ?? "",
            //   targetMultiplicity: edge.data?.sourceMultiplicity ?? "",
            //   sourceRole: edge.data?.targetRole ?? "",
            //   sourceMultiplicity: edge.data?.targetMultiplicity ?? "",
            // },
          }
        }
        return edge
      })
    )
  }

  const handleNameChange = (newName: string) => {
    reactFlow.updateNodeData(id, { name: newName })
  }

  const handleTargetRoleChange = (newRole: string) => {
    reactFlow.updateEdgeData(id, { targetRole: newRole })
  }

  const handleTargetMultiplicityChange = (newMultiplicity: string) => {
    reactFlow.updateEdgeData(id, { targetMultiplicity: newMultiplicity })
  }

  const handleSourceRoleChange = (newRole: string) => {
    reactFlow.updateEdgeData(id, { sourceRole: newRole })
  }

  const handleSourceMultiplicityChange = (newMultiplicity: string) => {
    reactFlow.updateEdgeData(id, { sourceMultiplicity: newMultiplicity })
  }

  const handleDelete = () => {
    reactFlow.deleteElements({
      nodes: [{ id }],
    })
  }

  useEffect(() => {
    if (!selected) {
      handlePopoverClose()
    }
  }, [selected])

  useEffect(() => {
    if (!anchorEl) {
      reactFlow.updateNode(id, { selected: false })
    }
  }, [anchorEl, reactFlow, id])

  return {
    svgRef,
    anchorEl,
    handleClick,
    handlePopoverClose,
    handleNameChange,
    handleDelete,
    handleTargetRoleChange,
    handleTargetMultiplicityChange,
    handleSourceRoleChange,
    handleSourceMultiplicityChange,
    handleEdgeTypeChange,
    handleSwap,
  }
}

export function useToolbar({
  id,
  //selected,
}: {
  id: string
  // selected: boolean,
}) {
  const reactFlow = useReactFlow()
  const svgRef = useRef<SVGSVGElement | null>(null)
  //const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null)

  const handleDelete = () => {
    reactFlow.deleteElements({
      edges: [{ id }],
    })
  }

  return {
    svgRef,
    //anchorEl,
    handleDelete,
  }
}
