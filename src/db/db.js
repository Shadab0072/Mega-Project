import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConnection = async() =>{
    try {

           const dbConncted = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
           console.log("DB Connected successfully", dbConncted.connection.host,dbConncted.connection.name)

    } catch (error) {

        console.log("sorry connection failed", error)
        process.exit(1)  //method by nodejs

    }
}

export default dbConnection