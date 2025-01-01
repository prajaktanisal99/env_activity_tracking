import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB using Mongoose!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};
