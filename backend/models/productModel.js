import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type : String,
        required :[true, "please enter product name"],
        maxLength : [200,"product price cannot exceed 200 characters"],
    },
    price:{
        type : Number,
        required :[true, "please enter product price"],
        maxLength : [5,"product price cannot exceed 200 characters"],
    },
    rating:{
        type : Number,
        default : 0,

    },
    description:{
        type : String,
        required :[true, "please enter product description"],
    },
    images : [{
        public_id : {
            type : String,
            requiredd : true,
        },
        url :  {
            type : String,
            requiredd : true,
        },
    }],
    category : {
        type : String,
        required:[true,"please enter product category"],
        enum:{
            values:["Electronics"
                ,"Phone","Accessories","Cameras","Headphones","smartwatch","tablet","Food","Laptops","books","sports","bags" 
            ],
            message : "please select a category"
        }
    },
    seller:{
        type : String,
        required:[true,"please enter product seller"],
    }
    ,
    stock:{
        type : Number,
        required:[true,"please enter product stock"],
    },
    reviews:[
        {
            user:{
                type : mongoose.Schema.ObjectId,
                ref: "User",
                required:false
            },
            rating:{
                type:Number,
                required:true,
            },
            Comment:{
                type:Number,
                required:true,
            }
        }
    ],
    user:{
        type : mongoose.Schema.ObjectId,
        ref: "User",
        required:false,
    },
  
     
}, { timestamps : true});


export default mongoose.model("Product",productSchema);