import { Schema, model, InferSchemaType, Types } from "mongoose";

const deployDesignSchema = new Schema(
  {
    launchId: {
      type: Types.ObjectId,
      ref: "AddLaunch",
      required: true,
    },
    name: { type: String, required: true },
    inTrailer: { type: Boolean, required: true },
    preview: { type: Boolean, required: true },
    content: { type: Schema.Types.Mixed, required: true }, // "components" yerine "content"
    type: { 
      type: String, 
      required: true, // "type" alanı zorunlu olarak işaretlenir
    },
    sequenceNumber: {
      type: Number,
      required: true, // Sıra numarası zorunlu olarak işaretlenir
    },
  },
  { timestamps: true }
);

type DeployDesign = InferSchemaType<typeof deployDesignSchema>;

export default model<DeployDesign>("DeployDesign", deployDesignSchema);
