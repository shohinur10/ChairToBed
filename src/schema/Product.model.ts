import mongoose, { Schema } from 'mongoose';
import { ProductStyle, ProductColor, ProductCategory, ProductMaterial } from '../libs/enums/product.enum';


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
    furnitureStyle: {
      type: String,
      enum: Object.values(ProductStyle),
      required: true,
    },
  },
  { timestamps: true }
);

// Optional index: Enforce uniqueness on name + category + material
productSchema.index(
  { productName: 1, furnitureCategory: 1, furnitureMaterial: 1 },
  { unique: true }
);

export default mongoose.model('FurnitureProduct', productSchema);
