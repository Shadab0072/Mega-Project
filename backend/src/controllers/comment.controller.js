import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.model.js";





const addComment = asyncHandler(async (req, res) => {

    const { content } = req.body;
    const { videoId  } = req.params;

     if (!content) {
        throw new apiError(401, "Enter some content to comment");
      }
      if (!videoId) {
        throw new apiError(400, "Invalid input(s)")
    }

    const createCommentResult = await Comment.create(
        {
          content:content,
          video : videoId,
          owner: req.user._id
        })

res.status(200).json(
    new apiResponse(200, createCommentResult,"Commnet has been added Successfully"))


})


const getVideoComments = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const commentsOnVideo = await Comment.find({ video: videoId });
    res.status(200).json( new apiResponse(200, commentsOnVideo,"all ceomments fetched Successfully" ))

})




const updateComment = asyncHandler(async (req, res) => {

    const { content } = req.body;
    const { commentId  } = req.params;

     if (!content) {
        throw new apiError(401, "Enter some content to comment");
      }
      if (!commentId) {
        throw new apiError(400, "Invalid input(s)")
    }
    
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          content:content
        },
        {new: true}
)

res.status(200).json(
    new apiResponse(200, updatedComment,"updated Comment Successfully"))



})


const deleteComment = asyncHandler(async (req, res) => {

    const { commentId  } = req.params;

      if (!commentId) {
        throw new apiError(400, "Invalid input(s)")
    }
    
     await Comment.findByIdAndDelete(commentId)
       

res.status(200).json(
    new apiResponse(200, {},"Comment DELETED"))

})


export {addComment,getVideoComments,updateComment,deleteComment}