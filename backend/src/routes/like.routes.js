import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { fetchLikeStatus, getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router()


router.route('/video-likes/:videoId').post(verifyJWT,toggleVideoLike)
router.route('/video-likes/:videoId').get(verifyJWT, fetchLikeStatus)


router.route('/comment-likes/:commentId').post(verifyJWT,toggleCommentLike)
router.route('/tweet-likes/:tweetId').post(verifyJWT,toggleTweetLike)
router.route('/all-liked-videos').get(verifyJWT,getLikedVideos)


export default router

