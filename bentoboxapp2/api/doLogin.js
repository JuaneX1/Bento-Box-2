import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';

const PRODUCTION = true;

export async function doLogin(formData) {
  // State for error handling

  //'http://localhost:5000/api',
  const instance = axios.create({
    baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
  });

  if (formData.login && formData.password ) {
    try {
      // Use await to wait for response from API call
      console.log("do login.js " + formData.login +" "+formData.password);
      const response = await instance.post(`/login`, formData);

        const { token } = response.data;
        
        // Assuming the server responds with a token
        await AsyncStorage.setItem('token', token);
        console.log('woooo!');
        return {token: token, error: ''};

    } catch (error) {
      if(error.response){
        const errorMessage = error.response.data.error;
        if(error.response.status === 401){
          
          return {token: null, error: errorMessage};
        }
        else if (error.response.status === 402){
          
          //console.log('Unexpected response status:', error);
          return {token: null, error: errorMessage};
        }
        else if (error.response.status === 500){
          return {token: null, error: errorMessage};
        }
        
      }
      return {token: null, error: error};
      // Handle network errors or other exceptions
      //setError('Network error or other issue. Please try again.');
    }
  } else {
    return {token: null, error: 'Invalid Input. Please make sure all fields are complete.'};
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
