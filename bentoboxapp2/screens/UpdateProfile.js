import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { updateProfile } from '../api/doUpdate'; // Import the updateProfile function

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateProfile = async () => {
    // Check if any required field is empty
    if (!firstName || !lastName || !username || !email) {
      setErrorMessage('Please fill in all required fields.');
      setSuccessMessage('');
      return;
    }

    // Prepare profile data object
    const profileData = {
      first: firstName,
      last: lastName,
      login: username,
      email: email
    };

    // Call the updateProfile function
    const response = await updateProfile(profileData);

    // Handle response
    if (response.success) {
      setSuccessMessage('Profile updated successfully. Please relog in to see changes.');
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } else {
      setErrorMessage(response.error);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/BB Logo Icon_COLOR.png')}
      />
      <Text style={styles.title}>Update Profile</Text>
      <TextInput
        style={[styles.input, styles.blackText]}
        placeholder="First Name*"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={[styles.input, styles.blackText]}
        placeholder="Last Name*"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        style={[styles.input, styles.blackText]}
        placeholder="Username*"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={[styles.input, styles.blackText]}
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
      {successMessage ? <Text style={[styles.message, styles.success]}>{successMessage}</Text> : null}
      {errorMessage ? <Text style={[styles.message, styles.error]}>{errorMessage}</Text> : null}
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
    width: 80,
    height: 80,
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
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#3077b2',
  },
  blackText: {
    color: '#000',
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
  message: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  success: {
    color: 'green',
  },
  error: {
    color: 'red',
  },
});

export default UpdateProfile;
