import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";

const router = Router()

router.route('/addcomment/:videoId').post(verifyJWT,addComment)

router.route('/get-all-comment/:videoId').get(verifyJWT,getVideoComments)

router.route('/update-comment/:commentId').patch(verifyJWT,updateComment)

router.route('/delete-comment/:commentId').delete(verifyJWT,deleteComment)


export default router