import { Playlist } from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const  userId = req.user._id

    if (!name || !description) {
        throw new apiError(401, "Enter the name and the description");
      }

    const playlist =  await Playlist.create({
        name : name,
        description : description,
        owner : userId
    }) 

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating the playlist");
      }

    res.status(200).json(new apiResponse(200,playlist,"playlist created succesfully"))


})


const getUserPlaylists = asyncHandler(async (req, res) => {

    const {userId} = req.params

    if(!userId){
        throw new apiError(400,"provide userId ")
    }

    const userPlaylist = await Playlist.find({
        owner: userId
    })

    if (userPlaylist.length === 0) {
        throw new apiError(404, "There are no playlists of this user");
    }

    res.status(200).json(new apiResponse(200,userPlaylist,"userPlaylist fetched succesfully"))

})



const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId){
        throw new apiError(400,"provide playlistId ")
    }
    const playlist = await Playlist.findById(playlistId)

    res.status(200).json(new apiResponse(200,playlist,"playlist fetched succesfully"))

})



const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId , videoId} = req.params

      if (!playlistId || !videoId) {
        throw new ApiError(401, "Enter the playlist and video Id to proceed");
      }

    //TODO:check if video already added in playlist. otherwise same video will be added twice

   const videoAddedInPlaylist =  await Playlist.findByIdAndUpdate(playlistId,
        {
            $push: {
            videos: videoId,
          }
        },
        {new : true}
    )

    res.status(200).json(new apiResponse(200,videoAddedInPlaylist,"video Added In Playlist succesfully"))

})


const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!playlistId || !videoId) {
        throw new ApiError(401, "Enter the playlist and video Id to proceed");
      }

    const videoRemovedInPlaylist =  await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull: {
            videos: videoId,
          }
        },
        {new : true}
    )


    res.status(200).json(new apiResponse(200,videoRemovedInPlaylist,"video removed In Playlist succesfully"))


})


const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    await Playlist.findByIdAndDelete(playlistId) 

    res.status(200).json(new apiResponse(200,{},"playlist deleted"))

})


const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body


    
    const playslistInfoUpdated = await Playlist.findByIdAndUpdate(playlistId,{
        name,
        description
    },
    {new:true}          //updated response
)


    if (!playslistInfoUpdated) {
        throw new apiError(400, "playlist not found")
    }

    res.status(200).json(new apiResponse(200,playslistInfoUpdated,"playlistInfo Updated successfully"))

})




export {createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist}






