import { useState } from "react";
import { List } from "./List";
import { useReactFlow } from "@xyflow/react";

export const Methods = ({
  id,
  methods,
  editEnabled,
}: {
  id: string;
  methods: { id: string; name: string }[];
  editEnabled: boolean;
}) => {
  const reactFlow = useReactFlow();
  const [newMethod, setNewMethod] = useState("");

  const addMethod = () => {
    if (!newMethod.trim()) return;
    reactFlow.updateNodeData(id, {
      methods: [...methods, { id: `method-${Math.random()}`, name: newMethod }],
    });
    setNewMethod("");
  };

  const updateMethod = (methodId: string, newName: string) => {
    reactFlow.updateNodeData(id, {
      methods: methods.map((method) =>
        method.id === methodId ? { ...method, name: newName } : method
      ),
    });
  };

  const deleteMethod = (methodId: string) => {
    reactFlow.updateNodeData(id, {
      methods: methods.filter((method) => method.id !== methodId),
    });
  };

  return (
    <List
      items={methods}
      editable={editEnabled}
      newItemValue={newMethod}
      onNewItemChange={setNewMethod}
      onAddItem={addMethod}
      onUpdateItem={updateMethod}
      onDeleteItem={deleteMethod}
      placeholder="Method"
      title="Methods"
    />
  );
};

export default Methods;
