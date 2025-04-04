import { Tooltip, Typography } from "@mui/material"
import Info from "@mui/icons-material/Info"
import { APButton } from "../APButton"
import { toast } from "react-toastify"
import { useApollon2Context, useModalContext } from "@/contexts"

import { v4 as uuidv4 } from "uuid"
import { useNavigate } from "react-router"

// enum DiagramView {
//   EDIT = "Edit",
//   COLLABORATE = "Collaborate",
//   GIVE_FEEDBACK = "Give Feedback",
//   SEE_FEEDBACK = "See Feedback",
// }

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

export const ShareModal = () => {
  const { apollon2 } = useApollon2Context()
  const { closeModal } = useModalContext()
  const navigate = useNavigate()

  const handleShareButtonPress = async () => {
    const nodes = apollon2?.getNodes()
    const edges = apollon2?.getEdges()
    const metadata = { ...apollon2?.getDiagramMetadata(), diagramID: uuidv4() }

    const data = { nodes, edges, metadata }
    await fetch(`${backendUrl}/diagram/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (res.ok) {
          const diagramID = (await res.json()).newDiagramID

          const newurl = `${window.location.origin}/diagram/${diagramID}`
          copyToClipboard(newurl)
          navigate(`/diagram/${diagramID}`)

          toast.success(
            `The link has been copied to your clipboard and can be shared to collaborate, simply by pasting the link. You can re-access the link by going to share menu.`,
            {
              autoClose: 10000,
            }
          )
          closeModal()
        } else {
          throw new Error("Network response was not ok")
        }
      })
      .catch((err) => {
        console.error("Error in setDiagram endpoint:", err)
        toast.error("Error in setDiagram endpoint:", err)
      })
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
            onClick={handleShareButtonPress}
          >
            Edit
          </APButton>
        </div>
        <div>
          <APButton
            variant="outline"
            fullWidth
            onClick={handleShareButtonPress}
          >
            Collaborate
          </APButton>
        </div>
        <div>
          <APButton
            variant="outline"
            fullWidth
            onClick={handleShareButtonPress}
          >
            Give Feedback
          </APButton>
        </div>
        <div>
          <APButton
            variant="outline"
            fullWidth
            onClick={handleShareButtonPress}
          >
            See Feedback
          </APButton>
        </div>
      </div>
      <fieldset className="border border-gray-300 p-2 rounded-xl w-fill ">
        <legend className="text-sm  px-2">Recently shared Diagram:</legend>
        <div className="flex items-center ">
          <input
            type="text"
            value={window.location.href}
            readOnly
            className="grow h-[42px] px-3 py-2 border rounded-md border-r-0 rounded-r-none"
          />
          <APButton
            onClick={() => copyToClipboard(window.location.href)}
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
