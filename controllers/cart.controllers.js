import {Product} from '../models/product.models.js';
import {Cart} from '../models/cart.models.js';

const add=async(req,res)=>{
    let {user_id,product_id,quantity}=req.body;
    quantity=parseInt(quantity);
    const product=await Product.findOne({product_id});
    if(!product)
    {
        return res.status(400).json({message:"Product not found"});
    }
    if(quantity>product.product_quantity)
    {
        return res.status(400).json({message:"Invalid quantity"});
    }
    const cart=await Cart.findOne({user_id});
    if(!cart)
    {
        let newCart=await Cart.create({
            user_id,
            item:[{
                item_id:product_id,
                quantity
            }]
        })
        return res.status(200).json({message:"Product successfully added to the cart",newCart});
    }
    else
    {
        let item=await cart.item.find((item)=>item.item_id==product_id);
        if(item)
        {
            let existedCartItem=await Cart.findOneAndUpdate({user_id,"item.item_id":product_id},{
                $set:{
                    "item.$.quantity":item.quantity+quantity
                }
            },{new:true});
            return res.status(200).json({message:"Product successfull added to the cart",existedCartItem});  
        
        }
        else
        {
            let updatedCart=await Cart.findOneAndUpdate({user_id},{
                $push:{
                    item:{
                        item_id:product_id,
                        quantity
                    }
                }
            });
            return res.status(200).json({message:"Product successfully added to the cart",updatedCart});
        }
    }
}



const view=async(req,res)=>{
    const {user_id}=req.body;
    const cart=await Cart.findOne({user_id});
    if(!cart)
    {
        return res.status(404).json({message:"Cart not found"});
    }
    else
    {
        return res.status(200).json({message:"Cart found",cart});
    }
}

const remove=async(req,res)=>{
    const {user_id,product_id}=req.body;
    const cart=await Cart.findOne({user_id});
    if(!cart)
    {
        return res.status(400).json({mesage:"Product not found in the cart"});
    }
    else
    {
        let item =await cart.item.find((item)=>{
            return item.item_id==product_id;
        });
        if(!item)
        {
            return res.status(400).json({message:"Product not found in the cart"});
        }
        else
        {
            let updatedCart=await Cart.findOneAndUpdate({user_id},{
                $pull:{
                    item:{
                        item_id:product_id
                    }
                }
            },{new:true});
            return res.status(200).json({message:"Product successfully removed from the cart",updatedCart});
        }
    }
}

export {add,view,remove};