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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const product_enum_1 = require("../libs/enums/product.enum");
const productSchema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: true,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productLeftCount: {
        type: Number,
        required: true,
    },
    productDesc: {
        type: String,
    },
    productImages: {
        type: [String],
        default: [],
    },
    productViews: {
        type: Number,
        default: 0,
    },
    productCategory: {
        type: String,
        enum: Object.values(product_enum_1.ProductCategory),
        required: true,
    },
    productMaterialType: {
        type: String,
        enum: Object.values(product_enum_1.ProductMaterialType),
        required: true,
    },
    productStyleType: {
        type: String,
        enum: Object.values(product_enum_1.ProductStyleType),
        required: true,
    },
    productStatus: {
        type: String,
        enum: Object.values(product_enum_1.ProductStatus),
        default: product_enum_1.ProductStatus.PAUSE,
        required: true,
    },
    founderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Member', // Fixed: Use 'Member' as the correct reference
        required: true,
    },
}, { timestamps: true });
// Optional index: Enforce uniqueness on productName + category + material
productSchema.index({ productName: 1, productCategory: 1, productMaterialType: 1 }, { unique: true });
exports.default = mongoose_1.default.model('Product', productSchema);
//# sourceMappingURL=Product.model.js.map