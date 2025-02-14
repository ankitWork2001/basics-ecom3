import mongoose ,{Schema} from "mongoose";
const discountSchema=new Schema({
    code:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    percentage:{
        type:Number,
        required:true,
        default:0
    }
});
const Discount=mongoose.model("Discount",discountSchema);
export default Discount;