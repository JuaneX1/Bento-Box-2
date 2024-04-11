import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Image } from 'react-native';
import axios from 'axios'; // Import axios for API requests

const PRODUCTION = true;
const app_name = 'bento-box-2-df32a7e90651'; // Replace with your actual app name

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(buildPath('api/forgotPassword'), { email });
      // Handle successful response here
      Alert.alert('Password Reset Email Sent', 'An email with instructions to reset your password has been sent to your email address.');
    } catch (error) {
      // Handle error response here
      Alert.alert('Failed to Send Email', 'Failed to send the email for password reset. Please try again later.');
      console.error(error);
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
      <View style={styles.logoContainer}>
        <Image
        style={styles.image}
         source={require('../assets/BB Logo Icon_COLOR.png')}
        />
      </View>
      <Text style={styles.text}>Enter your email address below to reset your password:</Text>
      <TextInput
        placeholder="Enter your email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <Button title="Reset Password" onPress={handleForgotPassword} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111920', // Match the background color of your other screens
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30, // Adjust as needed to reduce whitespace
  },
  image: {
    width: 100, // Adjust the size of the logo as needed
    height: 100,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text color to match your other screens
    textAlign: 'center',
    marginBottom: 20, // Add some margin for better spacing
  },
  input: {
    width: '80%',
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: '#fff', // White border color to match your other screens
    borderWidth: 1,
    borderRadius: 5, // Add border radius for better appearance
    color: '#fff', // White text color to match your other screens
  },
});
