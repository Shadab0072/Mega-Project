import React, { useState } from 'react';
import axios from 'axios';

const CreateTweet = () => {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      const response = await axios.post('http://localhost:5000/api/v1/tweet/create-tweet', {
        content,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Include token if needed
        },
      });

      
        setSuccess(true);
        setContent(response)
        
        setContent(''); // Clear the input
        setError(null); // Reset error message
      
    } catch (err) {
      setError('Failed to create tweet: ' + (err.response?.data?.message || err.message));
      setSuccess(false); // Reset success state
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Create a Tweet</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
        <div>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Tweet
        </button>
      </form>
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {success && <p className="mt-2 text-green-500">Tweet created successfully!</p>}
    </div>
  );
};

export default CreateTweet;
