import {Product} from '../models/product.models.js';
import {Cart} from '../models/cart.models.js';
import Discount from '../models/discount.models.js';

const add=async(req,res)=>{
    let {user_id,product_id,quantity}=req.body;
    quantity=parseInt(quantity);
    const product=await Product.findById(product_id);
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

const checkOut=async(req,res)=>{
    const {user_id}=req.body;
    const user=await Cart.findOne({user_id});
    if(!user)
    {
        return res.status(400).json({message:"Cart not found"});
    }
    else
    {
        const cart =await Cart.findOneAndUpdate({user_id}).populate("item.item_id");
        if(!cart || cart.item.length==0)
        {
            return res.status(400).json({message:"Invalid Cart or Stock Unavailability"});
        }
        for(let specificItem of cart.item)
        {
            const specificProduct=specificItem.item_id;
            if(specificProduct.product_quantity<=specificItem.quantity)
            {
                return res.status(400).json({message:"Stock Unavailability"});
            }
        }
        for(let specificItem of cart.item)
        {
            const id=specificItem.item_id;
            await Product.findByIdAndUpdate(id,{
                $set:{
                    product_quantity:id.product_quantity-specificItem.quantity
                }
            });
        }
        const checkOutCart=await Cart.findOne({user_id});
        res.status(200).json({message:"Checkout Successfull",checkOutCart});
    }
}

const applyDiscount=async(req,res)=>{
    const {user_id,discount_code}=req.body;
    if(!discount_code)
    {
        return res.status(400).json({message:"Invalid Discount Code"});
    }
    const discount=await Discount.findById(discount_code);
    if(!discount)
    {
        return res.status(400).json({message:"Invalid Discount Code"});
    }
    let totalSum=0;
    const cart=await Cart.findOne({user_id}).populate("item.item_id");
    if(!cart || cart.item.length==0)
    {
        return res.status(400).json({message:"Cart not found"});
    }
    for(let specificItem of cart.item)
    {
        const specificProduct=specificItem.item_id;
        totalSum+=specificProduct.product_price*specificItem.quantity;
    }
    const discountValue=discount.percentage;
    const discountAmount=(totalSum*discountValue)/100;  
    const finalAmount=totalSum-discountAmount;
    return res.status(200).json({message:"Discount Applied",finalAmount});
}

export {add,view,remove,checkOut,applyDiscount};