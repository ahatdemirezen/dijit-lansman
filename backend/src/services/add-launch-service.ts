import { Document } from "mongoose";
import addLaunchModel from "../models/Launch";

export const getAddLaunch = <T extends Document>(
  model: typeof addLaunchModel<T>
) => {
  return async () => {
    try {
      const addLaunch = await model.find().exec();
      return addLaunch;
    } catch (error) {
      throw new Error("An error occurred while fetching the data");
      return error;
    }
  };
};
