import cloudinary from 'cloudinary';
import nodeCron from 'node-cron';
import app from './app.js';
import { connectDB } from './config/database.js';
import { Stats } from './models/Stats.js';
connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

nodeCron.schedule('0 0 0 5 * *', async () => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});
