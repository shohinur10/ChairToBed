import mongoose, { Schema } from 'mongoose';
import { ProductCategory, ProductMaterialType, ProductStatus, ProductStyleType } from '../libs/enums/product.enum';

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

    productCategory: {
      type: String,
      enum: Object.values(ProductCategory),
      required: true,
    },
    productMaterialType: {
      type: String,
      enum: Object.values(ProductMaterialType),
      required: true,
    },
    productStyleType: {
      type: String,
      enum: Object.values(ProductStyleType),
      required: true,
    },
  
    productStatus: {
      type: String,
      enum: Object.values(ProductStatus),
      default: ProductStatus.PAUSE,
      required: true,
    },
    founderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',  // Fixed: Use 'Member' as the correct reference
      required: true,
    },
  },
  { timestamps: true }
);

// Optional index: Enforce uniqueness on productName + category + material
productSchema.index(
  { productName: 1, productCategory: 1, productMaterialType: 1 },
  { unique: true }
);

export default mongoose.model('Product', productSchema);
