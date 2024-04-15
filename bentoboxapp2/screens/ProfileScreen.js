import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Components/AuthContext';
import axios from 'axios'; // Import axios for API requests

const PRODUCTION = true;
const app_name = 'bento-box-2-df32a7e90651'; // Replace with your actual app name

const ProfileScreen = () => {
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
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

  const handleDeleteAccount = () => {
    setConfirmDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      const response = await axios.delete(buildPath('api/deleteUser'));
      // Handle successful response here
      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      logOut(); // Log out the user after successful deletion
    } catch (error) {
      // Handle error response here
      Alert.alert('Failed to Delete Account', 'Failed to delete your account. Please try again later.');
      console.error(error);
    }
  };

  const buildPath = (route) => {
    if (PRODUCTION) {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to your profile!</Text>
      <View style={styles.buttonContainer}>
        <Button title="Update Profile" onPress={handleUpdateProfile} />
        <Button title="Change Password" onPress={handleChangePassword} />
        <Button title="Logout" onPress={handleLogout} />
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      {/* Confirm Delete Account Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDeleteModalVisible}
        onRequestClose={() => setConfirmDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete your account?</Text>
            <TextInput
              style={styles.input}
              placeholder="Type 'DELETE' to confirm"
              onChangeText={setConfirmationText}
              value={confirmationText}
            />
            <Button title="Confirm" onPress={confirmDeleteAccount} />
            <Button title="Cancel" onPress={() => setConfirmDeleteModalVisible(false)} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 20,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FF0000',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
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
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default ProfileScreen;
