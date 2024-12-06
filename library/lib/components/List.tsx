import { ListItem } from "./ListItem";

export const List = ({
  items,
  editable,
  newItemValue,
  onNewItemChange,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  placeholder,
  title,
}: {
  items: { id: string; name: string }[];
  editable: boolean;
  newItemValue: string;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onUpdateItem: (id: string, newValue: string) => void;
  onDeleteItem: (id: string) => void;
  placeholder: string;
  title?: string;
}) => {
  const showTitle = title && (items.length > 0 || editable);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      {showTitle && <div>{title}</div>}
      {items.map((item) => (
        <ListItem
          key={item.id}
          value={item.name}
          editable={editable}
          onChange={(newValue) => onUpdateItem(item.id, newValue)}
          onDelete={() => onDeleteItem(item.id)}
        />
      ))}
      {editable && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 5,
          }}
        >
          <input
            value={newItemValue}
            onChange={(e) => onNewItemChange(e.target.value)}
            placeholder={placeholder}
            style={{ flex: 1, marginRight: 5 }}
          />
          <button onClick={onAddItem} style={{ marginLeft: 5 }}>
            Add
          </button>
        </div>
      )}
    </div>
  );
};
