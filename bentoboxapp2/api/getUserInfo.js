import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';

const PRODUCTION = true;

export async function getUserInfo(token) {
  // State for error handling

  //'http://localhost:5000/api',
  const instance = axios.create({
    baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
  });

  if (token != null) {
    try {
      // Use await to wait for response from API call
      const userResponse = await instance.get(`/info`,  {
        headers: {
          Authorization: `${token}`
        }
      });
        
        const  user  = userResponse.data;
    
        
        // Assuming the server responds with a token
        //await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem(`userinfo_${user._id}`, JSON.stringify(user._id));
        
        return {user: user, error: ''};

    } catch (error) {
      if(error.response){
        const errorMessage = error.response.data.error;
        if(error.response.status === 401){
          
          return {user:null, error: errorMessage};
        }
        else if (error.response.status === 402){
          
          //console.log('Unexpected response status:', error);
          return {user:null, error: errorMessage};
        }
        else if (error.response.status === 500){
          return {user:null, error: errorMessage};
        }
      }
      return {user:null,error: error};
      // Handle network errors or other exceptions
      //setError('Network error or other issue. Please try again.');
    }
  } else {
    return {user, error: 'Invalid Input. Please make sure all fields are complete.'};
  }
}

