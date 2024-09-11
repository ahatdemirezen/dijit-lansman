"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSectionOrder = void 0;
const sortingPart_1 = __importDefault(require("../models/sortingPart"));
const updateSectionOrder = async (req, res, next) => {
    const { generalInfoId, sections } = req.body;
    try {
        if (!generalInfoId || !Array.isArray(sections)) {
            return res.status(400).json({ message: "Invalid input data" });
        }
        for (const section of sections) {
            await sortingPart_1.default.updateOne({ generalInfoId, "sections.name": section.name }, {
                $set: {
                    "sections.$.order": section.order,
                    "sections.$.isActive": section.isActive,
                },
            });
        }
        res.status(200).json({ message: "Section order updated successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSectionOrder = updateSectionOrder;
//# sourceMappingURL=sorting.js.map