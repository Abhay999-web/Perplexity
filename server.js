import "dotenv/config"
import app from "./src/app.js";
import connectToDb from "./src/config/db.js";



const PORT = process.env.PORT || 3000;


connectToDb()


.catch((err)=>{
    console.log("Failed to connect to database", err)
    process.exit(1)
})





app.listen(PORT,()=>{

    console.log(`Server is Running on Port ${PORT}`)
})

