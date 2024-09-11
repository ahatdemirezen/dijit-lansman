"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const sectionOrderSchema = new mongoose_1.Schema({
    generalInfoId: {
        type: mongoose_1.Types.ObjectId,
        ref: "GeneralInfo",
        required: true
    },
    sections: [
        {
            name: { type: String },
            order: { type: Number },
            isActive: { type: Boolean },
        }
    ]
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("SectionOrder", sectionOrderSchema);
//# sourceMappingURL=sortingPart.js.map