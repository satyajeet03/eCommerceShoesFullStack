// import express , {Request,Response} from "express";
// import cors from "cors";
// import "dotenv/config"; 
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
 
 
//  const connectDb = (async ()=> {
//     console.log(process.env.MONGODB_CONNECTION_STRING)
//     try {
//        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`)
//        console.log(`\n MongoDB is Connected !! DB HOST : ${connectionInstance.connection.host}`)
//     } catch (error) {
//         console.log("Not Connected", error)
//         process.exit(1)
//     }
//  })
// const app = express();
// connectDb();
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cors());

// app.get("/api/test" , async (req:Request , res:Response ) => {
//     res.json({message:"hello"})
// })

// app.listen(7000 , ()=> {
//     console.log("app is running")
// })



import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from '../config/db';
import shoeRoutes from '../routes/shoeRoutes';
import { errorHandler } from '../middleware/errorMiddleware';
import userRoutes from '../routes/userRoutes'
import cartRoutes from '../routes/cartRoutes'
dotenv.config();
connectDB();

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/api/shoes', shoeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(7000 , ()=> {
    console.log("app is running")
})


