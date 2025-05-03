import mongoose, { Document, Schema } from "mongoose"

export interface IDiagram extends Document {
  _id: string // Custom ID from library
  version: string
  title: string
  type: string
  nodes: any[] // JSON array for nodes
  edges: any[] // JSON array for edges
  assessments?: any[] // Optional JSON array for assessments
}

const diagramSchema: Schema = new Schema({
  _id: { type: String, required: true }, // Custom ID, not auto-generated
  version: { type: String, required: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  nodes: { type: [Schema.Types.Mixed], default: [] }, // Flexible JSON array
  edges: { type: [Schema.Types.Mixed], default: [] }, // Flexible JSON array
  assessments: { type: [Schema.Types.Mixed], default: [] }, // Flexible JSON array
})

// Disable auto-generated _id
diagramSchema.set("id", false)

export default mongoose.model<IDiagram>("Diagram", diagramSchema)
