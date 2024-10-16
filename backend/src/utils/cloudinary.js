import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});



const uploadOnCloudinary = async (localFilePath) =>{
    try {

        if (!localFilePath) return null

        const response = await cloudinary.uploader.upload(localFilePath, {  resource_type: "auto" },)

        console.log("file is uploaded on cloudinary ", response.url)
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath)  // delete the local file  //DELETE if an error occurs during the upload process.(clean up)
        return null
    }
}



const deleteFromCloudinary = async (localFilePath) => {

    let publicId = localFilePath.replace(/^.*\/upload\/(?:v\d+\/)?/, '');
    publicId = publicId.replace(/\.[^/.]+$/, '');
      
    await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            throw new ApiError(
                500,
                "existing file could not be deleted from cloudinary"
            );
        } 
    });
};


const getVideoDurationFromCloudinary = async (publicId) => {
    //console.log("publicId",publicId)
    return new Promise((resolve, reject) => {
        cloudinary.api.resource(publicId, {media_metadata:true , resource_type: 'video' }, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
    });
};


export {uploadOnCloudinary,deleteFromCloudinary,getVideoDurationFromCloudinary}