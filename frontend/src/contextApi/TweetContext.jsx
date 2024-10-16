import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

const TweetContext = createContext()

const TweetProvider = ({children})=> {

    const [tweet,setTweet]= useState("")
   // console.log(tweet)

   const fetchTweet = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/tweet/usertweets', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
   // console.log('Full Response:', response.data);
    setTweet(response.data.data);
  } catch (error) {
    console.error('Error fetching tweet:', error);
  }
};


    useEffect(() => {
        fetchTweet();
      }, []);

      return (
        <TweetContext.Provider value={{tweet}}>
            {children}
        </TweetContext.Provider>
      )
}


export {TweetContext,TweetProvider}