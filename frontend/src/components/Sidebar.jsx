import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (

    <aside className="bg-gray-800 w-64  p-4 text-white min-h-screen">
      <ul className="space-y-10">
    <Link to="/"><li className="hover:bg-gray-700 p-2 rounded">Home</li></Link>    
    <Link to="/profile"><li className="hover:bg-gray-700 p-2 rounded">Your Channel</li></Link>    
    <Link to="/all-tweet"><li className="hover:bg-gray-700 p-2 rounded">All Tweets</li></Link>    
    
    <Link to="/history"><li className="hover:bg-gray-700 p-2 rounded">History</li></Link>  

    <Link to="/liked-video"><li className="hover:bg-gray-700 p-2 rounded">Liked Videos</li></Link>    

        <li className="hover:bg-gray-700 p-2 rounded">Subscriptions</li>
        <li className="hover:bg-gray-700 p-2 rounded">User Dashboard</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
