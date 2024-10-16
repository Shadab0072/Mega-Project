import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create User Context
const VideoContext = createContext();

// Create a provider component
const VideoProvider = ({ children }) => {
  const [video, setVideo] = useState(null); // Store current user data
  //console.log("context api videodata : " ,video)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/videos/')
        const videoData = response.data.data.docs
        setVideo(videoData)
      } catch (err) {
        console.log("failed")
      }
    };
    fetchVideos();
  }, []);



  return (
    <VideoContext.Provider value={{ video}}>
      {children}
    </VideoContext.Provider>
  );
};

// Export UserContext and UserProvider
export { VideoContext, VideoProvider };
