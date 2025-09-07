"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
/** MULTER IMAGE UPLOADER **/
function getTargetImageStorage(address) {
    return multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `./uploads/${address}`);
        },
        filename: function (req, file, cb) {
            const extension = path_1.default.parse(file.originalname).ext;
            const random_name = (0, uuid_1.v4)() + extension;
            cb(null, random_name);
        },
    });
}
const makeUploader = (address) => {
    const storage = getTargetImageStorage(address);
    return (0, multer_1.default)({ storage: storage });
};
exports.default = makeUploader;
// Uncommented and properly structured `uploadProductImage`
// const productStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads/products");
//     },
//     filename: function (req, file, cb) {
//         console.log(file);
//         const extension = path.extname(file.originalname).ext; // ext bu yuklanyotgan rasm di type aniqleydi  png , jpg va etc 
//         const random_name = v4() + extension;
//         cb(null, random_name);
//     }
// });
// export const uploadProductImage = multer({ storage: productStorage });
//# sourceMappingURL=uploader.js.map