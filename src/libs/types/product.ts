mport { ObjectId } from 'mongoose';
import { ProductVolume,} from '../enums/product.enum';
import { ProductStatus, 
    ProductSize,ProductCollection } from '../enums/product.enum';

    export interface Product{
        _id: ObjectId;
        productStatus: ProductStatus;
        productCollection: ProductCollection;
        productName :string;
        productPrice: number;
        productLeftCount: number;
        productSize: ProductSize;
        ProductVolume: number;
        productDesc?: string;
        productImages: string[];
        productViews:number;
        createdAt: Date;
        updatedAt: Date;
    }

    export interface ProductInquiry{
        order:string;
        page: number;
        limit:number;
        productCollection: ProductCollection;
        search: string;
    }
export interface ProductInput{
    productStatus?: ProductStatus;
    productCollection: ProductCollection;
    productName :string;
    productPrice: number;
    productLeftCount: number;
    productSize?: ProductSize;
    ProductVolume?: number;
    productDesc?: string;
    productImages?: string[];
    productViews?:number;
}
    export interface ProductUpdateInput{
        _id: ObjectId;
        productStatus?: ProductStatus;
        productCollection?: ProductCollection;
        productName?:string;
        productPrice?: number;
        productLeftCount: number;
        productSize?: ProductSize;
        ProductVolume?: number;
        productDesc?: string;
        productImages?: string[];
        productViews?:number;
}