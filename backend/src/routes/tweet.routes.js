import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, deleteTweet, getAllTweets, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";


const router = Router()

router.route('/create-tweet').post(verifyJWT,createTweet)

router.route('/usertweets').get(verifyJWT,getUserTweets)

router.route('/all-tweets').get(getAllTweets)


router.route('/update-tweet/:tweetId').patch(updateTweet)

router.route('/delete-tweet/:tweetId').delete(verifyJWT,deleteTweet)


export default router