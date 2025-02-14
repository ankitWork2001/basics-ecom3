import {mongoose,Schema} from "mongoose";

const productSchema=new Schema({
    product_name:{
        type:String,
        required:true,
        trim:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_description:{
        type:String,
        trim:true
    },
    product_quantity:{
        type:Number,
        required:true
    }
});

export const Product=mongoose.model("Product",productSchema); 
