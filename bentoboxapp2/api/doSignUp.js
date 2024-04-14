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
    if (response.status === 200) {
      const { message, token, newUser } = response.data;
      console.log(message);
      console.log(token);
      console.log(newUser);
       
      try{
        
        await AsyncStorage.setItem('token',token);

        return token;
      }
      catch(error){
        console.error('Unexpected Error:', error);
      }
      
     // Assuming this is the correct route
      
    } else if (response.status === 401){
      const {error} = response.data;
      console.error('Uh Oh!', error);
      // Signup failed
    }
    else if (response.status === 400){
      const {error} = response.data;
      console.error('Uh Oh!', error);
    }
    else{
      const {error} = response.data;
      console.error('Uh Oh!', error);
    }
  } catch (error) {
    console.error('Error:', error);
    // Signup failed due to error
  }
}


