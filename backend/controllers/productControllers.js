import catchAsynError from "../middleware/catchAsynError.js";
import productModel from "../models/productModel.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";

 
 
 
 // getting all products
 export const getProducts = catchAsynError( async (req,res)=>{


      const apiFilters = new APIFilters(productModel, req.query).search().filters();
      const resPerPage = 4;
      let products = await apiFilters.query;
  let filteredProductsCount = products.length;

  apiFilters.pagination(resPerPage);
  products = await apiFilters.query.clone();

  res.status(200).json({
    resPerPage,
    filteredProductsCount,
    products,
  });
})


// get single product from ID => /api/v1/products/id
export const getProductDetails = catchAsynError( async (req,res,next)=>{
     
    const product = await productModel.findById(req?.params?.id);

    if(!product){
         next(new ErrorHandler("product not found", 404))
    }
    res.status(200).json({
        product
    })
})
 


// creating new product => /api/v1/admin/products
export const newProduct = catchAsynError(async (req,res)=>{
     
    const product = await productModel.create(req.body);
    res.status(200).json({
        product
    })
})

// updating product details product => /api/v1/admin/products
export const updateProduct =catchAsynError( async (req,res)=>{
    let product = await productModel.findById(req?.params?.id);

    if(!product){
        next(new ErrorHandler("product not found", 404))
   }

    product = await productModel.findByIdAndUpdate(req?.params?.id, req.body,{new:true})
    res.status(200).json({
        product
    })
})


//deleting product by id
export const deleteProduct =catchAsynError( async (req,res)=>{
     
    let product = await productModel.findById(req?.params?.id);

    if(!product){
        next(new ErrorHandler("product not found", 404))
   }

    await product.deleteOne();
    res.status(200).json({
        message:"product deleted successfully"
    })


})
 