import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { doSignUp } from '../api/doSignUp';
import {Dimensions} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUp() {
  const navigation = useNavigation()

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignUp = async () => {
    try {
      if (!firstName || !lastName || !username || !email || !password) {
        Alert.alert('All fields are required');
        return;
      }
      
      const { success, error, data } = await doSignUp(firstName, lastName, username, email, password);

      if (success) {
        Alert.alert('Registration successful');
        // Navigate to login screen or perform any other action
        navigation.navigate('Home');
      } else {
        Alert.alert('Registration failed', error);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Registration failed', 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>

      <Text style= {styles.inputTitle}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name*"
        onChangeText={setFirstName}
      />

      <Text style= {styles.inputTitle}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name*"
        onChangeText={setLastName}
      />

      <Text style= {styles.inputTitle}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username*"
        onChangeText={setUsername}
      />

      <Text style= {styles.inputTitle}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address*"
        onChangeText={setEmail}
      />

      <Text style= {styles.inputTitle}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password*"
        secureTextEntry={true}
        onChangeText={setPassword}
      />

      <Pressable
        style={styles.submitButton}
        onPress={handleSignUp}
      >
        <Text style={styles.text}>Sign Up</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  inputTitle:{
    color:"#fff",
    fontSize:12,
    fontWeight:'bold',
    alignSelf:'flex-start'
  },
  container: {
    marginTop:10,
    color: '#111920',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: windowHeight/19,
    marginVertical: 8,
    borderWidth: 2,
    width: 300,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor:"#ffffff",
    borderColor:'#3077b2'
  },
  image: {
    width: 105,
    height: 110,
    marginVertical: 20,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
    elevation: 3, 
    backgroundColor: '#3077b2',
    marginTop: 10,
  },
  text:{
    color:'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
