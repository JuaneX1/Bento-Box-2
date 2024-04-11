import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios'; // Import axios for API requests

const PRODUCTION = true;
const app_name = 'bento-box-2-df32a7e90651'; // Replace with your actual app name

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(buildPath('api/forgot-password'), { email });
      // Handle successful response here
      Alert.alert('Email sent for password reset');
    } catch (error) {
      // Handle error response here
      Alert.alert('Failed to send email for password reset');
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
      <Text style={styles.text}>Forgot Password Screen</Text>
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
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
