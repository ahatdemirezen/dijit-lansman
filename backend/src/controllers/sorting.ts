import { RequestHandler } from "express";
import SectionOrder from "../models/sortingPart";

export const updateSectionOrder: RequestHandler = async (req, res, next) => {
  const { generalInfoId, sections } = req.body;

  try {
    if (!generalInfoId || !Array.isArray(sections)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    for (const section of sections) {
      await SectionOrder.updateOne(
        { generalInfoId, "sections.name": section.name },
        {
          $set: {
            "sections.$.order": section.order,
            "sections.$.isActive": section.isActive,
          },
        }
      );
    }

    res.status(200).json({ message: "Section order updated successfully" });
  } catch (error) {
    next(error);
  }
};
