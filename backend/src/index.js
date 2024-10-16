import dbConnection from './db/db.js'
import {app} from './app.js'
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})




dbConnection()
.then(()=>{
    app.listen(process.env.PORT || 8000 , ()=>{
        console.log(`server is live on ${process.env.PORT}. enjoy!!!`)
    } )
})
.catch((error)=>{
    console.log(error, "error on index.js at dbconnection()")
})
