import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import VideoList from '../components/AllVideo';
import { UserContext } from '../contextApi/UserContext';

const VideoPlayer = () => {
  const { user } = useContext(UserContext);
  const currentUser = user;

  const { videoId } = useParams(); // Get the video ID from the route
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // State for comments
  const [newComment, setNewComment] = useState(''); // State for new comment
  const [users, setUsers] = useState({});
  const [videoOwner, setVideoOwner] = useState(null); // State for video owner
  const [isLiked, setIsLiked] = useState(false);  // To track if video is liked by the user
  const [likeCount, setLikeCount] = useState(0);  // To track number of likes on the video
  const [isSubscribed, setIsSubscribed] = useState(false);  // Subscription state

  // Fetch video details and increment views
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/videos/${videoId}`);
        const videoData = response.data.data;
        setVideo(videoData);

        // Fetch video owner profile
        const ownerResponse = await axios.get(`http://localhost:5000/api/v1/users/${videoData.owner}`);
        setVideoOwner(ownerResponse.data.data);            // Store the video owner profile


        // Increment view count
        await axios.put(`http://localhost:5000/api/v1/videos/${videoId}/view`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching or updating video:', err.response?.data || err.message);
        setError('Failed to load video details.');
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // Fetch like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/like/video-likes/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        const { isLiked, likeCount } = response.data.data;
        setIsLiked(isLiked);  // Set if the user has liked the video
        setLikeCount(likeCount);  // Set the total like count
      } catch (err) {
        console.error("Error fetching like status:", err.message);
      }
    };

    fetchLikeStatus();
  }, [videoId]);

  // Fetch all comments for the video
// Fetch comments

useEffect(() => {
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/comment/get-all-comment/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const commentsData = response.data.data;
      setComments(commentsData);

      const uniqueOwnerIds = [...new Set(commentsData.map(comment => comment.owner))];
      const usersData = {};
      
      for (let id of uniqueOwnerIds) {
        try {
          const userResponse = await axios.get(`http://localhost:5000/api/v1/users/${id}`);
          usersData[id] = userResponse.data;
        } catch (userErr) {
          console.error(`Failed to fetch user with id ${id}:`, userErr.message);
        }
      }

      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching comments', err.message);
    }
  };

  fetchComments();
}, [videoId]);

// Handle adding new comment
const handleAddComment = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      `http://localhost:5000/api/v1/comment/addcomment/${videoId}`,
      { content: newComment },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    setComments([...comments, response.data.data]); // Add new comment to the list
    setNewComment(''); // Clear input
  } catch (err) {
    console.error('Error adding comment', err.message);
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/v1/comment/delete-comment/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    if (response.status === 200) {
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    }
  } catch (error) {
    console.error('Failed to delete comment', error);
  }
};




// Inside your useEffect to fetch subscription status:
useEffect(() => {
  const fetchSubscriptionStatus = async () => {

    if (videoOwner?._id) {  // Ensure videoOwner is fetched before making the request
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/subscription/toggle-subscription/${videoOwner?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        // Assuming the response contains subscription data
        const { isSubscribed, subscription } = response.data.data;

        // Check if the current video owner (channel) matches the subscription's channel
        if (videoOwner._id === subscription?.subscribedTo) {
          setIsSubscribed(isSubscribed); // Set subscription status
        }

      } catch (err) {
        console.error('Error checking subscription:', err.message);
      }
    }
  };

  fetchSubscriptionStatus();
}, [videoOwner]);  // Fetch when videoOwner is available





const handleSubscribeToggle = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/v1/subscription/toggle-subscription/${videoOwner._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    // This part ensures you're toggling based on the owner (channel)
    setIsSubscribed(response.data.data.isSubscribed);
  } catch (err) {
    console.error('Error toggling subscription:', err.message);
  }
};














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






  const handleLikeToggle = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/like/video-likes/${videoId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      const { message } = response.data;
      if (message === "like added") {
        setIsLiked(true);
        setLikeCount(likeCount + 1);  // Increment the like count
      } else if (message === "like removed") {
        setIsLiked(false);
        setLikeCount(likeCount - 1);  // Decrement the like count
      }
    } catch (err) {
      console.error("Error toggling like:", err.message);
    }
  };



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6">
      {video && (
        <>
          <div className='flex flex-row w-full'>

            <div className='w-[70%]'>
              <ReactPlayer url={video.videoFile} controls width="100%" height="580px" />
              <h2 className="text-2xl font-bold mb-4">{video.title}</h2>
              <p className="mt-4 text-gray-600">{video.description}</p>
              <p className="text-gray-500 text-sm">Views: {video.views}</p> {/* Display view count */}
              <span className="text-sm text-gray-500">
                {new Date(video.createdAt).toDateString()}
              </span>

              {/* Like Button */}
              <div className="mt-4 flex items-center">
                <button
                  onClick={handleLikeToggle}
                  className={`px-4 py-2 rounded ${isLiked ? 'bg-red-500' : 'bg-gray-500'} text-white`}
                >
                  {isLiked ? 'Unlike' : 'Like'}
                </button>
                <p className="ml-4">{likeCount} Likes</p>
              </div>

            
             {/* Video Owner Section */}
             {videoOwner ? (
                <div className="mt-4 flex items-center space-x-4">
                  <img
                    src={videoOwner.avatar || '/default-avatar.png'}
                    alt={videoOwner.fullName || 'Owner'}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{videoOwner.fullName || 'Unknown User'}</h3>
                    <p className="text-sm text-gray-500">Uploaded by: {videoOwner.username}</p>
                  </div>

               

                  {/* Subscribe/Unsubscribe Button */}
                  <button
                    onClick={handleSubscribeToggle}
                    className={`ml-4 px-4 py-2 rounded ${isSubscribed ? 'bg-red-500' : 'bg-blue-500'} text-white`}
                  >
                    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                  </button>
                </div>
              ) : (
                <p>Loading owner details...</p>
              )}


              



               {/* Comments Section */}
               <div className="mt-6">
                <h3 className="text-lg font-semibold">Comments</h3>
                <form onSubmit={handleAddComment} className="mt-4">
                  <textarea
                    className="w-full p-2 border rounded"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    required
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                    Add Comment
                  </button>
                </form>

                <div>
                  {comments && comments.length > 0 ? (
                    comments
                      .map((comment, index) => {
                        const user = users[comment.owner]?.data;
                        return (
                          <div key={index} className="mb-4 p-2 border rounded bg-gray-100">
                            {comment.owner === currentUser?._id && (
                              <div className='flex flex-row gap-2'>
                                <button
                                  onClick={() => deleteComment(comment._id)}
                                  className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out'
                                >
                                  Delete
                                </button>
                              </div>
                            )}

                            {user ? (
                              <div className="flex items-center space-x-4">
                                <img
                                  src={user.avatar || '/default-avatar.png'}
                                  alt={user.fullName || 'User'}
                                  className="w-10 h-10 rounded-full"
                                />
                                <div>
                                  <h3 className="text-lg font-medium">{user.fullName || 'Unknown User'}</h3>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500">User profile not available</p>
                            )}

                            <p>{comment.content}</p>
                            <span className="text-sm text-gray-500">
                              {getTimeElapsed(new Date(comment.createdAt))}
                            </span>
                          </div>
                        );
                      })
                      .reverse()
                  ) : (
                    <p>No comments available.</p>
                  )}
                </div>
              </div>
            </div> 

            <div className='w-[30%]'>
              <VideoList className="grid grid-cols-1 gap-4" />
            </div>

          </div>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;
