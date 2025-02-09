import {Product} from '../models/product.models.js';

const details=async(req,res)=>{
    const {product_id}=req.body;
    const product=await Product.findOne({product_id});
    if(!product)
    {
        return res.status(404).json({message:"Product not found"});
    }
    return res.status(200).json({message:"Product found",product});
}

export {details};