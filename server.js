import "dotenv/config"
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";
import { testAi } from "./src/services/ai.service.js";


const PORT = process.env.PORT || 3000;


connectToDb()
testAi()


app.listen(PORT,()=>{

    console.log(`Server is Running on Port ${PORT}`)
})

