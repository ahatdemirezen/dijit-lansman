"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddLaunch = void 0;
const getAddLaunch = (model) => {
    return async () => {
        try {
            const addLaunch = await model.find().exec();
            return addLaunch;
        }
        catch (error) {
            throw new Error("An error occurred while fetching the data");
            return error;
        }
    };
};
exports.getAddLaunch = getAddLaunch;
//# sourceMappingURL=add-launch-service.js.map