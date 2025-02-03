export interface CustomEdgeToolbarProps {
  x: number
  y: number
  onEditClick: (event: React.MouseEvent<HTMLElement>) => void
  onDeleteClick: (event: React.MouseEvent<HTMLElement>) => void
}
