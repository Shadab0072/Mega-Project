// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const ProtectedRoute = ({ children }) => {

  const accessToken = localStorage.getItem('accessToken') || Cookies.get('accessToken');
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return children; // Return the protected content
};

export default ProtectedRoute;
