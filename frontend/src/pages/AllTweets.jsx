import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateTweet from './CreateTweet';
import { UserContext } from '../contextApi/UserContext';

const UserTweets = () => {

  const {user} = useContext(UserContext)
  const currentUser = user

  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState({});
  const [error, setError] = useState(null);
  


   //console.log("t1 : ",tweets)
  // console.log("u1 :",users)

   console.log("current user :" , currentUser?._id)



  // Fetch tweets and user data
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        // Fetch all tweets (public access)
        const tweetsResponse = await axios.get('http://localhost:5000/api/v1/tweet/all-tweets');

        if (!tweetsResponse.data || !tweetsResponse.data.data) {
          throw new Error('No tweets data found in response');
        }

        const tweetsData = tweetsResponse.data.data;
        setTweets(tweetsData);
        console.log(tweetsData)
        // Fetch user profiles based on unique owner IDs
        const uniqueOwnerIds = [...new Set(tweetsData.map(tweet => tweet.owner))];  
        const usersData = {};
        
        for (let id of uniqueOwnerIds) {
          try {
            const userResponse = await axios.get(`http://localhost:5000/api/v1/users/${id}`);

            // To add a key-value pair to the object: usersData[key] = value
            usersData[id] = userResponse.data; 
          } catch (userErr) {
            console.error(`Failed to fetch user with id ${id}:`, userErr.message);
          }
        }

        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching tweets or users:', err.message);
        setError('Failed to fetch userData or tweet');
      }
    };

    fetchTweets();
  }, []);



  const deleteTweet = async(tweetId)=> {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/tweet/delete-tweet/${tweetId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      if (response.status === 200) {
        setTweets((prevTweets) => prevTweets.filter((tweet) => tweet._id !== tweetId));
      }
    } catch (error) {
      console.error(`Failed to delete tweet`);
    }
  }

  if (error) return <div>{error}</div>;

  return (

    <>
      <Navbar/>
      <div className='flex flex-row'>
        <Sidebar/>

        <div className="w-full mx-auto p-4">
        <CreateTweet/>
          <div className="space-y-4">
            {     
              tweets?.length > 0 ?
              tweets.map((tweet) => {

                console.log("tweet ka owner :" , tweet.owner)

                const user = users[tweet.owner]?.data; // Access user data from the new structure
                return (
                  <div key={tweet._id} className="p-4 bg-white shadow rounded-lg">

                    {tweet.owner === currentUser?._id && 
                  <div className='flex flex-row gap-2'>
                  
                  <button  onClick={() => deleteTweet(tweet._id)} className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out'>
                    Delete
                  </button>
                </div>
                
                    }

                    { user ? (
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.avatar || '/default-avatar.png'}
                          alt={user.fullName || 'User'}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h3 className="text-lg font-medium">{user.fullName || 'Unknown User'}</h3>
                          <span className="text-sm text-gray-500">{new Date(tweet.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">User profile not available</p>
                    )}
                    <p className="mt-2 text-xl font-bold text-black-700">{tweet.content}</p>
                  </div>
                );
              }).reverse(): <div>No tweets available</div>
            }
          </div>
        </div>
      </div>
    </>

  );
};

export default UserTweets;
