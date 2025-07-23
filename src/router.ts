import express from "express";
import memberController from "./controllers/member.controller";
import orderController from "./controllers/order.controller";
import productController from "./controllers/product.controllers";
import uploader from "./libs/utils/uploader";
const router = express.Router();



/** Member  */
router.get("/member/founder",memberController.getFounder);
router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);
router.post("/member/logout", memberController.logout);
router.get("/member/detail", 
    memberController.verifyAuth,
    memberController.getMemberDetails
);

router.post("/member/update", 
    memberController.verifyAuth, 
    uploader("members").single("memberImage"),
        memberController.updateMember
    );

router.get("/member/top-users",
    memberController.getTopUsers
)



/**Product  */
router.get("/product/all", productController.getProducts);
router.get("/product/:id", memberController.retrieveAuth, productController.getProduct)


/** Orders */ 
router.post("/order/create", 
    memberController.verifyAuth,
    orderController.createOrder);

router.get("/order/all",
    memberController.verifyAuth,
    orderController.getMyOrders
);
router.post("/order/update", 
    memberController.verifyAuth,
     orderController.updateOrder);


export default router;

