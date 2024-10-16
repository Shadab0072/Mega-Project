// import React, { useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// export const AuthContext = React.createContext();

// export const AuthProvider = ({ children }) => {

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
  
//   console.log("AuthProvider",isAuthenticated);

// //   useEffect(() => {
// //     const accessToken = localStorage.getItem('accessToken') || Cookies.get('accessToken');

// //     if (accessToken) {
// //         setIsAuthenticated(true)
// //     } else {
// //         setIsAuthenticated(false)
// //     }

// //   }, [isAuthenticated]);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );

// };















//       //   const login = (token) => {
//       //     localStorage.setItem('accessToken', token); // Store the token
//       //     Cookies.set('accessToken', token); // Store the token in cookies
//       //     setIsAuthenticated(true); // Update the state to true
//       //   };
      
//       //   const logout = () => {
//       //     localStorage.removeItem('accessToken'); // Remove token
//       //     Cookies.remove('accessToken'); // Remove token from cookies
//       //     setIsAuthenticated(false); // Update the state to false
//       //   };