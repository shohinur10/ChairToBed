"use strict";
// src/enums/product.enum.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStatus = exports.ProductStyleType = exports.ProductMaterialType = exports.ProductCategory = void 0;
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["BEDROOM"] = "BEDROOM";
    ProductCategory["OFFICE"] = "OFFICE";
    ProductCategory["KITCHEN"] = "KITCHEN";
    ProductCategory["OUTDOOR"] = "OUTDOOR";
    ProductCategory["OTHER"] = "OTHER";
    ProductCategory["KIDS"] = "KIDS";
})(ProductCategory || (exports.ProductCategory = ProductCategory = {}));
var ProductMaterialType;
(function (ProductMaterialType) {
    ProductMaterialType["WOOD"] = "WOOD";
    ProductMaterialType["METAL"] = "METAL";
    ProductMaterialType["GLASS"] = "GLASS";
    ProductMaterialType["PLASTIC"] = "PLASTIC";
    ProductMaterialType["FABRIC"] = "FABRIC";
    ProductMaterialType["LEATHER"] = "LEATHER";
    ProductMaterialType["MARBLE"] = "MARBLE";
    ProductMaterialType["BAMBOO"] = "BAMBOO";
})(ProductMaterialType || (exports.ProductMaterialType = ProductMaterialType = {}));
var ProductStyleType;
(function (ProductStyleType) {
    ProductStyleType["MODERN"] = "MODERN";
    ProductStyleType["CONTEMPORARY"] = "CONTEMPORARY";
    ProductStyleType["TRADITIONAL"] = "TRADITIONAL";
    ProductStyleType["RUSTIC"] = "RUSTIC";
    ProductStyleType["INDUSTRIAL"] = "INDUSTRIAL";
    ProductStyleType["SCANDINAVIAN"] = "SCANDINAVIAN";
    ProductStyleType["BOHEMIAN"] = "BOHEMIAN";
    ProductStyleType["VINTAGE"] = "VINTAGE";
    ProductStyleType["MINIMALIST"] = "MINIMALIST";
})(ProductStyleType || (exports.ProductStyleType = ProductStyleType = {}));
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["PAUSE"] = "PAUSE";
    ProductStatus["PROCESS"] = "PROCESS";
    ProductStatus["DELETE"] = "DELETE";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
//# sourceMappingURL=product.enum.js.map