"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const add_launch_route_1 = __importDefault(require("./routes/add-launch-route"));
const seo_settings_route_1 = __importDefault(require("./routes/seo-settings-route"));
const media_route_1 = __importDefault(require("./routes/media-route"));
const deploy_design_route_1 = __importDefault(require("./routes/deploy-design-route"));
const login_route_1 = __importDefault(require("./routes/login-route"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = require("http-errors");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const app = (0, express_1.default)();
// CORS'u etkinleştir
app.use((0, cors_1.default)({
    origin: process.env.FE_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, morgan_1.default)("dev"));
// İstek boyutu sınırını arttır
app.use(express_1.default.json({ limit: "1000mb" }));
app.use(express_1.default.urlencoded({ limit: "1000mb", extended: true }));
app.get("/", (req, res) => {
    res.send("Welcome to the Homepage!");
});
(0, db_1.default)();
app.use("/api/launch", add_launch_route_1.default);
app.use("/api/media", media_route_1.default);
app.use("/api/seoSettings", seo_settings_route_1.default);
app.use("/api/deployDesign", deploy_design_route_1.default);
app.use("/api/login", login_route_1.default);
app.use((error, req, res, next) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
// Veritabanı bağlantısını ve sunucuyu başlat
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map