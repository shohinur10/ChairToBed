"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const member_controller_1 = __importDefault(require("./controllers/member.controller"));
const order_controller_1 = __importDefault(require("./controllers/order.controller"));
const product_controllers_1 = __importDefault(require("./controllers/product.controllers"));
const uploader_1 = __importDefault(require("./libs/utils/uploader"));
const router = express_1.default.Router();
/** Member  */
router.get("/member/founder", member_controller_1.default.getFounder);
router.post("/member/login", member_controller_1.default.login);
router.post("/member/signup", member_controller_1.default.signup);
router.post("/member/logout", member_controller_1.default.logout);
router.get("/member/detail", member_controller_1.default.verifyAuth, member_controller_1.default.getMemberDetails);
router.post("/member/update", member_controller_1.default.verifyAuth, (0, uploader_1.default)("members").single("memberImage"), member_controller_1.default.updateMember);
// Add specific route for member image updates with error handling
router.post("/member/update-image", member_controller_1.default.verifyAuth, (req, res, next) => {
    const upload = (0, uploader_1.default)("members").single("memberImage");
    upload(req, res, (err) => {
        if (err) {
            console.log("Multer error:", err);
            return res.status(400).json({
                error: true,
                message: "File upload error: " + err.message
            });
        }
        next();
    });
}, member_controller_1.default.updateMemberImage);
router.get("/member/top-users", member_controller_1.default.getTopUsers);
/**Product  */
router.get("/product/all", product_controllers_1.default.getProducts);
router.get("/product/:id", member_controller_1.default.retrieveAuth, product_controllers_1.default.getProduct);
/** Orders */
router.post("/order/create", member_controller_1.default.verifyAuth, order_controller_1.default.createOrder);
router.get("/order/all", member_controller_1.default.verifyAuth, order_controller_1.default.getMyOrders);
router.post("/order/update", member_controller_1.default.verifyAuth, order_controller_1.default.updateOrder);
exports.default = router;
//# sourceMappingURL=router.js.map