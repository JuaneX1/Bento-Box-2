import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Image, Pressable } from 'react-native';

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleUpdateProfile = () => {
    // Implement API call to update user profile
    // This function will be completed once the API endpoint is available
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/BB Logo Icon_COLOR.png')}
      />
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name*"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name*"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username*"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Email*"
        onChangeText={setEmail}
        value={email}
      />
      <Pressable
        style={styles.submitButton}
        onPress={handleUpdateProfile}
      >
        <Text style={[styles.text, {fontWeight: 'bold'}]}>Update Profile</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80, // Adjust the width as needed
    height: 80, // Adjust the height as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '80%',
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

export default UpdateProfile;
