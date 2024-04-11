import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function doSignUp(formData) {
  const instance = axios.create({
    //'http://localhost:5000/api https://bento-box-3-c00801a6c9a4.herokuapp.com/api',
    baseURL: 'https://bento-box-2-df32a7e90651.herokuapp.com/api' //'https://bento-box-2-df32a7e90651.herokuapp.com/api' 
  });

  try {
    console.log("do sign up.js " + formData.first +" "+formData.last + " "+formData.login +" "+formData.email+" "+formData.password);
    const response = await instance.post(`/register`, formData);
    console.log("skbfaskjdnaskj");
    const { message, token, newUser } = response.data;
    if (message === "User registration email sent" && newUser) {
      
      //const { message, token, newUser } = response.data;
     // console.log("skbfaskjdnaskj");
      //console.log(message);
      console.log(token);
      //console.log(newUser);
       // Assuming the server responds with a token
      try{
        await instance.post(`/verify/${token}`);
        await AsyncStorage.setItem('token',token);
        return token;
      }
      catch(error){
        console.error('Unexpected Error:', error);
      }
      
     // Assuming this is the correct route
      
    } else {
      console.error('Unexpected response from server:', response.data);
      // Signup failed
    }
  } catch (error) {
    console.error('Error:', error);
    // Signup failed due to error
  }
}


