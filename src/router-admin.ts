import express from "express";
const routerAdmin = express.Router();
import productController from "./controllers/product.controllers";
import makeUploader from './libs/utils/uploader';
import furnitureController from "./controllers/furniture.controllers";

/** ========== Restaurant Routes ========== **/
routerAdmin.get("/", furnitureController.goHome);

routerAdmin
  .get("/login", furnitureController.getLogin)
  .post("/login", furnitureController.processLogin);

routerAdmin
  .get("/signup", furnitureController.getSignup)
  .post(
    "/signup", 
    makeUploader("members").single("memberImage"),  // handles single image upload for member
    furnitureController.processSignup
  );

routerAdmin.get("/check-me", furnitureController.checkAuthSession); 
routerAdmin.get("/logout", furnitureController.logout);


/** ========== Product Routes ========== **/
routerAdmin.get(
  "/product/all", //endpoint 
  furnitureController.verifyFounder, //Middleware : Authorization
  productController.getAllProducts
);

routerAdmin.post(
  "/product/create", 
  furnitureController.verifyFounder,//Authorization => req.member 
  makeUploader("products").array("productImages", 5), //Multer => req.files
  productController.createNewProduct//req.member req.files boyitildi 
);
// Multer bu form data handler qaysiki postmandan kelgan req 


routerAdmin.post(
  "/product/:id", //params
  furnitureController.verifyFounder,
  productController.updateChosenProduct
);
/**  USER */
routerAdmin.get("/user/all", furnitureController.verifyFounder,
    furnitureController.getUsers
);
routerAdmin.post("/user/edit", furnitureController.verifyFounder,
    furnitureController.updatedChosenUser
);
/** ========== Export ========== **/
export default routerAdmin;
