import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create User Context
const UserContext = createContext();

// Create a provider component
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store current user data

  // Function to fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/users/current-user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Check if the request was successful
      if (response.data.success) {
        const { data } = response.data; // Ensure correct destructuring
        setUser(data); // Store user data in state
      } else {
        setUser(null); // Set user to null if not successful
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null); // Set to null in case of error
    }
  };

  // Fetch user data initially on component mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, fetchUser: fetchCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export UserContext and UserProvider
export { UserContext, UserProvider };
