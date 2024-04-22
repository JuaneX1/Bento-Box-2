import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Alert } from 'react-native';
import { changePassword } from '../api/doChangePassword'; // Import the changePassword function


export default function ChangePassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    try {
      const token = ''; // Assuming you have the token
      const response = await changePassword(email, password, newPassword, token);
      
      // Handle response from the changePassword function
      if (response.success) {
        Alert.alert('Password Changed', 'Your password has been successfully changed.');
      } else {
        Alert.alert('Failed to Change Password', response.error);
      }
    } catch (error) {
      // Handle error response here
      Alert.alert('Failed to Change Password', 'Failed to change your password. Please try again later.');
      console.error(error);
    }
  };

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
        style={[styles.input, styles.blackText]} // Add styles.blackText to make text black
      />
      <TextInput
        placeholder="Enter your current password*"
        onChangeText={setPassword}
        value={password}
        style={[styles.input, styles.blackText]} // Add styles.blackText to make text black
        secureTextEntry={true}
      />
      <TextInput
        placeholder="Enter your new password*"
        onChangeText={setNewPassword}
        value={newPassword}
        style={[styles.input, styles.blackText]} // Add styles.blackText to make text black
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
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3077b2',
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
  },
  blackText: {
    color: '#000', // Set text color to black
  },
});
