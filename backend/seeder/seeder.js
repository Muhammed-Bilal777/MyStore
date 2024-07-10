import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import products from "./data.js"
import dotenv from "dotenv"

dotenv.config({path:"backend/config/config.env"})

const seedProduct = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        await productModel.deleteMany();

        console.log("products deleted");

        await productModel.insertMany(products);
        console.log("products added");
        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
        
    }
}

seedProduct()