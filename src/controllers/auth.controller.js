import userModel from "../models/User.model.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js";


/* 
    @desc Register a new User
    @route POST /auth/register
    @access Public
    @body { username, email, password }

 */
export async function register(req, res) {
    const { username, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (isUserAlreadyExists) {
        return res.send(400).json({
            message: "User with this emial  or username already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    const emailVerificationToken = jwt.sign({
        email: user.email,
    }, process.env.JWT_SECRET)


    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        text: `Hi ${username}, \n\n Thank You  for registering at Perplexity. We're excited to have you on board! \n\n Best Regards, \n Team Perplexity`,
        html:
            `<p>Hi ${username},</p>
    <p>Thank You  for registering at Perplexity. We're excited to have you on board!</p>
    <p>Please verify your email address  by clicking  the link below:</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
    <p>Best Regards,</p>
    <p>Team Perplexity</p>`
    })

    res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/* 
    @desc Login User
    @route POST /auth/login
    @access Public
    @body { email, password }

*/
export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }) .select("+password") /* password ko explicitly select krna padta hai kyuki humne model me select:false kiya hua hai */

    if (!user) {
        return res.status(400).json({
            message: "User with this email does not exist",
            success: false,
            err: "User not found"
        })
    }
    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        return res.status(400).json({
            message: "Invalid password",
            success: false,
            err: "Invalid password"
        })
    }
    if (!user.verified) {
        return res.status(400).json({
            message: "Email not verified. Please verify your email to login.",
            success: false,
            err: "Email not verified"
        })
    }
    const token = jwt.sign({
        id: user._id,
        username: user.username,
        email: user.email
    },process.env.JWT_SECRET, { expiresIn: "7d" })

    res.cookie("token", token).json({
         message: "Login successful",
            success: true,
            user:{
                id: user._id,
                username: user.username,    
                email: user.email
            }
        
    })
}

/* 
    @desc Get current logged in user's details
    @route Get /api/auth/get-me
    @access Private


*/

export async function getMe(req,res){

    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({
            message: "User not found",
            success: false,
            err: "User not found"   
        })
    }
    res.status(200).json({
        message: "User details fetched successfully",
        success: true,
        user
    })

    

    
}


/* 
    @desc Verify User's Email
    @route GET /auth/verify-email
    @access Public
    @query { token }
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
    <h1>Email Verified Successfully!</h1>
   
    <p>Your email has been verified successfully. You can now log in to your account and start using Perplexity.</p>
    <a href="http://localhost:3000/login">Login to Perplexity</a>
    <p>Best Regards,</p>
    <p>Team Perplexity</p>
   `
        res.send(html);
    } catch (err) {
        return res.status(400).json({
            message: "Invalid or expired token",
            success: false,
            err: "Invalid or expired token"
        })
    }
}