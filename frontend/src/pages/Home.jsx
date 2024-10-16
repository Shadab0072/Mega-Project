import React from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import VideoList from '../components/AllVideo';

const Home = () => {


  return (
    <>
    <div>
        <Navbar/>
            <div className='flex flex-row'>
                <Sidebar />
                <VideoList className="grid grid-cols-4 gap-6 p-6"/>
                
            </div> 
    </div>
    
    </>
  )
}


export default Home


