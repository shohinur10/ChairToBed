import express from "express";
const routerAdmin = express.Router();
import productController from "./controllers/product.controllers";
import makeUploader from './libs/utils/uploader';
import furnitureController from "./controllers/furniture.controllers";
import { AdminRequest } from "./libs/types/member";
import { Response } from "express";

/** ========== Restaurant Routes ========== **/
routerAdmin.get("/", furnitureController.goHome);

routerAdmin
  .get("/signup", furnitureController.getSignup)
  .post(
    "/signup", 
    makeUploader("members").single("memberImage"),  // handles single image upload for member
    furnitureController.processSignup
  );

routerAdmin
  .get("/login", furnitureController.getLogin)
  .post("/login", furnitureController.processLogin);

// Modern Logout Routes
routerAdmin.get("/logout", furnitureController.verifyFounder, furnitureController.getLogout);
routerAdmin.get("/logout-confirm", furnitureController.logout);

// Add profile route - using controller method instead of inline function
routerAdmin.get("/profile", furnitureController.verifyFounder, furnitureController.getProfile);

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

/** ========== User Routes ========== **/
routerAdmin.get(
  "/user/all", 
  furnitureController.verifyFounder,
    furnitureController.getUsers
);

routerAdmin.post(
  "/user/edit", 
  furnitureController.verifyFounder,
    furnitureController.updatedChosenUser
);

export default routerAdmin;
