import { Schema, model, InferSchemaType, Types } from "mongoose";

const sectionOrderSchema = new Schema({
  generalInfoId: {
    type: Types.ObjectId,
    ref: "GeneralInfo",  
    required: true
  },
  sections: [
    {
      name: { type: String},  
      order: { type: Number},  
      isActive: { type: Boolean},  
    }
  ]
}, { timestamps: true });

type SectionOrder = InferSchemaType<typeof sectionOrderSchema>;

export default model<SectionOrder>("SectionOrder", sectionOrderSchema);
