import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";

async function refillDailyCredits(user) {
    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (user.creditRefillTime) {
        const lastRefill = new Date(user.creditRefillTime);
        if (now - lastRefill >= oneDayMs) {
            user.credits = 10;
            user.creditRefillTime = now;
            await user.save();
        }
    } else if (user.credits == null || user.credits < 10) {
        user.credits = 10;
        user.creditRefillTime = now;
        await user.save();
    }
}

/**
 * @desc Register a new user
 * @route POST /api/auth/registera
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {

    const { username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { email }, { username } ]
    })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this email or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)

    try {
        await sendEmail({
            to: email,
            subject: "Welcome to Perplexity!",
            html: `
                <p>Hi ${username},</p>
                <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
                <p>Please verify your email address by clicking the link below:</p>
                <a href="${FRONTEND_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                <p>If you did not create an account, please ignore this email.</p>
                <p>Best regards,<br>The Perplexity Team</p>
            `
        })
    } catch (error) {
        console.error("Email sending failed:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending the email. Please try again later."
        });
    }

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    });



}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "Account not found. Please register first!",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid email or password",
            success: false,
            err: "Incorrect password"
        })
    }

    if (!user.verified) {
        return res.status(400).json({
            message: "Please verify your email before logging in",
            success: false,
            err: "Email not verified"
        })
    }

    await refillDailyCredits(user);

    const token = jwt.sign({
        id: user._id,
        username: user.username,
    }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    res.status(200).json({
        message: "Login successful",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            credits: user.credits,
            creditRefillTime: user.creditRefillTime
        }
    })

}


/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */

export async function getMe(req, res) {
    try {
       
        const userId = req.user.id || req.user._id || req.user.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized: User ID missing in token"
            });
        }

        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                err: "User not found"
            });
        }

        await refillDailyCredits(user);

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user
        });

    } catch (error) {
        console.error("getMe Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error in getMe API"
        });
    }
}


/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {


        const decoded = jwt.verify(token, process.env.JWT_SECRET);


        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token",
                success: false,
                err: "User not found"
            })
        }

        user.verified = true;

        await user.save();

        const html =
            `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified</title>
            <style>
                body { margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; color: #ffffff; }
                .container { background-color: #171717; border: 1px solid #2a2a2a; border-radius: 24px; padding: 40px 30px; max-width: 400px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); width: 90%; }
                .icon { background-color: rgba(125, 211, 168, 0.1); color: #7dd3a8; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; border: 1px solid rgba(125, 211, 168, 0.2); font-size: 32px; font-weight: bold; }
                h1 { margin: 0 0 10px 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
                p { color: #8e8ea0; font-size: 14px; margin: 0 0 30px 0; line-height: 1.5; }
                .btn { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 500; font-size: 14px; transition: background-color 0.2s; }
                .btn:hover { background-color: #e5e5e5; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">✓</div>
                <h1>Verification Successful</h1>
                <p>Your email has been successfully verified. You can now securely log in to your account.</p>
                <a href="${FRONTEND_URL}/login" class="btn">Return to Login</a>
            </div>
        </body>
        </html>
        `

        return res.send(html);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: err.message
        })
    }
}


/* 
*    @desc Logout user and clear JWT token
*    @route POST /api/auth/logout
*    @access Public

*/

export async function logout(req,res){

    return res.clearCookie("token", {

    })
    .status(200).json({
        success: true,
        message: "Logout successfully. cookie cleared!"
    })


    


}