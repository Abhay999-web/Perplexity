import mongoose from "mongoose";



async function connectToDb(){

  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To Database")

  }catch(err){
    console.log("Error in connecting to Database", err);
  }
   
}

export default connectToDb