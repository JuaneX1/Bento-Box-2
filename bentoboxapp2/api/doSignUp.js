import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

async function doSignUp(formData) {
  const instance = axios.create({
    baseURL: 'https://bento-box-3-c00801a6c9a4.herokuapp.com/api',
  });

  try {
    const response = await instance.post(`/register`, formData);
    console.log(formData);
    const { message, token } = response.data;
    console.log(message); // Extract token from response
    console.log(token);
    if (response.status === 200) {
      const { token } = response.data; // Assuming the server responds with a token
      await AsyncStorage.setItem('token', token);
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

export default doSignUp;
