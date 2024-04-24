import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function doSignUp(formData) {
  const instance = axios.create({
    baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api' //'https://bento-box-2-df32a7e90651.herokuapp.com/api' 
  });



  try {
      console.log("do sign up.js " + formData.first +" "+formData.last + " "+formData.login +" "+formData.email+" "+formData.password);
      const response = await instance.post(`/register`, formData);
      const { message, token, newUser } = response.data;
      console.log(message);
      console.log(token);
      console.log(newUser);
      
      // Assuming this is the correct route      
      return {verdict: true, error: ''}

  } catch (error) {
    if(error.response){
      const errorMessage = error.response.data.error;
      
      if(error.response.status === 400){
        const passCom = error.response.data.passComplexity.toString();
        //const passComWithNewLines = passCom.replace(/,/g, "\n");
        //console.log(passComWithNewLines);
        return {verdict: false, error:  passCom};
      }
      else if (error.response.status === 401){
        //const error = response.error;
        //console.log('Unexpected response status:', error);
        return {verdict: false, error: errorMessage};
      }
      else if (error.response.status === 500){
        return {verdict: false, error: errorMessage};
      }
      else if (error.response.status === 503){
        return {verdict: false, error: errorMessage};
      }

    }
    return {verdict: false, error: error};
    // Signup failed due to error
  }
}


