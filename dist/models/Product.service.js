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
// Ensure the correct path to the Product.model file
const Product_model_1 = __importDefault(require("../schema/Product.model")); // Update the path if necessary
const Errors_1 = __importStar(require("../libs/utils/Errors"));
const config_1 = require("../libs/utils/config");
const view_enum_1 = require("../libs/enums/view.enum");
const View_service_1 = __importDefault(require("./View.service"));
class ProductService {
    constructor() {
        this.productModel = Product_model_1.default ?? {};
        this.viewService = new View_service_1.default();
    }
    /** SPA */
    async getProducts(inquiry) {
        const match = {};
        if (inquiry.productCategory)
            match.productCategory = inquiry.productCategory;
        if (inquiry.search)
            match.productName = {
                $regex: new RegExp(inquiry.search, "i")
            }; // regular expression  case-intensive "I"
        const sort = inquiry.order === "productPrice"
            ? { [inquiry.order]: 1 }
            : { [inquiry.order]: -1 };
        const result = await this.productModel
            .aggregate([
            { $match: match }, // bu mongoDb syntax
            { $sort: sort },
            { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, //$skip: skips documents for pagination ((page - 1) * limit)
            { $limit: inquiry.limit * 1 },
        ])
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        return result;
    }
    async getProduct(memberId, id) {
        const productId = (0, config_1.shapeIntoMongooseObjectId)(id);
        let result = await this.productModel.findOne({
            _id: productId,
            //      productStatus: ProductStatus.PROCESS,
        })
            .exec();
        if (!result)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        if (memberId) {
            //Check existence
            const input = {
                memberId: memberId,
                viewRefId: productId,
                ViewGroup: view_enum_1.ViewGroup.PRODUCT
            };
            const existView = await this.viewService.checkViewExistence(input);
            console.log("exist:", !!existView);
            if (!existView) {
                // Insert View
                console.log("planning to insert new view");
                await this.viewService.insertMemberView(input);
                // Increase Counts
                result = await this.productModel.findByIdAndUpdate(productId, // filter
                { $inc: { productViews: +1 } }, // update
                { new: true } // option
                );
            }
        }
        if (!result) {
            throw new Errors_1.default(Errors_1.HttpCode.NOT_FOUND, Errors_1.Message.NO_DATA_FOUND);
        }
        return result.toObject();
    }
    /** SSR */
    async getAllProducts(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        // Get total count for pagination
        const total = await this.productModel.countDocuments().exec();
        // Get paginated results
        const products = await this.productModel
            .find()
            .sort({ createdAt: -1 }) // Show newest first
            .skip(skip)
            .limit(limit)
            .exec();
        if (!products)
            throw new Errors_1.default(Errors_1.HttpCode.NOT_MODIFIED, Errors_1.Message.UPDATE_FAILED);
        return {
            products,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        };
    }
    async createNewProduct(input) {
        try {
            const result = await this.productModel.create(input);
            return result.toObject();
        }
        catch (err) {
            console.error("Error creating product:", err);
            throw new Errors_1.default(Errors_1.HttpCode.INTERNAL_SERVER_ERROR, Errors_1.Message.CREATION_FAILED);
        }
    }
    async updateChosenProduct(id, input) {
        try {
            id = (0, config_1.shapeIntoMongooseObjectId)(id);
            //input ichidan id qabul qilib uni shape qilib olamiz 
            const result = await this.productModel.findOneAndUpdate({ _id: id }, //filter
            input, // update
            { new: true } // options
            ).exec();
            if (!result) {
                throw new Errors_1.default(Errors_1.HttpCode.NOT_MODIFIED, Errors_1.Message.UPDATE_FAILED);
            }
            console.log("result:", result);
            return result.toObject();
        }
        catch (err) {
            console.error("Error, model:updateChosenProduct:", err);
            throw new Errors_1.default(Errors_1.HttpCode.BAD_REQUEST, Errors_1.Message.UPDATE_FAILED);
        }
    }
}
exports.default = ProductService;
//# sourceMappingURL=Product.service.js.map