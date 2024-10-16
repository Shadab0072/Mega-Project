import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();


  const logout = () => {
    localStorage.removeItem('accessToken'); // Remove token
    Cookies.remove('accessToken'); // Remove token from cookies
    navigate('/login')

  };




  return (
    <nav className="bg-gray-800 p-2 flex justify-between items-center">
      <div className="text-2xl font-bold text-white">VideoHut</div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="p-2 rounded bg-gray-700"
          placeholder="Search"
        />
        <button className="p-2 bg-yellow-500 rounded">Search</button>
        <button className='bg-slate-500 p-2 rounded-lg' onClick={logout}>Logout</button>

      </div>
    </nav>
  );
};

export default Navbar;
