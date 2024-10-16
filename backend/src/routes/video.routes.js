import { Router } from "express";
import { deleteVideo, getAllVideos, getVideoById, history, publishAVideo,
     togglePublishStatus, updateVideo, viewsCount } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/user.model.js";



const router = Router()

router
    .route("/")
    .get(getAllVideos)
    .post(verifyJWT,
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },   
        ]),
         publishAVideo
    );


router.route("/:videoId")
.get(getVideoById)
.put(verifyJWT, upload.single("thumbnail"),updateVideo)
.delete(verifyJWT,deleteVideo)

router.route("/toggle/publish/:videoId").patch(verifyJWT,togglePublishStatus);


router.route('/:id/view').put(verifyJWT,viewsCount)


router.route('/history/:userId').get(verifyJWT, history);

  


  


export default router