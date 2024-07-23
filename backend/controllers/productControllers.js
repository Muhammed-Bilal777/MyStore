import catchAsynError from "../middleware/catchAsynError.js";
import productModel from "../models/productModel.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import Product from "../models/productModel.js"
 
 
 
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
        return   next(new ErrorHandler("product not found", 404))
    }
    res.status(200).json({
        product
    })
})
 


// creating new product => /api/v1/admin/products
export const newProduct = catchAsynError(async (req,res)=>{

    req.body.user=req.user._id;
     
    const product = await productModel.create(req.body);
    res.status(200).json({
        product
    })
})

// updating product details product => /api/v1/admin/products
export const updateProduct =catchAsynError( async (req,res)=>{
    let product = await productModel.findById(req?.params?.id);

    if(!product){
      return   next(new ErrorHandler("product not found", 404))
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
        return  next(new ErrorHandler("product not found", 404))
   }

    await product.deleteOne();
    res.status(200).json({
        message:"product deleted successfully"
    })


})



// Create/Update product review   =>  /api/v1/reviews
export const createProductReview = catchAsynError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.rating =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get product reviews   =>  /api/v1/reviews
export const getProductReviews = catchAsynError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    reviews: product.reviews,
  });
});

// Delete product review   =>  /api/v1/admin/reviews
export const deleteReview = catchAsynError(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    numOfReviews === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        numOfReviews;

  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true }
  );

  res.status(200).json({
    success: true,
    product,
  });
})