import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import './index.css'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import UserProfile from './pages/UserProfile.jsx';
import { UserProvider } from './contextApi/UserContext.jsx';
import EditProfile from './pages/EditProfile.jsx';
import UploadVideo from './components/UploadVideo.jsx';
import UploadVideoForm from './components/UploadVideo.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import { VideoProvider } from './contextApi/VideoContext.jsx';
import UserTweets from './pages/UserTweets.jsx';
import CreateTweet from './pages/CreateTweet.jsx';
import AllTweets from './pages/AllTweets.jsx';
import History from './pages/History.jsx';
import LikedVideo from './pages/LikedVideo.jsx';



function App() {

  return (
    <>

<UserProvider>
<VideoProvider>
 
  <Router>
    <Routes>

      <Route path="/register" element={ <Register/>} />
      <Route path="/login" element={ <Login/>}/>

      <Route path="/"element={<ProtectedRoute>  <Home />  </ProtectedRoute>} />

      <Route path="/profile" element={<UserProfile />} />
      <Route path="/edit-profile" element={<EditProfile />} />

      <Route path="/upload-video" element={<UploadVideoForm />} />

      <Route path="/video/:videoId" element={<VideoPlayer />} />

      <Route path="/tweet" element={<UserTweets />} />
      <Route path="/all-tweet" element={<AllTweets />} />

      <Route path="/history" element={<History />} />

      <Route path="/liked-video" element={<LikedVideo />} />


      
    </Routes>
  </Router>

   
  </VideoProvider>
</UserProvider>
   
     
    </>
  )
}

export default App
