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
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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