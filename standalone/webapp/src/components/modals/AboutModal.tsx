import { appVersion, apollon2RepositoryLink } from "@/constants"
import { useModalContext } from "@/contexts"
import { Button } from "@mui/material"

export const AboutModal = () => {
  const { closeModal } = useModalContext()
  return (
    <div className="flex flex-col gap-6">
      <table>
        <tr>
          <td>Version:</td>
          <td>
            <a
              className="text-blue-500 hover:text-purple-800"
              href={apollon2RepositoryLink}
              target="_blank"
              rel="noreferrer"
            >
              Apollon2
            </a>
            : {`${appVersion}`}{" "}
          </td>
        </tr>
      </table>
      <div className="w-full h-[1px] bg-gray-400" />

      <Button
        variant="outlined"
        color="primary"
        onClick={closeModal}
        className="self-end"
      >
        Close
      </Button>
    </div>
  )
}
