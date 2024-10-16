import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const VideoList = ({ className }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/videos/');
        const videoData = response.data.data.docs;
        setVideos(videoData);
        setLoading(false);
      } catch (err) {
        setError('Error fetching videos');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);


  function getTimeElapsed(createdAt) {
    const now = new Date();
    const diffInMs = now - createdAt;

    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day ago`;
    } else if (hours > 0) {
      return `${hours} hour ago`;
    } else if (minutes > 0) {
      return `${minutes} minute ago`;
    } else {
      return `${seconds} second ago`;
    }
  }



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={className}>
      {videos.length === 0 ? (
        <div>No videos available</div>
      ) : (
        videos.map((video) => (
          <div key={video._id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-bold mb-2">{video.title}</h2>
            <p className="text-gray-600 mb-2">{video.description}</p>
            <Link to={`/video/${video._id}`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover mb-4 rounded-md cursor-pointer"
              />
            </Link>
            <p className="text-sm text-gray-500 mt-2">Duration: {Math.round(video.duration)} seconds</p>
            <p className="text-sm text-gray-500 mt-2">Views: {video.views}</p> {/* Display views count */}
            <span className="text-sm text-gray-500">
                              {getTimeElapsed(new Date(video.createdAt))}
             </span>
          </div>
        ))
      )}
    </div>
  );
};

export default VideoList;
