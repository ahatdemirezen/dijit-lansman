"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const addLaunchSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("AddLaunch", addLaunchSchema);
//# sourceMappingURL=Launch.js.map