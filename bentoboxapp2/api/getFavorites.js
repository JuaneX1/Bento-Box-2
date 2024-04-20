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
          Authorization: await AsyncStorage.getItem('token')
        }
      });
        
        const  f  = userResponse.data;

        //console.log(JSON.stringify(f, null, 2));

        return {favorite: f, error: 'dsfs'};

    } catch (error) {
      if(error.response){
        console.log("favs error");
        const errorMessage = error.response.data.error;
        console.log(error.response.data.message);
        console.log(error.response.data);
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
    return {favorite: null, error: 'token null'};
  }
}

