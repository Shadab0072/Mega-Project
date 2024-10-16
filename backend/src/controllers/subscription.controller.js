import { Subscription } from "../models/subscription.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


// const toggleSubscription = asyncHandler(async (req, res) => {



//     const {channelId} = req.params
//     const userId = req.user._id;

//     if (!channelId) {
//       throw new ApiError(401, "Insert Channel ID to search for the channel");
//     }
   
//     let subscription = await Subscription.findOne({
//         subscriber: userId,
//         channel: channelId,
//       });


//       let isSubscribed;
//       if (subscription) {
//         await Subscription.deleteOne({ _id: subscription._id });
//         isSubscribed = false;
//         console.log("Unsubscribed successfully");
//       } else {
//         subscription = await Subscription.create({
//           subscriber: userId,
//           channel: channelId,
//         });
//         isSubscribed = true;
//         console.log("Subscribed successfully");
//       }

//       return res.status(200).json(
//         new apiResponse(
//           200,
//           {
//             isSubscribed,
//             subscription,
//           },
//           "Subscription status toggled successfully"
//         )
//       );
//     }); 



// controller to return subscriber list of a channel



const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;  // Channel (video owner) ID
  const userId = req.user._id;        // Logged-in user (subscriber)

  if (!channelId) {
    throw new ApiError(401, "Channel ID is required to check subscription.");
  }

  // Find subscription where the current user has subscribed to this channel
  let subscription = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,  // Subscription based on the channel (video owner)
  });

  let isSubscribed;

  // If subscription exists, unsubscribe (delete it)
  if (subscription) {
    await Subscription.deleteOne({ _id: subscription._id });
    isSubscribed = false;
    console.log("Unsubscribed successfully");

  // If subscription doesn't exist, create a new subscription
  } else {
    subscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
    isSubscribed = true;
    console.log("Subscribed successfully");
  }

  return res.status(200).json(
    new apiResponse(
      200,
      {
        isSubscribed,
        subscription,
      },
      "Subscription status toggled successfully"
    )
  );
});











const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    // Find all subscriptions for the channel
    const subscriptions = await Subscription.find({ channel: channelId }).populate('subscriber', 'username email'); //'username' and 'email' fields exist in User model

    // Check if the channel has any subscribers
    if (!subscriptions || subscriptions.length === 0) {
        return res.status(404).json(new apiResponse(404, [], "No subscribers found for this channel"));
    }

    // Return the list of subscribers
    res.status(200).json(new apiResponse(200, subscriptions, "Subscribers retrieved successfully"));
});



// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    // Find all subscriptions where the subscriber matches subscriberId
    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate('channel', 'usernname email'); // Populate the 'channel' field with the username and email of the channel (User)

    // Check if the user is subscribed to any channels
    if (!subscriptions || subscriptions.length === 0) {
        return res.status(404).json(new apiResponse(404, [], "No subscriptions found for this user"));
    }

    // Return the list of subscribed channels
    res.status(200).json(new apiResponse(200, subscriptions, "Subscribed channels retrieved successfully"));
});

export default getSubscribedChannels;



export {toggleSubscription,getUserChannelSubscribers,getSubscribedChannels}





