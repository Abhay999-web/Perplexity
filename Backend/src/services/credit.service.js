import userModel from "../models/user.model.js";

/**
 * Check if user's credits are eligible for auto-refill (24 hours passed since deduction)
 * If eligible, refill to 10 credits and reset the timer
 * @param {string} userId - User's MongoDB ID
 * @returns {Object} - { refilled: boolean, currentCredits: number }
 */
export async function checkAndRefillCredits(userId) {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const currentCredits = Number(user.credits) || 0;
        const refillTime = user.creditRefillTime;

        // If credits are not zero or no refill timer is set, no refill needed
        if (currentCredits > 0 || !refillTime) {
            return { refilled: false, currentCredits, nextRefillTime: refillTime };
        }

        const now = new Date();
        const timeDiff = now - new Date(refillTime);
        const hoursElapsed = timeDiff / (1000 * 60 * 60);

        // If 24 hours have passed, refill credits
        if (hoursElapsed >= 24) {
            user.credits = 10;
            user.creditRefillTime = null;
            await user.save();
            console.log(`Credits refilled for user ${userId}. New balance: 10`);
            return { refilled: true, currentCredits: 10, nextRefillTime: null };
        }

        // Not yet 24 hours
        const hoursRemaining = 24 - hoursElapsed;
        console.log(`User ${userId} has ${hoursRemaining.toFixed(2)} hours remaining until refill.`);
        return { refilled: false, currentCredits, nextRefillTime: refillTime, hoursRemaining };
    } catch (error) {
        console.error("checkAndRefillCredits Error:", error);
        throw error;
    }
}

/**
 * Set the refill timer when credits hit zero
 * @param {string} userId - User's MongoDB ID
 */
export async function setRefillTimer(userId) {
    try {
        const user = await userModel.findById(userId);
        if (user && user.credits <= 0) {
            user.creditRefillTime = new Date();
            await user.save();
            console.log(`Refill timer set for user ${userId}. Will refill in 24 hours.`);
        }
    } catch (error) {
        console.error("setRefillTimer Error:", error);
    }
}
