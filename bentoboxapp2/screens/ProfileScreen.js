import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Components/AuthContext';
import axios from 'axios';

const ProfileScreen = () => {
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const { logOut } = useAuth();
  const navigation = useNavigation(); // Get navigation object

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile'); // Navigate to UpdateProfileScreen
  };
  
  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleLogout = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
      { text: 'OK', onPress: logOut },
    ]);
  };

  const handleDeleteAccount = async () => {
    const userInput = await promptForInput('Type "DELETE" to confirm deletion:');
    if (userInput === 'DELETE') {
      try {
        const response = await axios.delete('https://your-api-url/api/deleteUser', {
          headers: {
            Authorization: 'Bearer ' + YOUR_AUTH_TOKEN // Replace with your actual authentication token
          }
        });
        Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
        // Implement navigation to login screen or any other appropriate screen after account deletion
      } catch (error) {
        Alert.alert('Failed to Delete Account', 'Failed to delete your account. Please try again later.');
        console.error(error);
      }
    } else {
      Alert.alert('Account Deletion Cancelled', 'Your account has not been deleted.');
    }
  };
  
  const promptForInput = (message) => {
    return new Promise(resolve => {
      Alert.prompt(
        'Confirmation',
        message,
        [
          {
            text: 'Cancel',
            onPress: () => resolve(null),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: (input) => resolve(input),
          },
        ],
        'plain-text'
      );
    });
  };
  

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/BB Logo Icon_COLOR.png')} />
      <Text style={styles.title}>Welcome to your profile!</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editProfileModalVisible}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        {/* Implement Edit Profile Modal UI */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Add UI elements for editing profile */}
          </View>
        </View>
      </Modal>
      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={changePasswordModalVisible}
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        {/* Implement Change Password Modal UI */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Add UI elements for changing password */}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111920',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: '#3077b2',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF0000',
  },
  deleteButton: {
    backgroundColor: '#FF0000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
});

export default ProfileScreen;
