import productModel from "../models/productModel.js";
import ErrorHandler from "../utils/errorHandler.js";

 
 
 
 // getting all products
 export const getProducts = async (req,res)=>{

     const products = await productModel.find();


    res.status(200).json({
        products,
        message:"all products"
    })
}


// get single product from ID => /api/v1/products/id
export const getProductDetails = async (req,res,next)=>{
     
    const product = await productModel.findById(req?.params?.id);

    if(!product){
         next(new ErrorHandler("product not found", 404))
    }
    res.status(200).json({
        product
    })
}
 


// creating new product => /api/v1/admin/products
export const newProduct = async (req,res)=>{
     
    const product = await productModel.create(req.body);
    res.status(200).json({
        product
    })
}

// updating product details product => /api/v1/admin/products
export const updateProduct = async (req,res)=>{
    let product = await productModel.findById(req?.params?.id);

    if(!product){
        res.status(404).json({
            error:"product not found"
        })
    }

    product = await productModel.findByIdAndUpdate(req?.params?.id, req.body,{new:true})
    res.status(200).json({
        product
    })
}


//deleting product by id
export const deleteProduct = async (req,res)=>{
     
    let product = await productModel.findById(req?.params?.id);

    if(!product){
        res.status(404).json({
            error:"product not found"
        })
    }

    await product.deleteOne();
    res.status(200).json({
        message:"product deleted successfully"
    })


}
 