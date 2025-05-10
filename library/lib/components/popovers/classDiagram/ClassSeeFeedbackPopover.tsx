import { useDiagramStore } from "@/store"
import { useShallow } from "zustand/shallow"
import { ClassNodeProps } from "@/types"
import { PopoverProps } from "../types"
import { SeeFeedbackAssessmentBox } from "../SeeFeedbackAssessmentBox"
import { useGoToNextAssessment } from "@/hooks"
import Button from "@mui/material/Button"

export const ClassSeeFeedbackPopover = ({ elementId }: PopoverProps) => {
  const nodes = useDiagramStore(useShallow((state) => state.nodes))
  const handleGoToNextAssessment = useGoToNextAssessment(elementId)

  const node = nodes.find((node) => node.id === elementId)
  if (!node) return null

  const nodeData = node.data as ClassNodeProps

  return (
    <>
      <SeeFeedbackAssessmentBox
        elementId={elementId}
        name={nodeData.name}
        type={node.type ?? ""}
      />

      {nodeData.attributes.map((attr) => (
        <SeeFeedbackAssessmentBox
          key={attr.id}
          elementId={attr.id}
          name={attr.name}
          type="Attribute"
        />
      ))}

      {nodeData.methods.map((method) => (
        <SeeFeedbackAssessmentBox
          key={method.id}
          elementId={method.id}
          name={method.name}
          type="Method"
        />
      ))}
      <Button variant="outlined" onClick={handleGoToNextAssessment}>
        Next Assessment
      </Button>
    </>
  )
}
