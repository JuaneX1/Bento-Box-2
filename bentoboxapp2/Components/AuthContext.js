// AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doLogin } from '../api/doLogin';
import { doSignUp } from '../api/doSignUp';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState();

  const signIn = async (formData) => {
    // Call doLogin with form data
    const _authData = await doLogin(formData);
    console.log(_authData);
    setAuthData(_authData);
  };


  const signUp = async (formData) => {
    // Call doSignUp with form data
    const _authData = await doSignUp(formData);
    
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
