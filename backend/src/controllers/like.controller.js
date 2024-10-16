import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import { Video } from "../models/video.model.js";
import { apiResponse } from  "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id; // Assuming user authentication middleware is in place
   
      // Check if the user has already liked the video
      const existingLike = await Like.findOne({ video: videoId, likedBy: userId });
  
      if (existingLike) {
        // If the like already exists, remove it (unlike)
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new apiResponse(200,{},"like removed"));
      } else {
        // If no like exists, create a new like
        const newLike = await Like.create({
            video: videoId,
            likedBy: userId,
          })

         res.status(200).json(new apiResponse(200,newLike,"like added"));
        }
  
  });


// Controller to fetch like status
const fetchLikeStatus = async (req, res) => {
  const { videoId } = req.params; // Get video ID from parameters
  const userId = req.user.id; // Get logged-in user's ID from request object

  try {
    
    // Find all likes for the given video
    const existingLikes = await Like.find({ video: videoId });

    // Count total likes
    const likeCount = existingLikes.length;

    // Check if the user has liked the video
    const isLiked = existingLikes.some(like => like.likedBy.toString() === userId); // Assuming likedBy is an ObjectId

    // Send response with like status and total like count
    return res.status(200).json({
      data: {
        isLiked,
        likeCount,
      },
    });
  } catch (error) {
    console.error('Error fetching like status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};





const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const userId = req.user._id; // Assuming user authentication middleware is in place
   
    // Check if the user has already liked the video
    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
      // If the like already exists, remove it (unlike)
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json(new apiResponse(200,{},"like removed"));
    } else {
      // If no like exists, create a new like
      const newLike = await Like.create({
          comment: commentId,
          likedBy: userId,
        })

       res.status(200).json(new apiResponse(200,newLike,"like added"));
      }

})


const toggleTweetLike = asyncHandler(async (req, res) => {
    
    const {tweetId} = req.params
    
    const userId = req.user._id; // Assuming user authentication middleware is in place
    
    // Check if the user has already liked the video
    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (existingLike) {
      // If the like already exists, remove it (unlike)
      await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json(new apiResponse(200,{},"like removed"));
    } else {
      // If no like exists, create a new like
      const newLike = await Like.create({
          tweet: tweetId,
          likedBy: userId,
        })
       res.status(200).json(new apiResponse(200,newLike,"like added"));
}
})


const getLikedVideos = asyncHandler(async (req, res) => {

    const  userId = req.user._id

    const likedVideos = await Like.find({ likedBy: userId, video: { $exists: true } })

    res.status(200).json(new apiResponse(200,likedVideos,"all liked videos"));

})



export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos,
    fetchLikeStatus
}