import { useState } from "react";
import { List } from "./List";
import { useReactFlow } from "@xyflow/react";

const Attributes = ({
  id,
  attributes,
  editEnabled,
}: {
  id: string;
  attributes: { id: string; name: string }[];
  editEnabled: boolean;
}) => {
  const reactFlow = useReactFlow();
  const [newAttribute, setNewAttribute] = useState("");

  const addAttribute = () => {
    if (!newAttribute.trim()) return;
    reactFlow.updateNodeData(id, {
      attributes: [
        ...attributes,
        { id: `attribute-${Math.random()}`, name: newAttribute },
      ],
    });
    setNewAttribute("");
  };

  const updateAttribute = (attributeId: string, newName: string) => {
    reactFlow.updateNodeData(id, {
      attributes: attributes.map((attr) =>
        attr.id === attributeId ? { ...attr, name: newName } : attr
      ),
    });
  };

  const deleteAttribute = (attributeId: string) => {
    reactFlow.updateNodeData(id, {
      attributes: attributes.filter((attr) => attr.id !== attributeId),
    });
  };

  return (
    <List
      items={attributes}
      editable={editEnabled}
      newItemValue={newAttribute}
      onNewItemChange={setNewAttribute}
      onAddItem={addAttribute}
      onUpdateItem={updateAttribute}
      onDeleteItem={deleteAttribute}
      placeholder="Attribute"
      title="Attributes"
    />
  );
};

export default Attributes;
