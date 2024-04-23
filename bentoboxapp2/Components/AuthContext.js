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


  const signUp = async (formData) => {
    // Call doSignUp with form data
   //console.log("Auth Context SIGN UP.js "+ formData.first +" "+formData.last + " "+formData.login +" "+formData.email+" "+formData.password);
    //const _authData = await doSignUp(formData);
    //console.log("auth data: "+_authData);
    //setAuthData(_authData);
  };

  const logOut = async () => {
    setAuthData(undefined);
    // Clear any stored authentication data
    await AsyncStorage.removeItem('user_');
  };

  return (
    <AuthContext.Provider value={{ authData, signIn, signUp, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
