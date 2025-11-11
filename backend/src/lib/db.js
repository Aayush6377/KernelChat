import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        const conn = await mongoose.connect(mongoUrl);
        console.log("Database connected");
    } catch (error) {
        console.log(`Error in connecting database: ${error}`);
        process.exit(1);
    }
}

export default connectDB;