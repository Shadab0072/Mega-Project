import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFromCloudinary, getVideoDurationFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";




const getAllVideos = asyncHandler(async(req,res)=>{

    const { page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'decs', userId } = req.query


    let match = {};

    if (query) {                    //search video by title or description
        match.$or = [
            { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    
    if (userId) {
        match.userId = mongoose.Types.ObjectId.createFromHexString(userId);  // Convert to ObjectId if userId is provided
    }
   

    const sort = {};
    sort[sortBy] = sortType === 'asc' ? 1 : -1;


    const aggregateQuery = Video.aggregate([
        { $match: match }, // Apply match conditions
        { $sort: sort }    // Sort results based on criteria
    ]);

    
    const options = {
        page: parseInt(page),       // Page number (converted to integer)
        limit: parseInt(limit),     // Limit per page (converted to integer)
    };


    const videos = await Video.aggregatePaginate(aggregateQuery, options);

    res.status(200).json(
      new  apiResponse(200,videos,"fetched all videos")
    )


})


const publishAVideo = asyncHandler(async (req, res) => {

    const { title, description} = req.body

    if( [ title, description ].some((feild)=>(
        feild?.trim() === ""
    )) ){
        throw new apiError(400,"All Feilds are required")
    }


    const videoFileLocalPath = req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path; 

    if (!videoFileLocalPath){
        throw new apiError(400,"video file path required")
    }

    const videoFile = await uploadOnCloudinary(videoFileLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile){
        throw new apiError(400,"avatar Image(URL) is required")
        
    }

    //console.log("videoFile",videoFile)


     // Get video duration from Cloudinary metadata
     const videoMetadata = await getVideoDurationFromCloudinary(videoFile.public_id);
     const videoDuration = videoMetadata.duration; // Duration in seconds

    //  console.log("videoMetadata",videoMetadata)
    //  console.log("videoDuration",videoDuration)


    const ownerId = req.user._id



    const video = await Video.create({
        title: title,
        description : description,
        videoFile : videoFile.url,
        thumbnail : thumbnail.url,
        duration : videoDuration,
        owner: ownerId
    }) 

    const videoCreated = await Video.findById(video._id)

    if(!videoCreated){
    throw new apiError(500, "video not created , something went wrong while uploading video")
    }

    return res.status(201).json(new apiResponse(201,videoCreated,"video created succesfully"))


})


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

    res.status(200).json(new apiResponse(200,video,"video found"))
})


const updateVideo = asyncHandler(async (req, res) => {

    const {title,description}= req.body
    const { videoId } = req.params
    const thumbnailLocalPath = req.file?.path

    if (!(title || description)) {
        return res.status(400).json({ message: "title or description are required" });
    }


    const video = await Video.findById(videoId)
    if (!video.owner.equals(req.user._id)) {
        throw new apiError(400, "You are not allowed to delete this video");
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    
    const updatedVideoInfo = await Video.findByIdAndUpdate(
        videoId,
        {title:title,
        description: description,
        thumbnail: thumbnail?.url
        },
        { new: true }, 
    )


    res.status(200).json(new apiResponse(200,updatedVideoInfo,"updated succesfully"))
    

})


const deleteVideo = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    
    const video = await Video.findById(videoId)

   
    if (!video.owner.equals(req.user._id)) {
        throw new apiError(400, "You are not allowed to delete this video");
    }
    // This is necessary because MongoDB ObjectIds need to be compared with the .equals() method, 
    // not with === or !==.

    
    await Video.findByIdAndDelete(videoId)

    res.status(200).json(new apiResponse(200,{},"video deleted"))

})



const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Find the video by ID
    const video = await Video.findById(videoId);

    // Check if the video exists
    if (!video) {
        throw new apiError(404, "Video not found");
    }

    // Check if the logged-in user is the owner of the video
    if (!video.owner.equals(req.user._id)) {
        throw new apiError(403, "You are not allowed to modify this video");
    }

    // Toggle the publish status
    video.isPublished = !video.isPublished;
    // Save the updated video
    await video.save();

    res.status(200).json(new apiResponse(200, video, "Publish status toggled successfully"));
});



// Ensure req.user is populated by middleware
const viewsCount = asyncHandler(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        video.views += 1;
        await video.save();

        const updateResult = await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { watchHistory: video._id },
        });

        res.status(200).json(new apiResponse(200, { views: video.views }, "Views updated successfully"));
    } catch (error) {
        console.error("Error updating views: ", error);
        res.status(500).json({ message: 'Error updating views' });
    }
});




const history = asyncHandler(async (req, res) => {
    try {
        // Extract userId correctly from req.params
        const userId = req.user?._id; // This should just be a string, not an object

        // Find user by ID and populate the watchHistory field with video details
        const user = await User.findById(userId).populate({
            path: 'watchHistory',
            model: 'Video', // Populates with video details
           
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ success: true, watchHistory: user.watchHistory });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching user history', error: err.message });
    }
});









export {getAllVideos,publishAVideo,getVideoById,updateVideo,
    deleteVideo,togglePublishStatus,viewsCount,history}