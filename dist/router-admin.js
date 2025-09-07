"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routerAdmin = express_1.default.Router();
const product_controllers_1 = __importDefault(require("./controllers/product.controllers"));
const uploader_1 = __importDefault(require("./libs/utils/uploader"));
const furniture_controllers_1 = __importDefault(require("./controllers/furniture.controllers"));
/** ========== Restaurant Routes ========== **/
routerAdmin.get("/", furniture_controllers_1.default.goHome);
routerAdmin
    .get("/signup", furniture_controllers_1.default.getSignup)
    .post("/signup", (0, uploader_1.default)("members").single("memberImage"), // handles single image upload for member
furniture_controllers_1.default.processSignup);
routerAdmin
    .get("/login", furniture_controllers_1.default.getLogin)
    .post("/login", furniture_controllers_1.default.processLogin);
// Modern Logout Routes
routerAdmin.get("/logout", furniture_controllers_1.default.verifyFounder, furniture_controllers_1.default.getLogout);
routerAdmin.get("/logout-confirm", furniture_controllers_1.default.logout);
// Add profile route - using controller method instead of inline function
routerAdmin.get("/profile", furniture_controllers_1.default.verifyFounder, furniture_controllers_1.default.getProfile);
/** ========== Product Routes ========== **/
routerAdmin.get("/product/all", //endpoint 
furniture_controllers_1.default.verifyFounder, //Middleware : Authorization
product_controllers_1.default.getAllProducts);
routerAdmin.post("/product/create", furniture_controllers_1.default.verifyFounder, //Authorization => req.member 
(0, uploader_1.default)("products").array("productImages", 5), //Multer => req.files
product_controllers_1.default.createNewProduct //req.member req.files boyitildi 
);
// Multer bu form data handler qaysiki postmandan kelgan req 
routerAdmin.post("/product/:id", //params
furniture_controllers_1.default.verifyFounder, product_controllers_1.default.updateChosenProduct);
/** ========== User Routes ========== **/
routerAdmin.get("/user/all", furniture_controllers_1.default.verifyFounder, furniture_controllers_1.default.getUsers);
routerAdmin.post("/user/edit", furniture_controllers_1.default.verifyFounder, furniture_controllers_1.default.updatedChosenUser);
exports.default = routerAdmin;
//# sourceMappingURL=router-admin.js.map