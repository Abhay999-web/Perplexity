import express from "express"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";

const app = express();

/* Middleware */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.use('/auth', authRouter);

//For Check =>
app.get("/", (req, res) => {
    res.json({ message: "Server is Running" })
})

app.use("/api/auth", authRouter);

export default app;