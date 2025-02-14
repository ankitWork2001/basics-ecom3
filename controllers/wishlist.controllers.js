import Wishlist from "../models/wishlist.models.js";



const addToWishlist=async(req,res)=>{
    const {user_id,product_id}=req.body;
    const wishlist=await Wishlist.findOne({user_id});
    if(!wishlist)
    {
        const newWishlist = await Wishlist.create({
            user_id,
            product_id: [product_id] 
        });
        return res.status(200).json({message:"Product added to the Wishlist",newWishlist});
    }
    else
    {
        const productIndex=wishlist.product_id.indexOf(product_id);
        if(productIndex===-1)
        {
           const updatedWishlist=await Wishlist.findOneAndUpdate({user_id},{
            $push:{ product_id:product_id}},
            {new:true}
           );
            return res.status(200).json({message:"Product added to the Wishlist",updatedWishlist});
        }
        else
        {
            return res.status(400).json({message:"Product already in the Wishlist"});
        }
    }
}

const getWishlist=async(req,res)=>{
    const {user_id}=req.body;
    const wishlist=await Wishlist.findOne({user_id});
    if(!wishlist)
    {
        return res.status(400).json({message:"Wishlist is empty"});
    }
    else
    {
        return res.status(200).json({wishlist});
    }
}

const removeWishlist=async(req,res)=>{
    const {user_id,product_id}=req.body;
    const wishlist=await Wishlist.findOne({user_id});
    if(!wishlist)
    {
        return res.status(400).json({message:"Wishlist is empty"});
    }
    else
    {
        const productIndex=wishlist.product_id.indexOf(product_id);
        if(productIndex===-1)
        {
            return res.status(400).json({message:"Product not in the Wishlist"});
        }
        else
        {
           const updatedWishlist=await Wishlist.findOneAndUpdate({user_id},{
            $pull:{ product_id:product_id}},
           {new:true}
           );
            return res.status(200).json({message:"Product removed from the Wishlist",updatedWishlist});
        }
    }
}

export {addToWishlist,getWishlist,removeWishlist};
