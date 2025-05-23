export function convertV3ToV4Forest(v3) {
  const elements = v3.model.elements
  const resultNodes = []

  // Map element types to v4 node type
  function mapElementToNode(el) {
    const isEnumeration = el.type === "Enumeration"
    const stereotype =
      el.type === "Interface"
        ? "Interface"
        : isEnumeration
          ? "Enumeration"
          : undefined

    return {
      id: el.id,
      type: el.type === "Package" ? "Package" : "Class",
      position: { x: el.bounds.x, y: el.bounds.y },
      width: el.bounds.width,
      height: el.bounds.height,
      data: {
        name: el.name,
        ...(stereotype ? { stereotype } : {}),
        attributes: [],
        methods: [],
      },
      measured: {
        width: el.bounds.width,
        height: el.bounds.height,
      },
    }
  }

  // Recursive traversal per parentId
  function buildSubtree(parentId, parentNode) {
    for (const el of Object.values(elements)) {
      if (el.owner === parentId) {
        if (el.type === "ClassAttribute") {
          parentNode?.data?.attributes.push({
            id: el.id,
            name: el.name,
          })
        } else if (el.type === "ClassMethod") {
          parentNode?.data?.methods.push({
            id: el.id,
            name: el.name,
          })
        } else {
          const node = mapElementToNode(el)
          if (parentId) node.parentId = parentId
          resultNodes.push(node)
          buildSubtree(el.id, node)
        }
      }
    }
  }

  // Start with all top-level elements (owner === null)
  for (const el of Object.values(elements)) {
    if (
      el.owner === null &&
      el.type !== "ClassAttribute" &&
      el.type !== "ClassMethod"
    ) {
      const node = mapElementToNode(el)
      resultNodes.push(node)
      buildSubtree(el.id, node)
    }
  }

  return {
    id: v3.id,
    model: {
      id: v3.id,
      version: "4.0.0",
      title: v3.title,
      type: v3.model.type,
      nodes: resultNodes,
      edges: [], // Optional: convert edges if needed
      assessments: v3.model.assessments || {},
    },
    lastModifiedAt: new Date().toISOString(),
  }
}
