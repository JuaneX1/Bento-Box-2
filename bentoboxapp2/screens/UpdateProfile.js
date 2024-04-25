import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity,Dimensions,TextInput, Image, Pressable } from 'react-native';
import { updateProfile } from '../api/doUpdate'; // Import the updateProfile function
import { useAuth } from '../Components/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { userInfo, setUserInfo } = useAuth();
  const navigation = useNavigation();

  const handleUpdateProfile = async () => {
    // Check if any required field is empty
    if (!firstName || !lastName || !username) {
      setErrorMessage('Please fill in all required fields.');
      setSuccessMessage('');
      return;
    }

    // Prepare profile data object
    const profileData = {
      first: firstName,
      last: lastName,
      login: username,
      email: userInfo.email
    };

    // Call the updateProfile function
    const response = await updateProfile(profileData);

    // Handle response
    if (response.success) {
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
      setUserInfo(profileData);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
    } else {
      setErrorMessage(response.error);
      setSuccessMessage('');
      setTimeout(() => setErrorMessage(''), 3000); // Clear error message after 3 seconds
    }
  };

  return (
    <LinearGradient
      colors={['#111920', '#111920', '#3077b2']}
      style={styles.container}
      start={[0, 0]}
      end={[1, 1]}
    >
      <KeyboardAvoidingView style={styles.content}>
      
        <Image
          style={styles.logo}
          source={require('../assets/BB Logo Icon_COLOR.png')}
        />
        <Text style={styles.title}>Update Profile</Text>
        <TextInput
          style={[styles.input, styles.blackText]}
          placeholder={userInfo.first}
          onChangeText={setFirstName}
          value={firstName}
        />
        <TextInput
          style={[styles.input, styles.blackText]}
          placeholder={userInfo.last}
          onChangeText={setLastName}
          value={lastName}
        />
        <TextInput
          style={[styles.input, styles.blackText]}
          placeholder={userInfo.login}
          onChangeText={setUsername}
          value={username}
        />
        <Pressable
          style={styles.submitButton}
          onPress={handleUpdateProfile}
        >
          <Text style={[styles.text, {fontWeight: 'bold'}]}>Update Profile</Text>
        </Pressable>
        {successMessage ? <Text style={[styles.message, styles.success]}>{successMessage}</Text> : null}
        {errorMessage ? <Text style={[styles.message, styles.error]}>{errorMessage}</Text> : null}
      </KeyboardAvoidingView >
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
    paddingBottom: 20, // Adjust the padding to move the content down
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
    width: '100%',
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
  searchButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 28,
    height: 30,
    borderRadius: 15,
    marginLeft: 20,
    marginTop: windowHeight / 19,
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 2

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
