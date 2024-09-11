"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const login_1 = __importDefault(require("../models/login"));
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret"; // .env dosyasından JWT_SECRET alınır
const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error("API_URL is not defined in the environment variables");
}
// Kullanıcı oluşturma kontrolcüsü ve doğrulama
const createUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Firmanın API'sine POST isteği gönder
        const apiResponse = await axios_1.default.post(API_URL, { email, password });
        // Eğer firmanın API'sinden olumlu yanıt geldiyse
        if (apiResponse.status === 200) {
            const newUser = new login_1.default({ email, password });
            await newUser.save();
            // Firma API'sinden dönen verileri alın
            const { role } = apiResponse.data;
            // Eğer role "company-admin" ise JWT oluştur
            let token;
            if (role === "company-admin") {
                token = jsonwebtoken_1.default.sign({ email, role }, JWT_SECRET, { expiresIn: "1h" });
            }
            // Firma API'sinden dönen tüm veriyi ve varsa token'ı kullanıcıya ilet
            res.status(200).json({ ...apiResponse.data, token });
        }
        else {
            // Firma API'si başarısız yanıt verdiyse hata dön
            res
                .status(apiResponse.status)
                .json({ message: "Kullanıcı doğrulanamadı", error: apiResponse.data });
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && error.response) {
            res
                .status(error.response.status)
                .json({ message: "Firma API'si hatası", error: error.response.data });
        }
        else {
            res.status(500).json({ message: "Sunucu hatası", error });
        }
    }
};
exports.createUser = createUser;
//# sourceMappingURL=login-controller.js.map