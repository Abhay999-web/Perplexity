import express from "express"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.route.js";

const app = express();

/* Middleware */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(morgan("dev"))
const clientOrigin = process.env.FRONTEND_URL || process.env.CLIENT_URL;
app.use(cors({
    origin: clientOrigin || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}))

//For Check =>
app.get("/", (req, res) => {
    res.json({ message: "Server is Running" })
})


// app.use('/auth', authRouter) =>> authentication
app.use("/api/auth", authRouter);


// app.use('/chat', chatRouter); =>> for chats
app.use("/api/chats", chatRouter)




export default app;