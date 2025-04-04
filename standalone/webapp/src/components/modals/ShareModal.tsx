import { Tooltip, Typography } from "@mui/material"
import Info from "@mui/icons-material/Info"
import { APButton } from "../APButton"
import { toast } from "react-toastify"
import { useApollon2Context } from "@/contexts"
import { useState } from "react"
import { DiagramType } from "@apollon2/library"

enum DiagramView {
  EDIT = "Edit",
  COLLABORATE = "Collaborate",
  GIVE_FEEDBACK = "Give Feedback",
  SEE_FEEDBACK = "See Feedback",
}

export const ShareModal = () => {
  const { apollon2 } = useApollon2Context()
  const [diagramId, setDiagramId] = useState("")
  // const { closeModal } = useModalContext()
  const [link, setLink] = useState("")
  const handleShareButtonPress = async (view: DiagramView, close: boolean) => {
    copyToClipboard("somelink-to-share-with-others")
    toast.success(`You have successfuly ${view} a diagram`, {
      autoClose: 10000,
    })

    const nodes = apollon2?.getNodes()
    const edges = apollon2?.getEdges()
    const metadata = {
      id: diagramId,
      diagramName: "diagramName",
      diagramType: DiagramType.ClassDiagram,
    }
    console.log("close", close)
    console.log("nodes", nodes)
    console.log("edges", edges)
    console.log("metadata", metadata)
    const data = { nodes, edges, metadata }

    const response = await fetch("http://localhost:3000/diagram/setDiagram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error("Error in setDiagram endpoint:", err)
        toast.error("Error in setDiagram endpoint:", err)
      })

    console.log("response", response)
    // if (close) {
    //   closeModal()
    // }
  }

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography>
          After sharing, this diagram will be accessible to everyone with access
          to the link for at least 12 weeks.{" "}
          <Tooltip title="Copy link to clipboard">
            <Info />
          </Tooltip>
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        <div>
          <APButton
            variant="outline"
            fullWidth
            onClick={() => {
              handleShareButtonPress(DiagramView.EDIT, false)
            }}
          >
            Edit
          </APButton>
        </div>
        <div>
          <APButton
            variant="outline"
            fullWidth
            onClick={() => {
              handleShareButtonPress(DiagramView.COLLABORATE, false)
              setLink("somelink-to-share-with-others")
            }}
          >
            Collaborate
          </APButton>
        </div>
        <div>
          <APButton
            variant="outline"
            fullWidth
            onClick={() => {
              handleShareButtonPress(DiagramView.GIVE_FEEDBACK, false)
            }}
          >
            Give Feedback
          </APButton>
        </div>
        <div>
          <APButton
            variant="outline"
            fullWidth
            onClick={() => {
              handleShareButtonPress(DiagramView.SEE_FEEDBACK, false)
            }}
          >
            See Feedback
          </APButton>
        </div>
      </div>

      <input
        type="text"
        value={diagramId}
        onChange={(e) => setDiagramId(e.target.value)}
      />
      <fieldset className="border border-gray-300 p-2 rounded-xl w-fill ">
        <legend className="text-sm  px-2">Recently shared Diagram:</legend>
        <div className="flex items-center ">
          <input
            type="text"
            value={link}
            readOnly
            className="grow h-[42px] px-3 py-2 border rounded-md border-r-0 rounded-r-none"
          />
          <APButton
            onClick={() => copyToClipboard(link)}
            variant="outline"
            className=" rounded-l-none h-[42px]"
          >
            Copy Link
          </APButton>
        </div>
      </fieldset>
    </div>
  )
}
