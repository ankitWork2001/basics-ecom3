import express from "express";
import mongoose from "mongoose";
import env from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

import {body,validationResult} from "express-validator";
import { User } from "./models/user.models.js";
import {authenticate} from "./auth.js";

import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/cart.routes.js";
import productRouter from "./routes/product.routes.js";

export const app=express();
app.use(express.json());

env.config();

const connectDB=async()=>{
    try{
        const con=await mongoose.connect(`${process.env.DATABASE_URL}`);
        console.log("DataBase Connected");
    }
    catch(err)
    {
        console.log("DataBase not Connected",err);
    }

}
connectDB().then(()=>{
    app.listen(process.env.port,()=>{
        console.log("Server is running on port",process.env.port);
    })
}).catch((err)=>{
    console.log("Server is not running",err);
});

app.use("/user",userRouter);
app.use("/cart",cartRouter);
app.use("/product",productRouter);
