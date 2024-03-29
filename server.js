import nodeCron from 'node-cron';
import app from './app.js';
import { connectDB } from './config/database.js';
import { Stats } from './models/Stats.js';
import { cloudinaryConfig } from './utils/cloudinaryConfig.js';

connectDB();
cloudinaryConfig();
//'0 0 0 1 * *' - every first day of month
nodeCron.schedule('0 0 0 1 * *', async () => {
  try {
    console.log('Cron job is running');
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is working on port: ${process.env.PORT}`);
});
