import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import doSignUp from '../api/doSignUp';
import { useAuth } from '../Components/AuthContext';
export default function SignUp() {
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    login: '',
    email: '',
    password: ''
  });

  const { signUp } = useAuth();

  const handleSignUp = async () => {
    try {
      // Check if any field is empty
      if (!formData.first || !formData.last || !formData.login || !formData.email || !formData.password) {
       console.log("Sign up.js "+ formData.first +" "+formData.last + " "+formData.login +" "+formData.email+" "+formData.password);
        Alert.alert('All fields are required');
        return;
      }
  
      // Perform signup
      const success = signUp(formData);
  
      if (success != null) {
        // Display success message
        Alert.alert(
          'Sign Up Successful',
          'Please check your email for the confirmation link. After confirming your email, you can proceed to sign in.'
        );
  
        // Clear form fields
        setFormData({
          first: '',
          last: '',
          login: '',
          email: '',
          password: ''
        });
      } else {
        Alert.alert('Registration failed', 'An error occurred during signup.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Registration failed', 'An error occurred');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.inputTitle}>First Name</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name*"
        onChangeText={(text) => setFormData({...formData, first: text})}
      />

      <Text style={styles.inputTitle}>Last Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Last Name*"
        onChangeText={(text) => setFormData({...formData, last: text})}
      />

      <Text style={styles.inputTitle}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Username*"
        onChangeText={(text) => setFormData({...formData, login: text})}
      />

      <Text style={styles.inputTitle}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address*"
        onChangeText={(text) => setFormData({...formData, email: text})}
      />

      <Text style={styles.inputTitle}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password*"
        secureTextEntry={true}
        onChangeText={(text) => setFormData({...formData, password: text})}
      />

      <Pressable
        style={styles.submitButton}
        onPress={handleSignUp}
      >
        <Text style={styles.text}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start'
  },
  container: {
    marginTop: 10,
    color: '#111920',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    marginVertical: 8,
    borderWidth: 2,
    width: 300,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    borderColor: '#3077b2'
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
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
