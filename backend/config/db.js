import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connection successfull ✅");
  } catch (error) {
    console.log("connection failed ❌");
    console.log(error);
  }
};

export default connectDB;
