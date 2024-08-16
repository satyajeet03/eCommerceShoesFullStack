import mongoose from 'mongoose';
import "dotenv/config"; 

// export const connectDB = async (): Promise<void> => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI!, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${(error as Error).message}`);
//     process.exit(1);
//   }
// };

export const connectDB = (async ()=> {
    console.log(process.env.MONGODB_CONNECTION_STRING)
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}`)
       console.log(`\n MongoDB is Connected !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("Not Connected", error)
        process.exit(1)
    }
 })
