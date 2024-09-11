import { Schema, model, InferSchemaType, Types } from "mongoose";

const seoSettingsSchema = new Schema(
  {
    launchId: {
      type: Types.ObjectId,
      ref: "AddLaunch", // AddLaunch şemasının ID'sine referans
      required: true,
    },
    title: {
      type: String,
    },
    keywords: {
      type: String,
    },
    description: {
      type: String,
    },
    socialImage: {
      type: String,
    },
    indexStatus: {
      type: Boolean,
      default: false,
    },
    followStatus: {
      type: Boolean,
      default: false,
    },
    launchUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

type SeoSettingsModel = InferSchemaType<typeof seoSettingsSchema>;

export default model<SeoSettingsModel>("SeoSettings", seoSettingsSchema);
