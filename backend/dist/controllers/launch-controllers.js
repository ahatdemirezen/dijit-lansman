"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddLaunch = exports.updateAddLaunch = exports.createAddLaunch = exports.getAddLaunchById = exports.getAddLaunchHandler = void 0;
const Launch_1 = __importDefault(require("../models/Launch"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_errors_1 = __importDefault(require("http-errors"));
const add_launch_service_1 = require("../services/add-launch-service");
const seoSettings_1 = __importDefault(require("../models/seoSettings"));
const deployDesign_1 = __importDefault(require("../models/deployDesign"));
const fetchAddLaunch = (0, add_launch_service_1.getAddLaunch)(Launch_1.default);
const getAddLaunchHandler = async (req, res, next) => {
    try {
        const addLaunchData = await fetchAddLaunch();
        res.status(200).json(addLaunchData);
    }
    catch (error) {
        next(error);
    }
};
exports.getAddLaunchHandler = getAddLaunchHandler;
const getAddLaunchById = async (req, res, next) => {
    const { launchId } = req.params;
    try {
        if (!mongoose_1.default.isValidObjectId(launchId)) {
            throw (0, http_errors_1.default)(400, "Invalid launchId format");
        }
        const addLaunch = await Launch_1.default.findById(launchId).exec();
        if (!addLaunch) {
            throw (0, http_errors_1.default)(404, "Launch not found");
        }
        res.status(200).json(addLaunch);
    }
    catch (error) {
        next(error);
    }
};
exports.getAddLaunchById = getAddLaunchById;
const createAddLaunch = async (req, res, next) => {
    const { launchName, language, groupNumber, companyName, companyLogo, launchDate, // launchDate'i ekleyin
    endDate, // endDate'i ekleyin
    sequenceNumber, isActive, showOnHomepage, } = req.body;
    try {
        const newAddLaunch = await Launch_1.default.create({
            launchName,
            language,
            groupNumber,
            companyName,
            companyLogo,
            launchDate, // Date objesi yerine direkt string olarak kaydediyoruz
            endDate, // Date objesi yerine direkt string olarak kaydediyoruz
            sequenceNumber,
            isActive,
            showOnHomepage,
        });
        res.status(201).json(newAddLaunch);
    }
    catch (error) {
        next(error);
    }
};
exports.createAddLaunch = createAddLaunch;
const updateAddLaunch = async (req, res, next) => {
    const { launchId } = req.params;
    const updateData = req.body;
    try {
        if (!mongoose_1.default.isValidObjectId(launchId)) {
            throw (0, http_errors_1.default)(400, "Invalid launchId");
        }
        // Tarihleri string olarak kaydedin
        const updatedAddLaunch = await Launch_1.default.findByIdAndUpdate(launchId, { $set: updateData }, // Date objesi yerine direkt string olarak kaydediyoruz
        { new: true, runValidators: true });
        if (!updatedAddLaunch) {
            throw (0, http_errors_1.default)(404, "Launch not found");
        }
        res.status(200).json(updatedAddLaunch);
    }
    catch (error) {
        next(error);
    }
};
exports.updateAddLaunch = updateAddLaunch;
const deleteAddLaunch = async (req, res, next) => {
    const { launchId } = req.params;
    try {
        if (!mongoose_1.default.isValidObjectId(launchId)) {
            throw (0, http_errors_1.default)(400, "Invalid launchId");
        }
        // İlk olarak, ana lansmanı silin
        const deletedLaunch = await Launch_1.default.findByIdAndDelete(launchId);
        if (!deletedLaunch) {
            throw (0, http_errors_1.default)(404, "Launch not found");
        }
        await seoSettings_1.default.deleteMany({ launchId });
        await deployDesign_1.default.deleteMany({ launchId });
        res
            .status(200)
            .json({ message: "Launch and related data deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteAddLaunch = deleteAddLaunch;
//# sourceMappingURL=launch-controllers.js.map