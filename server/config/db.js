import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected Successfully..`);
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error);
  }
};

export default connectDB;
