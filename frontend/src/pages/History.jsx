import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { UserContext } from '../contextApi/UserContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owners, setOwners] = useState({}); // Store owners' details

    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchHistory = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/v1/videos/history/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                const historyData = response.data.watchHistory;
                setHistory(historyData);
                //console.log(historyData)

                // Fetch owner details for each video
                const ownersData = {};
                const uniqueOwnerIds = [...new Set(historyData.map((video) => video.owner))];
                console.log(ownersData)

                for (let ownerId of uniqueOwnerIds) {
                    try {
                        const userResponse = await axios.get(`http://localhost:5000/api/v1/users/${ownerId}`);
                        ownersData[ownerId] = userResponse.data; // Store owner details
                        //console.log(userResponse.data)
                    } catch (ownerErr) {
                        console.error(`Failed to fetch owner with id ${ownerId}:`, ownerErr.message);
                    }
                }

                setOwners(ownersData);
                setLoading(false);
            } catch (err) {
                setError('Error fetching history');
                setLoading(false);
            }
        };

        if (user) {
            fetchHistory(user._id);
        }
    }, [user]);

    function getTimeElapsed(createdAt) {
        const now = new Date();
        const diffInMs = now - new Date(createdAt);

        const seconds = Math.floor(diffInMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        }
    }

    if (error) return <div>{error}</div>;

    return (
        <>
            <Navbar />
            <div className='flex flex-row'>
                <Sidebar />
                <div className="p-6">
                    {loading && <div>Loading...</div>}
                    <h2 className="text-2xl font-bold mb-4">Watch History</h2>
                    {history.length === 0 ? (
                        <p>No videos watched yet.</p>
                    ) : (
                        history?.map((video) => {
                            const owner = owners[video.owner]; // Get the owner details
                            console.log(owner?.data.avatar)
                            return (
                                <div key={video._id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                                    {/* Display owner's avatar and name */}
                                    {owner && (
                                        <div className="flex items-center space-x-4 mb-4">
                                            <img
                                                src={owner?.data.avatar || '/default-avatar.png'}
                                                alt={owner?.data.fullName || 'User'}
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div>
                                                <h3 className="text-lg font-medium">{owner?.data.fullName || 'Unknown User'}</h3>
                                            </div>
                                        </div>
                                    )}

                                    <h2 className="text-lg font-bold mb-2">{video.title}</h2>
                                    <p className="text-gray-600 mb-2">{video.description}</p>
                                    <Link to={`/video/${video._id}`}>
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-40 object-cover mb-4 rounded-md cursor-pointer"
                                        />
                                    </Link>
                                    <p className="text-sm text-gray-500">Views: {video.views}</p>
                                    <span className="text-sm text-gray-500">
                                           {getTimeElapsed(new Date(video.createdAt))}
                                    </span>
                                </div>
                            );
                        }).reverse()
                    )}
                </div>
            </div>
        </>
    );
};

export default History;
