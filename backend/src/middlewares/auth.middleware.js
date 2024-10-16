import jwt from 'jsonwebtoken'
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { User } from '../models/user.model.js';


export const verifyJWT = asyncHandler( async(req,_,next)=>{

    try {   
        const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") //because apps & some devices dont have cookies so we use Headers

        if(!token){
           return new apiError(400, "Unauthorized request") 
        }

       const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

       const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

            if (!user) {   
                throw new apiError(401, "Invalid Access Token")
            }
        
        req.user = user   //req ke pas user ka power mil jayega agr wo jwt verified hoga.kyuki authentication ek middleware h

        next();

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token")
        
    }

})