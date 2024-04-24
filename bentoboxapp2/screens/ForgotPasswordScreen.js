import React, { useState } from 'react';
import { View, Text, Dimensions,StyleSheet, TextInput, Button, Alert, Pressable, Image } from 'react-native';
import axios from 'axios'; // Import axios for API requests
import { LinearGradient } from 'expo-linear-gradient';
const PRODUCTION = true;
const app_name = 'bento-box-2-df32a7e90651'; // Replace with your actual app name

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage]= useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(buildPath('api/forgotPassword'), { email });
      // Handle successful response here
      setSuccessMessage('Password Reset Email Sent', 'An email with instructions to reset your password has been sent to your email address.');
      setTimeout(() => setSuccessMessage(''), 9000);
    } catch (error) {
      // Handle error response here
      setErrorMessage('Failed to Send Email', 'Failed to send the email for password reset. Please try again later.');
      setTimeout(() => setErrorMessage(''), 9000);
      //console.error(error);
    }
  };

  function buildPath(route) {
    if (PRODUCTION) {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient
              colors={['transparent', 'rgba(48, 119, 178, 0.5)', 'rgba(48, 119, 178, 1)']}
              style={{ width: windowWidth, height: windowHeight*0.55, transform: [{ translateY: windowHeight*0.30}]}}
              start={{ x: 0.5, y: 0}}
              end={{ x: 0.5, y: 1 }}
              position="absolute"
          />
      <Image 
        style={styles.image}
        source={require('../assets/LOGO/Logo w Red Tagline/BB Logo Vertical_COLOR 1.png')}
      />
     
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your email address below to reset your password:</Text>
      {errorMessage ? (
                      <Text style={styles.errorText}>{errorMessage}</Text>
                             ): (null)}
      {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
            ): (null)}
      <TextInput
        placeholder="Enter your email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <Pressable
        style={styles.submitButton}
        onPress={handleForgotPassword}
      >
        <Text style={[styles.text, {fontWeight: 'bold', color: '#fff'}]}>Reset Password</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111920', // Match the background color of your other screens
    paddingHorizontal: 20,
  },
  image: {
    width: 200, // Adjust the size of the logo as needed
    height: 206,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // White text color to match your other screens
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff', // White text color to match your other screens
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20, // Set border radius to create bubble-like appearance
    color: '#000', // Black text color
    backgroundColor: '#ffffff', // Set background color to white
    borderWidth: 2, // Add border width
    borderColor: '#3077b2', // Set border color
  },
  errorText:{
    color:'red',
    fontWeight:'700'
  },
  successText:{
    color:'green',
    fontWeight:'700'
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 3,
    backgroundColor: '#3077b2',
  },
  text: {
    color: '#000' // Black text color
  }
});
