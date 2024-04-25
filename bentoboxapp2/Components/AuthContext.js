// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';  // Import axios
import { doLogin } from '../api/doLogin';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [favorite, setFavorite] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  // Create the Axios instance with the base URL to your API
  const axiosInstance = axios.create({
    baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
  });

  // Configure global response interceptor
  useEffect(() => {
    const responseInterceptor = axiosInstance.interceptors.response.use(
      response => response,
      async (error) => {
        if (error.response && error.response.status === 403) {
          console.error('403 Forbidden error detected. Logging out...');
          await logOut();  // Automatically log out on 403 error
        }
        return Promise.reject(error);
      }
    );

    // Cleanup the interceptor when component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const user = await AsyncStorage.getItem('user_');
        if (user) {
          console.log("Loaded user data!");
          setAuthData(user);
        }
      } catch (error) {
        console.error('Error loading authentication data:', error);
      }
    };

    loadAuthData();
  }, []);

  const signIn = async (formData) => {
    console.log("form data "+formData);
    const _authData = formData
    console.log(_authData);
    await AsyncStorage.setItem('user_', JSON.stringify(_authData));
    console.log(_authData);
    setAuthData(_authData);
  };

  const logOut = async () => {
    console.log("Logging out...");
    setAuthData(null);
    setFavorite([]);
    setUserInfo(null);
    await AsyncStorage.removeItem('user_');
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authData, userInfo, setUserInfo, favorite, setFavorite, signIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
