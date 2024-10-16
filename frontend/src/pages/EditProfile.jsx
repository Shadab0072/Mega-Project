import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../contextApi/UserContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const EditProfile = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'avatar') {
      setAvatar(e.target.files[0]);
    } else if (e.target.name === 'coverImage') {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('username', formData.username);
    if (avatar) data.append('avatar', avatar);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      const response = await axios.patch(
        'http://localhost:5000/api/v1/users/update-profile',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />

        <main className="flex-grow p-6">
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleProfileUpdate} className="mb-6">
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded-md"
                placeholder="Enter full name"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border px-4 py-2 w-full rounded-md"
                placeholder="Enter username"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Change Avatar</label>
              <input type="file" name="avatar" onChange={handleFileChange} />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Change Cover Image</label>
              <input type="file" name="coverImage" onChange={handleFileChange} />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
          <Link to="/profile">
            <button
              type="button"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Back
            </button>
          </Link>
        </main>
      </div>
    </>
  );
};

export default EditProfile;
