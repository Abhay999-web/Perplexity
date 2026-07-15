import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

// URL Configuration - Works on both localhost and production
const getBackendUrl = () => {
    if (process.env.BACKEND_URL) {
        return process.env.BACKEND_URL;
    }
    return "http://localhost:3000";
};

const getFrontendUrl = () => {
    if (process.env.FRONTEND_URL) {
        return process.env.FRONTEND_URL;
    }
    return "http://localhost:5173";
};

const BACKEND_URL = getBackendUrl();
const FRONTEND_URL = getFrontendUrl();

console.log("🔧 Config Loaded:");
console.log("  BACKEND_URL:", BACKEND_URL);
console.log("  FRONTEND_URL:", FRONTEND_URL);

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
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Username, email, and password are required",
                success: false
            });
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "User with this email or username already exists",
                success: false,
                err: "User already exists"
            });
        }

        const user = await userModel.create({ username, email, password });

        // Generate verification token
        const emailVerificationToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Build verification link
        const verifyLink = `${BACKEND_URL}/api/auth/verify-email?token=${emailVerificationToken}`;
        
        console.log("📧 Sending verification email to:", email);
        console.log("🔗 Verification link:", verifyLink);

        try {
            await sendEmail({
                to: email,
                subject: "Welcome to Perplexity! Verify Your Email",
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; background-color: #0d0d0d; color: #ffffff; }
                            .container { background-color: #171717; border: 1px solid #2a2a2a; border-radius: 16px; padding: 32px; max-width: 500px; margin: 20px auto; }
                            h2 { margin: 0 0 16px 0; font-size: 24px; }
                            p { color: #8e8ea0; line-height: 1.6; margin: 12px 0; }
                            .verify-btn { display: inline-block; background-color: #ffffff; color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; }
                            .verify-btn:hover { background-color: #e5e5e5; }
                            .footer { color: #6e6e80; font-size: 12px; margin-top: 32px; border-top: 1px solid #2a2a2a; padding-top: 16px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Welcome to Perplexity! 🚀</h2>
                            <p>Hi ${username},</p>
                            <p>Thank you for signing up. To get started, please verify your email address by clicking the button below:</p>
                            <a href="${verifyLink}" class="verify-btn">Verify Email Address</a>
                            <p>Or copy this link: <br><small>${verifyLink}</small></p>
                            <p>This link expires in 24 hours.</p>
                            <div class="footer">
                                <p>If you didn't create this account, you can safely ignore this email.</p>
                                <p>© 2024 Perplexity. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `,
                text: `Welcome to Perplexity! Please verify your email by clicking: ${verifyLink}`
            });
            
            console.log("✅ Email sent successfully to:", email);

        } catch (emailError) {
            console.error("❌ Email sending failed:", {
                message: emailError.message,
                status: emailError.response?.status,
                data: emailError.response?.data
            });
            
            // Delete the user if email sending fails
            await userModel.findByIdAndDelete(user._id);
            
            return res.status(500).json({
                success: false,
                message: "Failed to send verification email. Please try again later.",
                error: process.env.NODE_ENV === 'development' ? emailError.message : undefined
            });
        }

        return res.status(201).json({
            message: "Registration successful! Please check your email to verify your account.",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("❌ Register Error:", error);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false
            });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Account not found. Please register first!",
                success: false,
                err: "User not found"
            });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
                err: "Incorrect password"
            });
        }

        if (!user.verified) {
            return res.status(400).json({
                message: "Please verify your email before logging in",
                success: false,
                err: "Email not verified"
            });
        }

        await refillDailyCredits(user);

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                credits: user.credits,
                creditRefillTime: user.creditRefillTime
            }
        });

    } catch (error) {
        console.error("❌ Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again.",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
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
        console.error("❌ getMe Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
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
        if (!token) {
            return res.status(400).json({
                message: "Verification token is required",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({ email: decoded.email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid token or user not found",
                success: false,
                err: "User not found"
            });
        }

        if (user.verified) {
            return res.status(400).json({
                message: "Email already verified",
                success: false
            });
        }

        user.verified = true;
        await user.save();

        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified - Perplexity</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    color: #ffffff;
                    padding: 20px;
                }
                .container { 
                    background-color: #171717;
                    border: 1px solid #2a2a2a;
                    border-radius: 24px;
                    padding: 40px 30px;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: slideIn 0.5s ease-out;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .icon { 
                    background-color: rgba(125, 211, 168, 0.1);
                    color: #7dd3a8;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px auto;
                    border: 2px solid rgba(125, 211, 168, 0.3);
                    font-size: 32px;
                    font-weight: bold;
                    animation: bounce 0.6s ease-out;
                }
                @keyframes bounce {
                    0% { transform: scale(0); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                h1 { 
                    margin: 0 0 12px 0;
                    font-size: 28px;
                    font-weight: 600;
                    letter-spacing: -0.5px;
                }
                p { 
                    color: #8e8ea0;
                    font-size: 14px;
                    margin: 0 0 28px 0;
                    line-height: 1.6;
                }
                .btn { 
                    display: inline-block;
                    background-color: #ffffff;
                    color: #000000;
                    text-decoration: none;
                    padding: 12px 28px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
                }
                .btn:hover { 
                    background-color: #e5e5e5;
                    box-shadow: 0 6px 16px rgba(255, 255, 255, 0.15);
                    transform: translateY(-2px);
                }
                .footer {
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid #2a2a2a;
                    color: #6e6e80;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">✓</div>
                <h1>Verification Successful!</h1>
                <p>Your email has been successfully verified. You can now log in to your account and start exploring Perplexity.</p>
                <a href="${FRONTEND_URL}/login" class="btn">Go to Login</a>
                <div class="footer">
                    <p>Welcome to Perplexity! 🚀</p>
                </div>
            </div>
        </body>
        </html>
        `;

        return res.send(html);

    } catch (error) {
        console.error("❌ Email verification error:", error.message);
        
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Verification Failed</title>
            <style>
                body {
                    background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                    display: flex; align-items: center; justify-content: center;
                    height: 100vh; color: #ffffff; padding: 20px;
                }
                .container {
                    background-color: #171717; border: 1px solid #2a2a2a;
                    border-radius: 24px; padding: 40px 30px; max-width: 400px;
                    text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                }
                .icon { color: #f87171; font-size: 48px; margin-bottom: 16px; }
                h1 { font-size: 24px; margin: 0 0 12px 0; }
                p { color: #8e8ea0; margin: 0 0 24px 0; line-height: 1.6; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="icon">✕</div>
                <h1>Verification Failed</h1>
                <p>The verification link is invalid or has expired. Please register again.</p>
            </div>
        </body>
        </html>
        `;
        
        return res.status(400).send(html);
    }
}

/**
 * @desc Logout user and clear JWT token
 * @route POST /api/auth/logout
 * @access Public
 */
export async function logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax"
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("❌ Logout Error:", error);
        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
}