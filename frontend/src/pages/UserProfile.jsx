import React, { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { UserContext } from '../contextApi/UserContext';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { VideoContext } from '../contextApi/VideoContext';
import UserTweets from './UserTweets';
import axios from 'axios';
import CreateTweet from './CreateTweet';

const UserProfile = () => {
  const { video } = useContext(VideoContext); 
  const { user, fetchUser } = useContext(UserContext); 
  const [activeTab, setActiveTab] = useState('videos');
  const [currentUser, setCurrentUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [content, setContent] = useState(''); // State for tweet content
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(false); // State for success messages

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const handleProfileEdit = () => {
    navigate('/edit-profile');
    fetchUser(); // Fetch updated user data after profile edit
  };

  // Handle tweet submission
  const handleTweetSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      const response = await axios.post('http://localhost:5000/api/v1/tweet/create-tweet', {
        content,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token if needed
        },
      });

      if (response.status === 201) {
        setSuccess(true);
        setContent(''); // Clear the input after submission
        setError(null); // Reset error message
      }
    } catch (err) {
      setError('Failed to create tweet: ' + (err.response?.data?.message || err.message));
      setSuccess(false); // Reset success state
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <main className="flex-grow p-6">
          {/* Cover Image */}
          <div
            className="relative w-full h-60 bg-cover bg-center mb-6"
            style={{
              backgroundImage: `url(${currentUser?.coverImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
          {/* Edit Button */}
          <button
            onClick={handleProfileEdit}
            className="absolute top-20 z-50 right-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-4 mb-6">
            {currentUser && (
              <img
                src={currentUser.avatar}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{currentUser?.fullName}</h2>
              <p className="text-gray-500">@{currentUser?.username}</p>
              <p>100 Subscriber • 10 Subscribed</p>
            </div>
          </div>

          {/* Tabs for Videos, Playlists, Tweets */}
          <div className="border-b border-gray-300 mb-6">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 ${activeTab === 'videos' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-600'}`}
            >
              Videos
            </button>
            <button
              onClick={() => setActiveTab('playlists')}
              className={`px-4 py-2 ${activeTab === 'playlists' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-600'}`}
            >
              Playlists
            </button>
            <button
              onClick={() => setActiveTab('tweets')}
              className={`px-4 py-2 ${activeTab === 'tweets' ? 'border-b-2 border-red-500 text-red-500' : 'text-gray-600'}`}
            >
              Personal Tweets
            </button>
          </div>

          {/* Create Tweet Form */}
          {activeTab === 'tweets' && <CreateTweet/>}

         {activeTab === 'tweets' && (
          <UserTweets/>
         )}

          {/* Video Upload Button */}
          {activeTab === 'videos' && (
            <Link to="/upload-video">
              <button
                className="fixed bottom-6 right-6 bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600"
                onClick={() => setIsVisible(true)}
              >
                Upload Video
              </button>
            </Link>
          )}

          {/* Video List */}
          <div className="grid grid-cols-4 gap-4">
            {activeTab === 'videos' ? (
              video?.map((videoItem, index) => (
                currentUser?._id === videoItem.owner && (
                  <div key={index} className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2">{videoItem.title}</h2>
                    <p className="text-gray-600 mb-2">{videoItem.description}</p>
                    <Link to={`/video/${videoItem._id}`}>
                      <img
                        src={videoItem.thumbnail}
                        alt={videoItem.title}
                        className="w-full h-40 object-cover mb-4 rounded-md cursor-pointer"
                      />
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                      Duration: {Math.round(videoItem.duration)} seconds
                    </p>
                  </div>
                )
              ))
            ) : (
              <div>No videos available</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
