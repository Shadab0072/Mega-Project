import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors'


const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

  

//router setup
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.routes.js'

app.use('/api/v1/users', userRouter ) //we use app.get app.post etc only when router is in same file but here router is imported from other file. so now it will act as a middleware that why we use app.use for a middleware
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/subscription',subscriptionRouter)
app.use('/api/v1/tweet',tweetRouter)
app.use('/api/v1/playlist',playlistRouter)
app.use('/api/v1/comment',commentRouter)
app.use('/api/v1/like',likeRouter)



export {app}
