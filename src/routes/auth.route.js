import {Router} from 'express'


import { register } from '../controllers/auth.controller.js';
import { validateRegister } from '../validator/auth.validator.js';

const authRouter = Router();


authRouter.post("/register", validateRegister, register)



export default authRouter;