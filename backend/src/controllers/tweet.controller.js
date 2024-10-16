import mongoose from "mongoose";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";


const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const userId = req.user._id

   const tweet = await Tweet.create({
        content : content,
        owner: userId
    })
    await tweet.save();

    res.status(200).json(new apiResponse(200,tweet,"twited successfully"))

})


const getUserTweets = asyncHandler(async (req, res) => {
  
    const tweets = await Tweet.find({ owner : req.user?._id });

    if (!tweets) {
      throw new apiError(401, "There are no tweets for this user");
    }
    return res
      .status(200)
      .json(new apiResponse(200, tweets, "All tweets are fetched"));

})




const getAllTweets = asyncHandler(async (req, res) => {
  
  const tweets = await Tweet.find();

  if (!tweets) {
    throw new apiError(401, "There are no tweets for this user");
  }
  return res
    .status(200)
    .json(new apiResponse(200, tweets, "All tweets are fetched"));

})


const updateTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const {tweetId} = req.params

    const tweet = await Tweet.findOne({ _id: tweetId });
    if (!tweet) {
      throw new apiError(404, "Tweet not found");
    }

   const updatedTweet = await Tweet.findByIdAndUpdate(tweetId,
    {content : content},
    {new: true},
    )

    res.status(200).json(new apiResponse(200,updatedTweet,"tweet updated successfully"))

})



const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params


   const tweet = await Tweet.findByIdAndDelete(tweetId)
            if (!tweet) {
                throw new apiError(404, "Tweet not found");
            }

    res.status(200).json(new apiResponse(200,{},"tweet DELETED"))


})



export { createTweet,getUserTweets,updateTweet,deleteTweet,getAllTweets}