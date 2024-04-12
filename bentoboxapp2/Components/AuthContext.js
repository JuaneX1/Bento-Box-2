// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doLogin } from '../api/doLogin';
import { doSignUp } from '../api/doSignUp';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          console.log("yippie!yippie!");
          // If a token exists in AsyncStorage, set the authentication state
          setAuthData(token );
        }
      } catch (error) {
        console.error('Error loading authentication data:', error);
      }
    };

    loadAuthData();
  }, [authData]);

  const signIn = async (formData) => {
    // Call doLogin with form data
    const _authData = await doLogin(formData);
    console.log(_authData);
    setAuthData(_authData);
  };


  const signUp = async (formData) => {
    // Call doSignUp with form data
    console.log("Auth Context SIGN UP.js "+ formData.first +" "+formData.last + " "+formData.login +" "+formData.email+" "+formData.password);
    const _authData = await doSignUp(formData);
    console.log("auth data: "+_authData);
    setAuthData(_authData);
  };

  const logOut = async () => {
    setAuthData(undefined);
    // Clear any stored authentication data
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authData, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
