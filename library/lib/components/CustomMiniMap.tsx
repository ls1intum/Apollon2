import { useState } from "react"
import { MiniMap, MiniMapNodeProps, Panel, useReactFlow } from "@xyflow/react"
import {
  ClassSVG,
  PackageSVG,
  ActivitySVG,
  ActivityInitialNodeSVG,
  ActivityFinalNodeSVG,
  ActivityActionNodeSVG,
  ActivityObjectNodeSVG,
  ActivityMergeNodeSVG,
  ActivityForkNodeSVG,
  ActivityForkNodeHorizontalSVG,
  UseCaseNodeSVG,
  UseCaseSystemNodeSVG,
  UseCaseActorNodeSVG,
  ComponentInterfaceNodeSVG,
  ComponentSubsystemNodeSVG,
  ComponentNodeSVG,
  DeploymentNodeSVG,
  DeploymentComponentSVG,
  DeploymentArtifactSVG,
  DeploymentInterfaceSVG,
  FlowchartTerminalNodeSVG,
  FlowchartProcessNodeSVG,
  FlowchartDecisionNodeSVG,
  FlowchartInputOutputNodeSVG,
  FlowchartFunctionCallNodeSVG,
  SyntaxTreeTerminalNodeSVG,
} from "./svgs"
import SouthEastIcon from "@mui/icons-material/SouthEast"
import MapIcon from "@mui/icons-material/Map"
import { DiagramNodeType } from "@/typings"

export const CustomMiniMap = () => {
  const [minimapCollapsed, setMinimapCollapsed] = useState(true)

  if (minimapCollapsed) {
    return (
      <Panel position="bottom-right" onClick={() => setMinimapCollapsed(false)}>
        <MapIcon />
      </Panel>
    )
  }

  return (
    <Panel
      position="bottom-right"
      onClick={() => setMinimapCollapsed(true)}
      style={{ boxShadow: "none", backgroundColor: "transparent" }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          display: "flex",
          zIndex: 10,
          padding: 8,
          backgroundColor: "white",
          borderRadius: "4px",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          boxShadow: "0 0 4px 0 rgb(0 0 0 / 0.2)",
        }}
      >
        <SouthEastIcon width={16} height={16} />
      </div>

      <MiniMap
        zoomable
        onClick={() => setMinimapCollapsed(true)}
        nodeComponent={MiniMapNode}
        offsetScale={20}
        style={{ zIndex: 5 }}
      />
    </Panel>
  )
}

function MiniMapNode({ id, x, y }: MiniMapNodeProps) {
  const { getNode } = useReactFlow()

  const nodeInfo = getNode(id)
  if (!nodeInfo) return null

  switch (nodeInfo.type as DiagramNodeType) {
    case "class":
      return (
        <ClassSVG
          svgAttributes={{ x, y }}
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          methods={(nodeInfo.data["methods"] as []) || []}
          attributes={(nodeInfo.data["attributes"] as []) || []}
          name={(nodeInfo.data.name as string) || ""}
        />
      )
    case "package":
      return (
        <PackageSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "activity":
      return (
        <ActivitySVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          name={(nodeInfo.data.name as string) || ""}
          id={`minimap_${id}`}
          svgAttributes={{ x, y }}
        />
      )
    case "activityInitialNode":
      return (
        <ActivityInitialNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          svgAttributes={{ x, y }}
        />
      )
    case "activityFinalNode":
      return (
        <ActivityFinalNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          svgAttributes={{ x, y }}
        />
      )
    case "activityActionNode":
      return (
        <ActivityActionNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          name={(nodeInfo.data.name as string) || ""}
          id={`minimap_${id}`}
          svgAttributes={{ x, y }}
        />
      )
    case "activityObjectNode":
      return (
        <ActivityObjectNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          name={(nodeInfo.data.name as string) || ""}
          id={`minimap_${id}`}
          svgAttributes={{ x, y }}
        />
      )
    case "activityMergeNode":
      return (
        <ActivityMergeNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "activityForkNode":
      return (
        <ActivityForkNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          svgAttributes={{ x, y }}
        />
      )
    case "activityForkNodeHorizontal":
      return (
        <ActivityForkNodeHorizontalSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          svgAttributes={{ x, y }}
        />
      )
    case "useCase":
      return (
        <UseCaseNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "useCaseActor":
      return (
        <UseCaseActorNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "useCaseSystem":
      return (
        <UseCaseSystemNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )

    case "component":
      return (
        <ComponentNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          isComponentHeaderShown={
            nodeInfo.data.isComponentHeaderShown as boolean
          }
          svgAttributes={{ x, y }}
        />
      )
    case "componentSubsystem":
      return (
        <ComponentSubsystemNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          isComponentSubsystemHeaderShown={
            nodeInfo.data.isComponentSubsystemHeaderShown as boolean
          }
          svgAttributes={{ x, y }}
        />
      )
    case "componentInterface":
      return (
        <ComponentInterfaceNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "deploymentNode":
      return (
        <DeploymentNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
          isComponentHeaderShown={
            nodeInfo.data.isComponentHeaderShown as boolean
          }
          stereotype={nodeInfo.data.stereotype as string}
        />
      )
    case "deploymentComponent":
      return (
        <DeploymentComponentSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
          isComponentHeaderShown={
            nodeInfo.data.isComponentHeaderShown as boolean
          }
        />
      )
    case "deploymentArtifact":
      return (
        <DeploymentArtifactSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "deploymentInterface":
      return (
        <DeploymentInterfaceSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "flowchartTerminal":
      return (
        <FlowchartTerminalNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "flowchartProcess":
      return (
        <FlowchartProcessNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "flowchartDecision":
      return (
        <FlowchartDecisionNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "flowchartInputOutput":
      return (
        <FlowchartInputOutputNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "flowchartFunctionCall":
      return (
        <FlowchartFunctionCallNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )
    case "syntaxTreeTerminal":
      return (
        <SyntaxTreeTerminalNodeSVG
          width={nodeInfo.width ?? 0}
          height={nodeInfo.height ?? 0}
          id={`minimap_${id}`}
          name={(nodeInfo.data.name as string) || ""}
          svgAttributes={{ x, y }}
        />
      )

    default:
      return <rect x={x} y={y} width={100} height={100} fill="gray" />
  }
}
