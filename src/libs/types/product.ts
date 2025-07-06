import { ObjectId } from 'mongoose';
import { ProductCategory, ProductMaterialType, ProductStatus, ProductStyleType,} from '../enums/product.enum';


export interface Product {
  _id: ObjectId;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  productStatus: ProductStatus;
  productCategory: ProductCategory;
  productMaterialType: ProductMaterialType;
  productStyleType: ProductStyleType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInput {
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productDesc?: string;
  productImages?: string[];
  productStatus?: ProductStatus;
  productCategory: ProductCategory;
  productMaterialType: ProductMaterialType;
  productStyleType: ProductStyleType;
}

export interface ProductUpdateInput {
  _id: ObjectId;
  productName?: string;
  productPrice?: number;
  productLeftCount?: number;
  productDesc?: string;
  productImages?: string[];
  productStatus?: ProductStatus;
  productCategory?: ProductCategory;
  productMaterialType?: ProductMaterialType;
  productStyleType?: ProductStyleType;
}

export interface ProductInquiry {
  order: string;
  page: number;
  limit: number;
  search?: string;
  productCategory?: ProductCategory;
}
