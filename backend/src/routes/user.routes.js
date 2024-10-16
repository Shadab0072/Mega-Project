import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { changeCurrentPassword, getCurrentUser, getUserByID, getUserChannelProfile,
     getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser,
      updateUserProfile} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route('/register').post(
    upload.fields([{
        name: "avatar",
        maxCount: 1
    },{
        name: "coverImage",
        maxCount: 1
    }])
    ,registerUser)


router.route('/login').post(loginUser)



//secured routes
router.route('/logout').post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken) 
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/:id").get( getUserByID)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)
// router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)   //Only updates the fields specified in the request body.
// router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT,getUserChannelProfile)
router.route('/history').get(verifyJWT,getWatchHistory)

router.route("/update-profile").patch(verifyJWT, upload.fields([{ name: 'avatar' },
     { name: 'coverImage' }]), updateUserProfile);




export default router



