import {mongoose,Schema} from "mongoose";
import {Product} from "./product.models.js";
import {User} from "./user.models.js"

const itemSchema=new Schema({
    item_id:{
        type: Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    }
});

const cartSchema=new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    item:[itemSchema]
});

export const Cart=mongoose.model("Cart",cartSchema);