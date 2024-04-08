// doSignUp.js
import axios from 'axios';

async function doSignUp(formData) {
  try {
    const response = await axios.post('https://bento-box-3-c00801a6c9a4.herokuapp.com/api/register', formData);

    const { message, newUser } = response.data;
    if (message === "User registration email sent" && newUser && newUser._id) {
      return true; // Signup successful
    } else {
      console.error('Unexpected response from server:', response.data);
      return false; // Signup failed
    }
  } catch (error) {
    console.error('Error:', error);
    return false; // Signup failed due to error
  }
}

export default doSignUp;
