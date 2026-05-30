import { Router } from 'express'
import { register, verifyEmail, login, getMe } from '../controllers/auth.controller.js';
import { validateRegister, loginValidator } from '../validator/auth.validator.js';
import {authUser} from "../middleware/auth.middleware.js"


const authRouter = Router();


/* 
    @route POST api/auth/register
    @desc Route for User Registration
    @access Public
    @body { username, email, password }
*/
authRouter.post("/register", validateRegister, register)


/* 
    @route POST /auth/login
    @desc Route for User Login
    @access Public
    @body { email, password }
*/
authRouter.post("/login", loginValidator, login)


/* 
    @route Get api/auth/get-me
    @desc Route to get logged in User's details
    @access Private

*/
authRouter.get("/get-me", authUser, getMe)
    

    



/* 
    @route GET api/auth/verify-email
    @desc Route for Email Verification 
    @access Public
    @query { token }
*/
authRouter.get("/verify-email", verifyEmail)



export default authRouter;