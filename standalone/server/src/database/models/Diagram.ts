import mongoose, { Document, Schema } from "mongoose"

export interface IDiagram extends Document {
  _id: string // Custom ID from library
  version: string
  title: string
  type: string
  nodes: Schema.Types.Mixed[] // JSON array for nodes
  edges: Schema.Types.Mixed[] // JSON array for edges
  assessments: Record<string, Schema.Types.Mixed> // Optional JSON object for assessments
}

const diagramSchema: Schema = new Schema(
  {
    _id: { type: String, required: true }, // Custom ID, not auto-generated
    version: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    nodes: { type: [Schema.Types.Mixed], default: [] }, // Flexible JSON array
    edges: { type: [Schema.Types.Mixed], default: [] }, // Flexible JSON array
    assessments: { type: Schema.Types.Mixed, default: {} }, // Flexible JSON object}
  },
  {
    minimize: false, // Disable minimization of the document
    versionKey: false,
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    toJSON: {
      virtuals: true, // expose `id`
      transform: (_doc, ret) => {
        ret.id = ret._id // copy _id to id
        delete ret._id // optional: remove _id
      },
    },
  }
)

// Disable auto-generated _id
diagramSchema.set("id", false)

export default mongoose.model<IDiagram>("Diagram", diagramSchema)
