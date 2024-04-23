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

      if(users == null || users[0] == null){
        setAuthData(null);
      }
      else{
        setAuthData(users[0]._id); 
      }
      
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
    const keys = await AsyncStorage.getAllKeys();
    const userKeys = keys.filter(key => key.startsWith('user_'));
    const userData = await AsyncStorage.multiGet(userKeys);
    const users = userData.map(([key, value]) => JSON.parse(value));
    await AsyncStorage.removeItem(`user_${users[0]._id}`);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ authData, signIn,logOut }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => useContext(AuthContext);
