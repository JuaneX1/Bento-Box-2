import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, Pressable, Image } from 'react-native';
import axios from 'axios';

const PRODUCTION = true;
const app_name = 'bento-box-2-df32a7e90651';

export default function ChangePassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      const response = await axios.post(buildPath('api/resetPassword/' + token), { password: newPassword });
      // Handle successful response here
      Alert.alert('Password Changed', 'Your password has been successfully changed.');
    } catch (error) {
      // Handle error response here
      Alert.alert('Failed to Change Password', 'Failed to change your password. Please try again later.');
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
      <Image
        style={styles.image}
        source={require('../assets/BB Logo Icon_COLOR.png')}
      />
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>Enter your email and current password, then your new password:</Text>
      <TextInput
        placeholder="Enter your email*"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter your current password*"
        onChangeText={setPassword}
        value={password}
        style={styles.input}
        secureTextEntry={true}
      />
      <TextInput
        placeholder="Enter your new password*"
        onChangeText={setNewPassword}
        value={newPassword}
        style={styles.input}
        secureTextEntry={true}
      />
      <Pressable
        style={styles.submitButton}
        onPress={handleChangePassword}
      >
        <Text style={[styles.text, {fontWeight: 'bold'}]}>Change Password</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111920',
    paddingHorizontal: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 20, // Set border radius to create bubble-like appearance
    color: '#fff',
    backgroundColor: '#ffffff', // Set background color to white
    borderWidth: 2, // Add border width
    borderColor: '#3077b2', // Set border color
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
    color: 'white'
  }
});
