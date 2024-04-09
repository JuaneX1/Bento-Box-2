import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function doSignUp(formData) {
  const instance = axios.create({
    //'http://localhost:5000/api https://bento-box-3-c00801a6c9a4.herokuapp.com/api',
    baseURL: 'https://bento-box-3-c00801a6c9a4.herokuapp.com/api' 
  });

  try {
    const response = await instance.post(`/register`, formData);
    
    if (response.status === 200) {

      const { message, token, newUser } = response.data;
      console.log("skbfaskjdnaskj");
      console.log(message);
      console.log(token);
      console.log(token.token);
      console.log(newUser);
       // Assuming the server responds with a token
      
      await AsyncStorage.setItem('token',token.token);
      return token;
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


