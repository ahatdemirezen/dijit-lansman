"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const deployDesignSchema = new mongoose_1.Schema({
    launchId: {
        type: mongoose_1.Types.ObjectId,
        ref: "AddLaunch",
        required: true,
    },
    name: { type: String, required: true },
    inTrailer: { type: Boolean, required: true },
    preview: { type: Boolean, required: true },
    content: { type: mongoose_1.Schema.Types.Mixed, required: true }, // "components" yerine "content"
    type: {
        type: String,
        required: true, // "type" alanı zorunlu olarak işaretlenir
    },
    sequenceNumber: {
        type: Number,
        required: true, // Sıra numarası zorunlu olarak işaretlenir
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("DeployDesign", deployDesignSchema);
//# sourceMappingURL=deployDesign.js.map