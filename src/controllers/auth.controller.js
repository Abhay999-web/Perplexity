import userModel from "../models/User.model.js";
import jwt from "jsonwebtoken"
import { sendEmail } from "../services/mail.service.js";

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
    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        text: `Hi ${username}, \n\n Thank You  for registering at Perplexity. We're excited to have you on board! \n\n Best Regards, \n Team Perplexity`,
        html:
            `<p>Hi ${username},</p>
    <p>Thank You  for registering at Perplexity. We're excited to have you on board!</p><p>Best Regards,</p><p>Team Perplexity</p>`
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
