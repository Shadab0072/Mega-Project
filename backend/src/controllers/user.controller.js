import mongoose from 'mongoose'
import { User } from '../models/user.model.js'
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { deleteFromCloudinary,  uploadOnCloudinary } from '../utils/cloudinary.js'
import jwt from 'jsonwebtoken'


const generateAccessTokenAndGenerateRefreshToken = async(userId) => {
try {
    
    const user = await User.findById(userId)
    
    const accessToken = user.generateAccessToken()
    const refreshToken =  user.generateRefreshToken()

//    console.log(accessToken)
//    console.log(refreshToken)  

    

    //we will save refreshToken token in database also because if user get signout then user dont need to enter password again. he can just verify by refsresh token 

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave : false })   //to save in Database & avoid validatation while saving refresh token in DB

    return { accessToken , refreshToken}

} catch (error) {
    throw new apiError(500,"error while generating access token & refresh token")
}
}



const registerUser = asyncHandler ( async(req,res) =>{

// for registerUser

// 1. get user details from frontend
// 2. validation (feilds should not be empty)
// 3. check if user already exist (by email & username)
// 4. get localpath for avatar+coverImage & check for avatar on server/multer
// 5. upload both files on cloudinary  (check avatar on cloudinary)
// 6. create user object for entry in DB
// 7. check for userCreated & remove password+refresh token from response
// 8. return response




// 1. get user details from frontend
const  { username, email, fullName, password } = req.body


// 2. validation (feilds should not be empty)
if( [ username, email, fullName, password ].some((feild)=>(
    feild?.trim() === ""
)) ){
    throw new apiError(400,"All Feilds are required")
}

// if(username === ""){
//     throw new apiError(400,"username is required")
// }
// if(email === ""){
//     throw new apiError(400,"email is required")
// }
// if(fullName === ""){
//     throw new apiError(400,"fullName is required")
// }
// if(password === ""){
//     throw new apiError(400,"password is required")
// }




// 3. check if user already exist (by email & username)
const existedUser = await User.findOne({
    $or : [{email},{username}]                                      //$or by mongoDb
})

//console.log(existedUser)

if (existedUser){
    throw new apiError(400,"email or username already existed")
}

//console.log(req.files)




// 4. get localpath for avatar+coverImage & check for avatar on server/multer
const avatarLocalPath = req.files?.avatar?.[0]?.path

const coverImageLocalPath = req.files?.coverImage?.[0]?.path; 






// let coverImageLocalPath;
// if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
//     coverImageLocalPath = req.files?.coverImage[0]?.path 
// }






if (!avatarLocalPath){
    throw new apiError(400,"avatar path required")
}






// 5. upload both files on cloudinary  (check avatar on cloudinary)
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)




if(!avatar){
    throw new apiError(400,"avatar Image(URL) is required")
    
}





// 6. create user object for entry in DB
const user = await User.create({
    fullName: fullName,
    email : email,
    password : password,
    username : username?.toLowerCase(),
    avatar : avatar.url,
    coverImage : coverImage?.url || "" 
}) 






// 7. check for userCreated & remove password+refresh token from response

const userCreated = await User.findById(user._id).select("-password -refreshToken")

if(!userCreated){
    throw new apiError(500, "user not created , something went wrong while registering the user")
}






// 8. return response


// return res.status(201).json(userCreated)
return res.status(201).json(new apiResponse(201,userCreated,"user registered succesfully"))


})



const loginUser = asyncHandler( async(req,res)=>{

// logics for login

// 1. data from frontend (email,username,password)
// 2. check email or username is available for further process
// 3. find the user in DB by email or username
// 4. check password
// 5. generate access token & refresh token
// 6. loggedIn user details to send in response (avoid password & refreshToken)
// 7. send tokens in cookies & send response


// 1. data from frontend (email,username,password)
const {email,username,password} = req.body

// 2. check email or username is available for further process
if(!(username || email)){
    throw new apiError(400,"username or email is required")
}


// 3. find the user in DB by email or username
const user = await User.findOne({
    $or : [{email},{username}]
})



if(!user){
    throw new apiError(400, "wrong email/username")
}



// 4. check password
 const isPasswordValid = await user.isPasswordCorrect(password)

 if(!isPasswordValid){
    throw new apiError(401, "incorrect credentials")
 }




// 5. generate access token & refresh token 
const {accessToken , refreshToken} = await generateAccessTokenAndGenerateRefreshToken(user._id)




// 6. loggedIn user details to send in response  (avoid password & refreshToken)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


// 7. send tokens in cookies & send response

const options = {     //this restrict user to update cookies from frontend . user only can read cookies but cant write
    httpOnly : true,    
    secure : true
}

res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken , options )
.json(new apiResponse(200,{
    user : loggedInUser,
    accessToken,        // here we are sending tokens again in response because apps & some devices dont accept cookies.
    refreshToken,
},"user logged in successfully"))

})



const logoutUser = asyncHandler( async(req,res)=>{ 

    const userId = req.user._id   //now req have access of user because of auth.middleware.js  
     
    await User.findByIdAndUpdate( 
        userId, 
        { 
            $unset: {  
                refreshToken: 1 // This removes the field from the document
            } 
        }, 
        { 
            new: true  // This option returns the updated document 
        } 
    );


    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged Out!!"))
    })


    
const refreshAccessToken = asyncHandler( async(req,res)=>{

// logic
// 1. Take refresh token from frontend
// 2. verify token 
// 3. compare incomingRefresh token with refreshToken that is already saved in DB
// 4. Genererate new access + refresh token
// 5. Response (set new access & new refresh token in cookies)

// 1. Take refresh token from frontend
const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new apiError(401, "unauthorized request")
        }

try {
    
    // 2. verify token 
    const decodedRefreshToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
    
    // 3. compare incomingRefresh token with refreshToken that is already saved in DB
    const user = await User.findById(decodedRefreshToken._id)
    
    if (!user) {
        throw new apiError(401, "Invalid refresh token")
    }
    
    if(user?.refreshToken !== incomingRefreshToken){
    throw new apiError(401, "Refresh token is expired or used")
    }
    
    
    // 4. Genererate new access + refresh token
    
    const {accessToken , refreshToken} = generateAccessTokenAndGenerateRefreshToken(decodedRefreshToken._id)
    
    
    
    // 5. Response (set new access + refresh token in cookies)
    
    const options = {     //this restrict user to update cookies from frontend . user only can read cookies but cant write
        httpOnly : true,    
        secure : true
    }
    
    
    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken , options )  
    .json(new apiResponse(200,{
        accessToken,        // here we are sending tokens again in response because apps & some devices dont accept cookies.
        refreshToken,
    },"Access token refreshed"))
    
    
} catch (error) {
    throw new apiError(401, error?.message || "Invalid refresh token || problem in try block ")
}




})



const  changeCurrentPassword  = asyncHandler(async(req,res)=>{

//logics for change password

// 1. take old password  & new Password from user
// 2. get currentUser & check old password is correct or not by "isPasswordCorrect()"
// 3. set & save new password in user 
// 4. return response


// 1. take old password  & new Password from user
const { oldPassword , newPassword } = req.body

// 2. get currentUser & check old password is correct or not by "isPasswordCorrect()"

const user = await User.findById(req.user?._id)

const isPasswordMatched = await user.isPasswordCorrect(oldPassword)

if (!isPasswordMatched) {
    throw new apiError(400,"Invalid Password")
}


// 3. set & save new password in user 

user.password = newPassword
await user.save({validateBeforeSave: false})

// 4. return response
return res.status(200).json(new apiResponse(200, {}, "password changed successfully"))


})

    
const getCurrentUser  = asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new apiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))

})

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, username } = req.body;
  
    // Extract avatar and cover image paths from files
    const avatarLocalPath = req.files?.avatar?.[0]?.path; // Get first file's path if exists
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  
    if (!username && !fullName && !avatarLocalPath && !coverImageLocalPath) {
      throw new apiError(400, "Please provide at least one field to update");
    }
  
    const updates = {};
  
    if (fullName) updates.fullName = fullName;
    if (username) updates.username = username;
  
    if (avatarLocalPath) {
      const avatar = await uploadOnCloudinary(avatarLocalPath);
      if (!avatar.url) {
        throw new apiError(400, "Error while uploading avatar");
      }
      updates.avatar = avatar.url;
      // Delete old avatar only if exists
      if (req.user.avatar) {
        deleteFromCloudinary(req.user.avatar);
      }
    }
  
    if (coverImageLocalPath) {
      const coverImage = await uploadOnCloudinary(coverImageLocalPath);
      if (!coverImage.url) {
        throw new apiError(400, "Error while uploading cover image");
      }
      updates.coverImage = coverImage.url;
      // Delete old cover image only if exists
      if (req.user.coverImage) {
        deleteFromCloudinary(req.user.coverImage);
      }
    }
  
    const user = await User.findByIdAndUpdate(req.user?._id, { $set: updates }, { new: true }).select("-password");
  
    return res.status(200).json(new apiResponse(200, user, "Profile updated successfully"));
  });
  
  

// const updateAccountDetails  = asyncHandler(async(req,res)=>{


//     const {fullName,username} = req.body

//                 if (!username && !fullName){
//                     throw new apiError(400, "please provide username or fullName")
//                 }
    
//    const user = await User.findByIdAndUpdate(req.user?._id,
//         {
//           $set: {
//             fullName,    // fullName : fullName
//             username     // username : username
//           }
//         },
//         {
//         new:true
//     }).select("-password")     
    
//     return res
//     .status(200)
//     .json(new apiResponse(200, user, "Account details updated successfully"))


// })




// const updateUserAvatar =  asyncHandler(async(req,res)=>{

//     const avatarLocalPath = req.file?.path

//     if (!avatarLocalPath) {
//         throw new apiError(400, "Avatar file is missing")
//     }   
    
   
//     const avatar = await uploadOnCloudinary(avatarLocalPath)

//     if (!avatar.url) {
//         throw new apiError(400, "Error while uploading on avatar")
        
//     }

//     const user = await User.findByIdAndUpdate(req.user?._id,
//         {
//           $set: {
//             avatar: avatar?.url
//           }
//         },
//         {
//         new:true
//     }).select("-password")   

//     deleteFromCloudinary(req.user.avatar)

    
    
//     return res
//     .status(200)
//     .json(
//         new apiResponse(200, user, " Avatar image updated successfully ")
//     )
// })




// const updateUserCoverImage =  asyncHandler(async(req,res)=>{

//     const coverImageLocalPath = req.file?.path

//     if (!coverImageLocalPath) {
//         throw new apiError(400, "coverImage file is missing")
//     }
    
//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)
          
    
//     if (!coverImage.url) {
//         throw new apiError(400, "Error while uploading on coverImage")
        
//     }

//     const user = await User.findByIdAndUpdate(req.user?._id,
//         {
//             $set: {
//                 coverImage: coverImage?.url
//             }
//         },
//         {
//             new:true
//         }).select("-password")   
        
//         // TODO: delete old image - assignment 
  
//         deleteFromCloudinary(req.user.coverImage)

//     return res
//     .status(200)
//     .json(
//         new apiResponse(200, user, " coverImage image updated successfully ")
//     )
// })



const getUserByID= asyncHandler(async(req,res)=>{
    const {id} = req.params
    const user = await User.findById(id) 
    return res.status(200).json(new apiResponse(200, user, "user profile fecthed by id"));

})





const getUserChannelProfile = asyncHandler(async(req,res)=>{
    
    const {username} = req.params   

    if (!username?.trim()) {
        throw new apiError(400, "username is missing")
    }

    //console.log(username)

    // {
    //     $lookup: {
    //       from: "<foreign_collection>",
    //       localField: "<local_field>",
    //       foreignField: "<foreign_field>",
    //       as: "<output_field>"
    //     }
    //   }


    // {
    //     $addFields: {
    //       <newField>: <expression>,
    //       <existingField>: <expression>
    //     }
    // }   


    const channel = await User.aggregate([
        {
            $match :  {                                  // {$match: {<field>: <value>}}  
                username : username?.toLowerCase()     //for safety we can use   ?.toLowerCase()
            }                                 
        },{
            $lookup: {
                from : "subcriptions",             //Subcription => lowercase & plural 
                localField: "_id",
                foreignField: "cannel",
                as: "subscribers"                 //follower
            }
        },{
            $lookup: {
                from : "subcriptions",             //Subcription => lowercase & plural 
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"                //following
            }
        },
        {
            $addFields: {
                subscribersCount : {$size : "$subscribers"},
                channelsSubscribedToCount: {$size : "$subscribedTo"},
                isSubscribed :{
                    $cond: {
                        if: {$in : [req.user?._id, "$subscribers.subscriber"]},            //{ $in: [<value>, <array>] }
                        then: true,
                        else: false
                      }
                }
                     
            
            }
        },{
            $project:{

                fullName: 1,            //   1 -> included     0 -> excluded
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel.length) {
        //console.log(channel)
        throw new apiError(404, "channel does not exists" )
        
    }

    return res
    .status(200)
    .json(
        new apiResponse(200, channel[0], "User channel fetched successfully")
    )
})




const getWatchHistory = asyncHandler(async(req,res)=>{
   const user =  await User.aggregate([
        {
            $match: {
                //mongoose.Types.ObjectId.createFromHexString(req.user._id)
                _id: new mongoose.Types.ObjectId(req.user._id) //you cant take directly req.user._id in aggregate
                //We use new mongoose.Types.ObjectId() to ensure the ID is in the proper format since we are working within an aggregation pipeline
            }
        },
        {
            $lookup:{
                from : "videos",
                localField : "watchHistory",
                foreignField: "_id",
                as : "watchHistory",
                pipeline: [                                       //nested aggregate
                    {
                        $lookup :{
                            from : "users",
                            localField : "owner",
                            foreignField: "_id",
                            as : "owner",
                            pipeline:[
                               {
                                $project : {
                                    fullName: 1,
                                    username: 1,
                                    avatar: 1
                                }
                               }
                            ]
                        }
                    } ,
                    {
                        $addFields : {
                            owner:{
                                $first : "$owner"
                            }
                        }
                    } 
                ]
            }
        }
        ])

        // localField: "owner": You use "owner" without $ because you’re specifying the field name in the document.
        // $first: "$owner": You use "$owner" with $ because you’re referring to the value of the owner field that was populated earlier in the aggregation pipeline.

        return res.status(200).json(
          new apiResponse(200,user[0].watchHistory,"Watch history fetched successfully")
        )





})




export  {
    registerUser,
    loginUser,
    logoutUser, 
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateUserProfile,
    getUserChannelProfile,
    getWatchHistory,
    getUserByID
}




