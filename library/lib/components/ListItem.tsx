interface Props {
  value: string;
  editable: boolean;
  onChange: (newValue: string) => void;
  onDelete?: () => void;
}

export const ListItem = ({ value, editable, onChange, onDelete }: Props) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <input
      value={value}
      disabled={!editable}
      onChange={(e) => onChange(e.target.value)}
      style={{ flex: 1, marginRight: 5 }}
    />
    {editable && onDelete && (
      <button onClick={onDelete} style={{ marginLeft: 5 }}>
        x
      </button>
    )}
  </div>
);
