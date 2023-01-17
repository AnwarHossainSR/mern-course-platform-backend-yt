import mongoose from 'mongoose';

export const connectDB = async () => {
  console.log(process.env.MONGO_URL);
  mongoose.set('strictQuery', true);
  const { connection } = await mongoose.connect(process.env.MONGO_URL);
  console.log(`MongoDB connected with ${connection.host}`);
};
