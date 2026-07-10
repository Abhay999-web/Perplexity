import "dotenv/config";
import express from "express";
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";
import { startCronJobs } from "./src/services/cron.services.js"; // for credits management
import path from "path";
import { fileURLToPath } from "url";

const PORT = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const frontendBuildPath = path.join(__dirname, '../Frontend/dist'); 

app.use(express.static(frontendBuildPath));

app.use((req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
});


const httpServer = http.createServer(app);

initSocket(httpServer);

startCronJobs(); // Start the cron job for daily credit reset

connectToDb()
.catch((err)=>{
    console.log("Failed to connect to database", err);
    process.exit(1);
});

httpServer.listen(PORT,()=>{
    console.log(`Server is Running on Port ${PORT}`);
});