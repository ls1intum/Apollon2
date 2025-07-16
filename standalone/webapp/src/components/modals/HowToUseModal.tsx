import { Button } from "@mui/material"
import { useModalContext } from "@/contexts"
import NodeCreation from "assets/images/how-to-use-node-creation.png"
import EdgeCreation from "assets/images/how-to-use-edge-creation.png"
import NodeEdit from "assets/images/how-to-use-node-edit.png"
import NodeMove from "assets/images/how-to-use-node-move.png"

export const HowToUseModal = () => {
  const { closeModal } = useModalContext()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-[auto,1fr,auto] gap-x-4 gap-y-6">
        {/* Add Node */}
        <h3 className="font-bold text-lg">Add Node</h3>
        <p className="text-gray-700">
          To add a node, simply drag and drop one of the elements on the left
          side into the editor area.
        </p>
        <img
          className="w-64 h-auto object-contain"
          src={NodeCreation}
          alt="Node creation example"
        />

        {/* Separator */}
        <div className="col-span-3 border-t border-gray-200"></div>

        {/* Add Edge */}
        <h3 className="font-bold text-lg">Add Edge</h3>
        <p className="text-gray-700">
          To add an edge between nodes, select the source class with a single
          click and you will see blue circles around the node. Those are the
          possible connection points for edge. Click and hold on one of those
          and drag it to another node to create an edge.
        </p>
        <img
          className="w-64 h-auto object-contain"
          src={EdgeCreation}
          alt="Edge creation example"
        />

        {/* Separator */}
        <div className="col-span-3 border-t border-gray-200"></div>

        {/* Edit Class */}
        <h3 className="font-bold text-lg">Edit Class</h3>
        <p className="text-gray-700">
          To edit a class, double click it and a popup will open up, in which
          you can edit its components, e.g. name, attributes, methods, etc.
        </p>
        <img
          className="w-64 h-auto object-contain"
          src={NodeEdit}
          alt="Node edit example"
        />

        {/* Separator */}
        <div className="col-span-3 border-t border-gray-200"></div>

        {/* Delete Class */}
        <h3 className="font-bold text-lg">Delete Class</h3>
        <p className="text-gray-700 col-span-2">
          To delete a class, select it with a single click and either press{" "}
          <code>Delete</code> or <code>Backspace</code> on your keyboard.
        </p>

        {/* Separator */}
        <div className="col-span-3 border-t border-gray-200"></div>

        {/* Move Class */}
        <h3 className="font-bold text-lg">Move Class</h3>
        <p className="text-gray-700">
          To move a class, select it with a single click and either use your
          keyboard arrows or drag and drop it.
        </p>
        <img
          className="w-64 h-auto object-contain"
          src={NodeMove}
          alt="Node move example"
        />

        {/* Separator */}
        <div className="col-span-3 border-t border-gray-200"></div>

        {/* Undo & Redo */}
        <h3 className="font-bold text-lg">Undo & Redo</h3>
        <p className="text-gray-700 col-span-2">
          With <code>Ctrl+Z</code> and <code>Ctrl+Y</code> you can undo and redo
          your changes.
        </p>
      </div>
      <Button variant="outlined" onClick={closeModal}>
        Close
      </Button>
    </div>
  )
}
