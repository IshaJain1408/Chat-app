import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const [id, setId] = useState(null);

  const contextValue = {
    loggedInUsername,
    setLoggedInUsername,
    id,
    setId,
  };
  useEffect(()=>{
    axios.get('/profile').then(response =>{
        setId(response.data.userId);
        setLoggedInUsername(response.data.loggedInUsername)
    })
  },[])

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
