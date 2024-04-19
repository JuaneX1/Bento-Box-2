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
      const keys = await AsyncStorage.getAllKeys();
      const userKeys = keys.filter(key => key.startsWith('user_'));
      const userData = await AsyncStorage.multiGet(userKeys);
      const users = userData.map(([key, value]) => JSON.parse(value));
      setAuthData(users[0]._id); 
    };

    loadAuthData();
  }, []);

  const signIn = async (userInfo) => {
    // Call doLogin with form data
    //const _authData = token;
    const _user = userInfo; //await doLogin(formData);
    setAuthData(_user);
    //setUser(_user);
  };

  const logOut = async () => {
    setAuthData(undefined);
  };

  return (
    <AuthContext.Provider value={{ authData, signIn,logOut }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
