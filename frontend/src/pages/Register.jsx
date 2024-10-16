import React, { useState } from "react";
import axios from 'axios';
import { NavLink } from "react-router-dom";




const Register = () => {

    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        avatar: null,        //Use null: When dealing with non-string values like file uploads.
        coverImage: null,
        password: '',
      });

      const initialState = {
        fullName: '',
        username: '',
        email: '',
        avatar: null,
        coverImage: null,
        password: '',
    };
        


  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] }); //e.target.name dynamically refers to the name of the input (like avatar or coverImage), so you can reuse the function for multiple file inputs.
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });  //In JavaScript, you can define object properties dynamically using computed property names, which is done using square brackets [].  [] allows you to use the value of a variable as the key
    }
  };



    const handleSubmit = async(e)=>{
        e.preventDefault()
        const formDataObj = new FormData()   // FormData is a built-in JavaScript object that is used to construct a set of key/value pairs representing form fields and their values. This object is especially useful for sending data, including files, via AJAX requests (such as fetch or XMLHttpRequest).

        formDataObj.append('fullName', formData.fullName)
        formDataObj.append('username', formData.username);
        formDataObj.append('email', formData.email);
        formDataObj.append('avatar', formData.avatar);
        formDataObj.append('coverImage', formData.coverImage);
        formDataObj.append('password', formData.password);
    
            try {
                const response = await axios.post('http://localhost:5000/api/v1/users/register',formDataObj, 
                    {headers: { 'Content-Type': 'multipart/form-data' }});
                console.log(response.data); // Handle the response data
                setFormData(initialState);

            }
             catch (error) {
              if (error.response) {
                  // The request was made and the server responded with a status code
                  console.error('Error fetching data:', error.response.data);
              } else if (error.request) {
                  // The request was made but no response was received
                  console.error('No response received:', error.request);
              } else {
                  // Something happened in setting up the request that triggered an Error
                  console.error('Error:', error.message);
              }
          }
            

    }
     



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

            <NavLink to={'/login'}><button className="text-center font-bold bg-red-300">login</button></NavLink>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value= {formData.fullName}
                  onChange = {handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
    

              <div className="mb-4">
                <label className="block mb-1 font-semibold">Username</label>
                <input
                  type="text"
                  name="username"    //name is used for data identification in the backend.
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
    
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
    
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Avatar</label>
                <input
                  type="file"
                  name="avatar"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
    
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Cover Image</label>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  
                />
              </div>
    
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
    
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Register
              </button>
    
              {/* {message && (
                <p className={`mt-4 text-center ${message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )} */}

            </form>
          </div>
        </div>
      );

}



export default Register;