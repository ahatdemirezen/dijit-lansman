"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const seoSettingsSchema = new mongoose_1.Schema({
    launchId: {
        type: mongoose_1.Types.ObjectId,
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
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("SeoSettings", seoSettingsSchema);
//# sourceMappingURL=seoSettings.js.map