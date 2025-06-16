import { ObjectId } from 'mongoose';
import { ProductCategory, ProductColor, ProductMaterial, ProductStatus, ProductStyle } from '../enums/product.enum';


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
  productMaterial: ProductMaterial;
  productColor: ProductColor;
  productStyle: ProductStyle;
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
  productMaterial: ProductMaterial;
  productColor: ProductColor;
  productStyle: ProductStyle;
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
  productMaterial?: ProductMaterial;
  productColor?: ProductColor;
  productStyle?: ProductStyle;
}

export interface ProductInquiry {
  page: number;
  limit: number;
  search?: string;
  productCategory?: ProductCategory;
}
