import mongoose, { Schema } from 'mongoose';
import {
  ProductColor,
  ProductCategory,
  ProductMaterial,
  ProductStatus,
} from '../libs/enums/product.enum'; // ✅ Ensure the path is correct

const productSchema = new Schema(
  {
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

    furnitureCategory: {
      type: String,
      enum: Object.values(ProductCategory),
      required: true,
    },
    furnitureMaterial: {
      type: String,
      enum: Object.values(ProductMaterial),
      required: true,
    },
    furnitureColor: {
      type: String,
      enum: Object.values(ProductColor),
      required: true,
    },
  
    productStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.PAUSE,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional index: Enforce uniqueness on productName + category + material
productSchema.index(
  { productName: 1, furnitureCategory: 1, furnitureMaterial: 1 },
  { unique: true }
);

export default mongoose.model('FurnitureProduct', productSchema);
