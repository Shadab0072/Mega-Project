import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const LikedVideo = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/like/all-liked-videos', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });
        console.log(response.data.data); // Log the response data

        const videos = [];
        for (const like of response.data.data) {
          try {
            const videoResponse = await axios.get(`http://localhost:5000/api/v1/videos/${like.video}`);
            videos.push(videoResponse.data.data); // Add video data to the array
          } catch (videoError) {
            console.error(`Error fetching video ${like.video}:`, videoError);
            // Optionally, you could add a placeholder or skip this video
          }
        }

        setLikedVideos(videos);
      } catch (err) {
        console.error('Error fetching liked videos:', err);
        setError('Failed to fetch liked videos.');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  
  if (error) return <p>{error}</p>;

  return (
    <>
    <Navbar />
    <div className='flex flex-row'>
        <Sidebar />
        <div>
      <h1>Liked Videos</h1>
      <div className="grid grid-cols-3 gap-4">
        {loading && <p>Loading liked videos...</p>}
        {likedVideos.map((video) => (
          <div key={video._id} className="border rounded-lg overflow-hidden shadow-lg">
          
            <Link to={`/video/${video._id}`}>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 object-cover mb-4 rounded-md cursor-pointer"
              />
            </Link>
            <div className="p-4">
              <h2 className="font-bold">{video.title}</h2>
              <p>{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
    </>
  );
};

export default LikedVideo;
