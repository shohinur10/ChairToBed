
// Ensure the correct path to the Product.model file
import ProductModel from "../schema/Product.model"; // Update the path if necessary
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import { shapeIntoMongooseObjectId } from "../libs/utils/config";
import { ProductStatus } from "../libs/enums/product.enum"
import { T } from "../libs/types/common";
import { ObjectId } from "mongoose";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";
import ViewService from "./View.service";
import { Product, ProductInput, ProductInquiry, ProductUpdateInput } from "../libs/types/product";

    class ProductService {
      static updateChosenProduct(id: string, body: any) {
        throw new Error("Method not implemented.");
      }
      static createNewProduct(data: ProductInput) {
        throw new Error("Method not implemented.");
      }
      static getAllProducts() {
        throw new Error("Method not implemented.");
      }
        private readonly productModel: any;
       public viewService: ViewService; // Replace 'ViewService' with the actual type if different
       
       constructor() {
           this.productModel = ProductModel ?? {};
           this.viewService = new ViewService(); // Correctly initialize 'viewService'
       }

    /** SPA */
    public async getProducts(inquiry: ProductInquiry): Promise<Product[]>{
      const match: T ={};
      if (inquiry.productCategory)
        match.ProductCategory= inquiry.productCategory;
      if (inquiry.search)
      match.productName ={
      $regex:new RegExp(inquiry.search, "i")}; // regular expression  case-intensive "I"
        const sort: T =
          inquiry.order === "productPrice"
            ? { [inquiry.order]: 1 }
            : { [inquiry.order]: -1 };

        const result  = await this.productModel
        .aggregate([
          { $match: match},  // bu mongoDb syntax
          { $sort: sort },
          { $skip: (inquiry.page * 1 - 1) * inquiry.limit }, //$skip: skips documents for pagination ((page - 1) * limit)
          { $limit: inquiry.limit * 1 },
        ])
       .exec();
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      return result;
    }

    public async getProduct(memberId: ObjectId | null, id: string):Promise<Product>{
      const productId = shapeIntoMongooseObjectId(id);
      
      let result  = await this.productModel.findOne({
          _id : productId,
          productStatus: ProductStatus.PROCESS,
      })
      .exec();

      if(!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

      if(memberId) {
          //Check existence
          const input: ViewInput = {
              memberId: memberId,
              viewRefId: productId,
              ViewGroup : ViewGroup.PRODUCT
          };
          const existView = await this.viewService.checkViewExistence(input);
          
          console.log("exist:", !!existView)
          if(!existView) {
              // Insert View
              console.log("planning to insert new view")
              await this.viewService.insertMemberView(input);

              // Increase Counts
              result = await this.productModel.findByIdAndUpdate(
                  productId,  // filter
                  { $inc: { productViews: +1 }}, // update
                  { new: true }   // option
              );
          }


      }

      if (!result) {
          throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
      }
      return result.toObject() as Product;
  }

    /** SSR */
    public async getAllProducts(): Promise<Product[]>{
      const result = await this.productModel.find().exec();
      if(!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

       return result;

  }

public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      const result = await this.productModel.create(input);
      return result.toObject() as Product;
    } catch (err) {
      console.error("Error creating product:", err);
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATION_FAILED);
    }
  } 
public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput
): Promise<Product> {
    try {
        id = shapeIntoMongooseObjectId(id);
        //input ichidan id qabul qilib uni shape qilib olamiz 
        const result = await this.productModel.findOneAndUpdate(
            { _id: id },//filter
            input,// update
            { new: true }// options
        ).exec();
        if (!result) {
            throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
        }
        console.log("result:", result);
        return result.toObject() as Product;
    } catch (err) {
        console.error("Error, model:updateChosenProduct:", err);
        throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);
    }
}
}

export default ProductService;