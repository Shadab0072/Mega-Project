import React, { useState } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = ()=>{

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
           
           const response = await axios.post('http://localhost:5000/api/v1/users/login',{email,password} );
           console.log(response.data);                // Handle the response data
          
           const { accessToken, refreshToken } = response.data.data
           
           localStorage.setItem('accessToken',accessToken)
           localStorage.setItem('refreshToken',refreshToken)

           Cookies.set('accessToken', accessToken, { expires: 1 }); 
           Cookies.set('refreshToken', refreshToken, { expires: 7 });

           navigate('/')
          

        } catch (error) {
            console.error('Error fetching data:', error);
            console.log(error.response.data.message )
            console.log("login failed")
        }
           }



    return ( 
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
       <NavLink to={'/register'}><button className="text-center font-bold bg-red-300">register</button></NavLink>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>


        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              value = {email}
              onChange = {(e)=>setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500"
              value = {password}
              onChange = {(e)=>setPassword(e.target.value)}
              required
            />
          </div>
         
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>


      </div>
    </div>
      )

}

export default Login