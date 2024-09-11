import { Schema, model, InferSchemaType } from "mongoose";

const addLaunchSchema = new Schema(
  {
    launchName: {
      type: String,
    },
    language: {
      type: String,
    },
    groupNumber: {
      type: String,
    },
    companyName: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    launchDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    sequenceNumber: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    showOnHomepage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

type AddLaunchModel = InferSchemaType<typeof addLaunchSchema>;

export default model<AddLaunchModel>("AddLaunch", addLaunchSchema);
