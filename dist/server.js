"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: process.env.NODE_ENV === "production" ? ".env.production" : ".env"
});
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(process.env.MONGO_URL, {})
    .then((data) => {
    console.log("MongoDB  connection succeed");
    const PORT = process.env.PORT ?? 3001;
    app_1.default.listen(PORT, function () {
        console.info(`The server is running successfully on port: ${PORT}`);
        console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
})
    .catch((err) => {
    console.log("ERROR on connection MongoDB", err);
});
//# sourceMappingURL=server.js.map