import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router
  .route("/create-playlist")
  .post(verifyJWT, createPlaylist)

router
  .route("/getplaylist/:userId")
  .get(verifyJWT, getUserPlaylists)

router
  .route("/playlist-by-id/:playlistId")
  .get(verifyJWT, getPlaylistById)

router
.route("/add-video/:playlistId/videos/:videoId")
.patch(verifyJWT, addVideoToPlaylist)


router
  .route("/remove-video/:playlistId/videos/:videoId")
  .delete(verifyJWT, removeVideoFromPlaylist)

  
router
  .route("/remove-playlist/:playlistId")
  .delete(verifyJWT, deletePlaylist)


router
  .route("/update-playlist/:playlistId")
  .patch(verifyJWT, updatePlaylist)





  export default router