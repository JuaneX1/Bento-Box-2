// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doLogin } from '../api/doLogin';
import { doSignUp } from '../api/doSignUp';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [favorite, setFavorite] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const user = await AsyncStorage.getItem('user_');
        if (user) {
          console.log("yippie!yippie!");
          // If a token exists in AsyncStorage, set the authentication state
          setAuthData(user );
        }
      } catch (error) {
        console.error('Error loading authentication data:', error);
      }
    };

    loadAuthData();
  }, []);

  const signIn = async (formData) => {
    // Call doLogin with form data
    const _authData = formData; //await doLogin(formData);
    await AsyncStorage.setItem('user_', formData);
    console.log(_authData);
    setAuthData(_authData);
  };

  const logOut = async () => {
    setAuthData(undefined);
    setUserInfo(undefined);
    // Clear any stored authentication data
    await AsyncStorage.removeItem('user_');
  };

  const getInfo= async()=>{

  };

  return (
    <AuthContext.Provider value={{ authData, userInfo, setUserInfo, favorite, setFavorite, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
