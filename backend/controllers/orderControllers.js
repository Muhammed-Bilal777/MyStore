import catchAsynError from "../middleware/catchAsynError.js"
import ErrorHandler from "../utils/errorHandler.js";
import Order from "../models/order.js"
import Products from "../models/productModel.js"

//create new order /order/new
export const newOrder = catchAsynError(async (req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo,
        _id,
      } = req.body;
      


      const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentMethod,
        paymentInfo, 
        user: req.user._id,
      })

      res.status(200).json({
        order,
      })
})


//get order details


export const orderDetails = catchAsynError(async (req,res,next)=>{
 const order = await Order.findById(req.params.id).populate("user" ,"name email")

 if(!order){
  return next(new ErrorHandler("Order not found",404))
 }

 res.status(200).json({
  order
 })

})

//get current user details


export const myOrders = catchAsynError(async (req,res,next)=>{
  const orders = await Order.find({user : req.user._id})
  const numberOfOrders = orders.length;
  if(!orders){
   return next(new ErrorHandler("No Order not found",404))
  }
 
  res.status(200).json({
    numberOfOrders,
     orders,
  })
 
 })

 

 //get all orders for admin only


export const allOrders = catchAsynError(async (req,res,next)=>{
  const orders = await Order.find()
  const numberOfOrders = orders.length;
  if(!orders){
   return next(new ErrorHandler("No Order not found",404))
  }
 
  res.status(200).json({
    numberOfOrders,
     orders,
  })
 
 })

  // Update Order - ADMIN  =>  /api/v1/admin/orders/:id
export const updateOrders = catchAsynError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  if (order?.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // Update products stock
  order?.orderItems?.forEach(async (item) => {
    const product = await Products.findById(item?.product?.toString());
    if (!product) {
      return next(new ErrorHandler("No Product found with this ID", 404));
    }
    product.stock = product.stock - item.quantity;
    await product.save({ validateBeforeSave: false });
  });

  order.orderStatus = req.body.status;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});


// Delete order  =>  /api/v1/admin/orders/:id
export const deleteOrder = catchAsynError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
  });
});
