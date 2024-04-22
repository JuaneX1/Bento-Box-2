import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';

const PRODUCTION = true;

export async function addFavorites(token, ID) {
  // State for error handling

  //'http://localhost:5000/api',
  const instance = axios.create({
    baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api'
  });

  if (token != null) {
    try {
      // Use await to wait for response from API call
      const result = await instance.post(`/addFavorite`, {
        mal_id: JSON.stringify(ID) // Assuming 'ID' is the ID you want to send as mal_id
      }, {
        headers: {
          Authorization: `${token}`
        }
      });
        
        const  r  = result.data;
    
        console.log(r.message);

        // Assuming the server responds with a token

        return {verdict: true, error: ''};

    } catch (error) {
      if(error.response){
        const errorMessage = error.response.data.error;
        if(error.response.status === 404){
          
          return {verdict: false, error: errorMessage};
        }
        else if (error.response.status === 500){
          return {verdict: false, error: errorMessage};
        }
      }
      return {verdict: false, error: error.response.data.message};
      // Handle network errors or other exceptions
      //setError('Network error or other issue. Please try again.');
    }
  } else {
    return {verdict: false, error: 'Invalid Input. Please make sure all fields are complete.'};
  }
}

