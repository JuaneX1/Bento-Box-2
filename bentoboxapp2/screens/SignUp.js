import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Modal, Dimensions, Animated } from 'react-native';
import {doSignUp} from '../api/doSignUp';
import { useAuth } from '../Components/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUp() {

  const [formData, setFormData] = useState({
    first: '',
    last: '',
    login: '',
    email: '',
    password: ''
  });

  const [successModalVisible, setSuccessModalVisible] = useState(false); // State for success modal
  const [errorModalVisible, setErrorModalVisible] = useState(false); // State for error modal
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  const fadeInDuration = 250; // Duration for fade in animation
  const fadeAnim = new Animated.Value(0); // Initial value for fade animation

  useEffect(() => {
    if (successModalVisible || errorModalVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: fadeInDuration,
        useNativeDriver: true,
      }).start();
    } else {
      // Reset the opacity to 0 when the modal is closed
      fadeAnim.setValue(0);
    }
  }, [successModalVisible, errorModalVisible]);

  const handleSignUp = async () => {
    try {
      // Check if any field is empty
      if (!formData.first || !formData.last || !formData.login || !formData.email || !formData.password) {
        console.log("Sign up.js "+ formData.first +" "+formData.last + " "+formData.login +" "+formData.email+" "+formData.password);
        setErrorModalVisible(true);
        setErrorMessage('All fields are required');
        return;
      }
  
      // Perform signup
      const results = await doSignUp(formData);
      
      console.log(results.verdict);

      if (results.verdict) {
        // Display success message
        // Display success modal
        setSuccessModalVisible(results.verdict);
        
        console.log("true! "+successModalVisible);
        // Clear form fields
        setFormData({
          first: '',
          last: '',
          login: '',
          email: '',
          password: ''
        });
      } else {
        setErrorModalVisible(true);
        setErrorMessage(results.error.message);
      }
    } catch (error) {
      console.error(error);
      setErrorModalVisible(true);
      setErrorMessage('An error occurred');
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

      {/* Success Modal */}
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={{backgroundColor:'rgba(0,0,0,0.5)', flex:1,display:'flex',height:windowHeight, width: windowWidth }}>
        <View style={styles.modalView}>
        <AntDesign name="checkcircle" size={48} color="green" />
          <Text style={styles.modalText}>Sign Up Successful!</Text>
          <Text style={styles.modalText}>Please check your email for the confirmation link. After confirming your email, you can proceed to sign in.</Text>
          <Pressable
            style={styles.modalButton}
            onPress={() => setSuccessModalVisible(false)}
          >
            <Text style={styles.modalButtonText}>Close</Text>
          </Pressable>
        </View>
        </View >
      </Modal>

      {/* Error Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View  style={{backgroundColor:'rgba(0,0,0,0.5)', flex:1,display:'flex',height:windowWidth, width:windowWidth }}>
          <View style={styles.modalView}>
              <MaterialIcons name="error" size={48} color="red" />
              <Text style={styles.modalText}>Registration Failed</Text>
              <Text style={styles.modalText}>{errorMessage}</Text>
              <Pressable
                style={styles.modalButton}
                onPress={() => setErrorModalVisible(false)}
              >
              <Text style={styles.modalButtonText}>Close</Text>
              </Pressable>
          </View>
        </View >
      </Modal>

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
  },
  modalView: {
    margin: 20,
    transform: [{translateY: windowHeight / 3}],
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    borderColor:'red',
    alignItems:'center',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalButton: {
    backgroundColor: "#3077b2",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
