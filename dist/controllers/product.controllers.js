"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Errors_1 = __importStar(require("../libs/utils/Errors"));
const Product_service_1 = __importDefault(require("../models/Product.service"));
const productService = new Product_service_1.default;
const productController = {};
/** SPA **/
productController.getProducts = async (req, res) => {
    try {
        console.log("getProducts");
        const { page, limit, order, productCategory, productCollection, search } = req.query;
        const inquiry = {
            order: String(order),
            page: Number(page),
            limit: Number(limit),
        };
        // Support both productCategory and productCollection for backward compatibility
        if (productCategory)
            inquiry.productCategory = productCategory;
        if (productCollection)
            inquiry.productCategory = productCollection;
        if (search)
            inquiry.search = String(search);
        const result = await productService.getProducts(inquiry);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (err) {
        console.log("ERROR, getProducts", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
        // res.json({})
    }
};
productController.getProduct = async (req, res) => {
    try {
        console.log("getProduct");
        const { id } = req.params;
        console.log(req.member);
        const memberId = req.member?._id ?? null;
        const result = await productService.getProduct(memberId, id);
        res.status(Errors_1.HttpCode.OK).json(result);
    }
    catch (err) {
        console.log("ERROR, getProduct", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
    }
};
/** SSR**/
productController.getAllProducts = async (req, res) => {
    try {
        console.log("getAllProducts");
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await productService.getAllProducts(page, limit);
        // Cast req to AdminRequest to access member data
        const adminReq = req; // We know this is an AdminRequest due to middleware
        res.render("products", {
            products: result.products,
            member: adminReq.member || null, // Pass member data to template
            pagination: {
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total,
                hasNext: result.currentPage < result.totalPages,
                hasPrev: result.currentPage > 1
            }
        });
    }
    catch (err) {
        console.log("ERROR, getAllProducts", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
        // res.json({})
    }
};
productController.createNewProduct = async (req, res) => {
    try {
        console.log("createNewProduct");
        if (!req.files?.length)
            throw new Errors_1.default(Errors_1.HttpCode.INTERNAL_SERVER_ERROR, Errors_1.Message.CREATION_FAILED);
        const data = req.body;
        // Fix: Properly assign founderId from session and convert ObjectId to string
        data.founderId = req.member._id.toString();
        // Fix: Ensure proper image path formatting for static file serving
        data.productImages = req.files?.map(ele => {
            // Remove leading ./ from path and ensure consistent forward slashes
            return ele.path.replace(/\\/g, "/").replace(/^\.\//, "");
        });
        console.log("Product data:", data);
        console.log("Product images paths:", data.productImages);
        await productService.createNewProduct(data);
        res.send(`<script> alert("Successfully creation"); window.location.replace('/admin/product/all') </script>`);
    }
    catch (err) {
        console.log("ERROR, createNewProduct", err);
        const message = err instanceof Errors_1.default ? err.message : Errors_1.Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`);
    }
};
productController.updateChosenProduct = async (req, res) => {
    try {
        console.log("updateChosenProduct");
        const id = req.params.id;
        const result = await productService.updateChosenProduct(id, req.body);
        res.status(Errors_1.HttpCode.OK).json({ data: result });
    }
    catch (err) {
        console.log("ERROR, updateChosenProduct", err);
        if (err instanceof Errors_1.default)
            res.status(err.code).json(err);
        else
            res.status(Errors_1.default.standard.code).json(Errors_1.default.standard);
        // res.json({}) 
    }
};
exports.default = productController;
//# sourceMappingURL=product.controllers.js.map