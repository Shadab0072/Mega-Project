import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../contextApi/UserContext';

  const UserTweets = () => {
    const {user} = useContext(UserContext)
    const currentUser = user
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tweets and user data
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        // Fetch tweets
        const tweetsResponse = await axios.get('http://localhost:5000/api/v1/tweet/usertweets', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!tweetsResponse.data || !tweetsResponse.data.data) {
          throw new Error('No tweets data found in response');
        }

        const tweetsData = tweetsResponse.data.data;
        setTweets(tweetsData);

        // Fetch user profiles based on unique owner IDs
        const uniqueOwnerIds = [...new Set(tweetsData.map(tweet => tweet.owner))];  
        //Set is a built-in JavaScript object that stores only unique values. 
        //When you pass an array into a Set, it automatically removes any duplicate values.
        //new Set(tweetsData.map(tweet => tweet.owner)) will take the array of owner IDs and return a set containing only the unique user IDs.
       //Becoause of ...(spread)  ====>>> Set { 'user1', 'user2' }   ====>>>   ['user1', 'user2']
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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tweets or users:', err.message);
        setError('Failed to fetch userData or tweet');
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);



  const deleteTweet = async(tweetId)=> {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/tweet/delete-tweet/${tweetId}`, {
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





  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="space-y-4">
        {     
        tweets?.length > 0 ?
        tweets.map((tweet) => {
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
              {user ? (
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
        }).reverse(): <div>no tweet available</div>
        
        }
      </div>
    </div>
  );
};

export default UserTweets;
