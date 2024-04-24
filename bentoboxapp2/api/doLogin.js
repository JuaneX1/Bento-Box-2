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
      
        const response = await instance.post(`/login`, formData);

       

        console.log(response.data.token);
        // Assuming the server responds with a token
        await AsyncStorage.setItem('token', response.data.token);


        return {token: response.data.token, error: ''};

    } catch (error) {
      if(error.response){

        const errorMessage = error.response.data;

        if(error.response.status === 401){
          console.log('401!');
          return {token: null,  error: "Incorrect Username or Password"};
        }
        else if (error.response.status === 402){
          console.log('402');
          //console.log('Unexpected response status:', error);
          return {token: null, error: errorMessage};
        }
        else if (error.response.status === 404){
          console.log('404!');
          //console.log('Unexpected response status:', error);
          return {token: null, error: 'api not found'};
        }
        else if (error.response.status === 500){
          console.log('500!');
          return {token: null, error: "Internal Server Error"};
        }
      }
      console.log('unkown!');
      console.log(error.message);
      return {token: null, error: error};
      // Handle network errors or other exceptions
      //setError('Network error or other issue. Please try again.');
    }
  } else {
    return {token: null, user: null, error: 'Invalid Input. Please make sure all fields are complete.'};
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
