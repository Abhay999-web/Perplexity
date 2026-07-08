import cron from 'node-cron'; 
import userModel from '../models/user.model.js';

export const startCronJobs = () => {
  // run this cron job every day at midnight IST
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log("Running daily credit reset...");
            
            const result = await userModel.updateMany(
                { credits: { $lt: 10 } },
                { $set: { credits: 10 } }
            );
            
            console.log(`Daily credits reset successful for ${result.modifiedCount} users!`);
        } catch (error) {
            console.error("cError resetting daily credits:", error);
        }
    }, {
        timezone: 'Asia/Kolkata'
    });
};