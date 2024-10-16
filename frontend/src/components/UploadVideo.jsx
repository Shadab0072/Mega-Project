import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UploadVideoForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // Handle form field changes for title and description
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input changes for video and thumbnail
  const handleFileChange = (e) => {
    if (e.target.name === 'videoFile') {
      setVideoFile(e.target.files[0]);
    } else if (e.target.name === 'thumbnail') {
      setThumbnail(e.target.files[0]);
    }
  };

  // Handle form submit for video upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('videoFile', videoFile);
    uploadData.append('thumbnail', thumbnail);

    setUploading(true);
    
    try {
      const response = await axios.post(
        'http://localhost:5000/api/v1/videos', // Your backend video upload API endpoint
        uploadData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Assuming JWT auth
          },
        }
      );

      console.log('Video uploaded successfully:', response.data);
      setUploading(false);
      setIsVisible(false); // Close the form after success
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Button to open the floating form */}
    

      {/* Floating form modal */}
      
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              //onClick={() => setIsVisible(false)} // Close the form
              onClick={() => navigate(-1)}
            >
              &#10005; {/* Close (X) button */}
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center">Upload a Video</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Input */}
              <div>
                <label className="block mb-2 font-semibold">Video Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border px-4 py-2 w-full rounded-md"
                  placeholder="Enter video title"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block mb-2 font-semibold">Video Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border px-4 py-2 w-full rounded-md"
                  placeholder="Enter video description"
                  required
                />
              </div>

              {/* Video File Input */}
              <div>
                <label className="block mb-2 font-semibold">Upload Video File</label>
                <input
                  type="file"
                  name="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="border px-4 py-2 w-full rounded-md"
                  required
                />
              </div>

              {/* Thumbnail Input */}
              <div>
                <label className="block mb-2 font-semibold">Upload Thumbnail</label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="border px-4 py-2 w-full rounded-md"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 w-full rounded-md hover:bg-blue-600"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Video'}
              </button>
            </form>
          </div>
        </div>
    
    </div>
  );
};

export default UploadVideoForm;
