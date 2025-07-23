import { Request, Response} from "express";
import Errors, { HttpCode, Message } from "../libs/utils/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { ProductCategory } from '../libs/enums/product.enum';




const productService = new ProductService;
const productController: T = {};

/** SPA **/
productController.getProducts = async (req: Request, res:Response) => {
    try{
        console.log("getProducts");       
        const {page, limit, order, productCategory, productCollection, search} = req.query;
        const inquiry: ProductInquiry = {
          order: String(order),
          page: Number(page),
          limit: Number(limit),
        
        };
        // Support both productCategory and productCollection for backward compatibility
        if(productCategory) inquiry.productCategory = productCategory as ProductCategory;
        if(productCollection) inquiry.productCategory = productCollection as ProductCategory;

        if(search) inquiry.search = String(search);

        const result = await productService.getProducts(inquiry)

        res.status(HttpCode.OK).json(result)
    } catch(err){
        console.log("ERROR, getProducts", err);
        if( err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard )
        // res.json({})
    }
 }
  

 productController.getProduct = async (req: ExtendedRequest, res:Response) => {
    try{
        console.log("getProduct");       
        const {id} = req.params;
        console.log(req.member)
        const memberId = req.member?._id ?? null;
        const result = await productService.getProduct(memberId, id)

        res.status(HttpCode.OK).json(result)
    } catch(err){
        console.log("ERROR, getProduct", err);
        if( err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard )
    }
 }





/** SSR**/

productController.getAllProducts = async (req:Request, res:Response)=>{
    try{
        console.log("getAllProducts");
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await productService.getAllProducts(page, limit);
        res.render("products", {
            products: result.products,
            pagination: {
                currentPage: result.currentPage,
                totalPages: result.totalPages,
                total: result.total,
                hasNext: result.currentPage < result.totalPages,
                hasPrev: result.currentPage > 1
            }
        });
    } catch(err){
        console.log("ERROR, getAllProducts", err);
        if( err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard )
        // res.json({})
        
    }
    
};
productController.createNewProduct = async (req:AdminRequest, res:Response)=>{
    try{
        console.log("createNewProduct");
        if(!req.files?.length) throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATION_FAILED);

        const data: ProductInput = req.body;
        // Fix: Properly assign founderId from session and convert ObjectId to string
        data.founderId = req.member._id.toString();
        
        // Fix: Ensure proper image path formatting for static file serving
        data.productImages = req.files?.map(ele =>{
            // Remove leading ./ from path and ensure consistent forward slashes
            return ele.path.replace(/\\/g,"/").replace(/^\.\//, "");
        });
        
        console.log("Product data:", data);
        console.log("Product images paths:", data.productImages);
        
        await productService.createNewProduct(data);

        res.send(
            `<script> alert("Successfully creation"); window.location.replace('/admin/product/all') </script>`
          );
    } catch(err){
        console.log("ERROR, createNewProduct", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        
        res.send( 
            `<script> alert("${message}"); window.location.replace('/admin/product/all') </script>`
          );
    }  
};

productController.updateChosenProduct = async (req:Request, res:Response)=>{
    try{

        console.log("updateChosenProduct");
        const id  = req.params.id;
        const result  = await productService.updateChosenProduct(id, req.body)


        res.status(HttpCode.OK).json({ data: result })
    } catch(err){
        console.log("ERROR, updateChosenProduct", err);
        if( err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard )
        // res.json({}) 
    }   
};


export default productController;