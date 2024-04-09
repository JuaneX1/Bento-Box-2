import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';

const PRODUCTION = true;

export async function doLogin(formData) {
  // State for error handling

  //'http://localhost:5000/api',
  const instance = axios.create({
    baseURL: 'https://bento-box-3-c00801a6c9a4.herokuapp.com/api'
  });

  if (formData.email !== null || formData.password !== null) {
    try {
      // Use await to wait for response from API call
      const response = await instance.post(`/login`, formData);

      // Handle successful login
      if (response.status === 200) {
        const { token } = response.data; // Assuming the server responds with a token
        await AsyncStorage.setItem('token', token);
        return token;
       console.log('oou oou ouu!'); // Assuming this is the correct route
        
      } else {
        console.log('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors or other exceptions
      setError('Network error or other issue. Please try again.');
    }
  } else {
    console.log("Invalid input");
  }
}
function buildPath(route)
{
    //const app_name = 'bento-box-mobile-c040aef8aea0'
    //const app_name = 'bento-box-2-df32a7e90651'
    const app_name = 'bento-box-3-c00801a6c9a4'
    
    // builds path if we local or if we are on heroku

    if (PRODUCTION)
    {
        console.log('production')
        return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else
    {
        console.log('local')
        return 'http://localhost:5000/' + route;
    }
}
