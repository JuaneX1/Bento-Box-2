import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';

const PRODUCTION = true;

export async function getFavorites(token, ID) {
  // State for error handling

  //'http://localhost:5000/api',
  const instance = axios.create({
    baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
  });

  if (token != null) {
    try {
      
      // Use await to wait for response from API call
      const userResponse = await instance.get(`/getFavorite`,  {
       
        headers: {
          Authorization: `${token}`
        },
        _id:ID,
      });
        
        const  f  = userResponse.data;

        return {favorite: f, error: ''};

    } catch (error) {
      if(error.response){
        const errorMessage = error.response.data.error;
        if(error.response.status === 404){
          
          return {favorite: null, error: errorMessage};
        }
        else if (error.response.status === 500){
          return {favorite: null, error: errorMessage};
        }
      }
      return {favorite: null,error: error};
      // Handle network errors or other exceptions
      //setError('Network error or other issue. Please try again.');
    }
  } else {
    return {favorite: null, error: 'Invalid Input. Please make sure all fields are complete.'};
  }
}

