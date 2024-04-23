import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo } from '../api/getUserInfo'; // Import your getUserInfo function
import DeleteAccountModal from '../Components/DeleteAccountModal'; // Import the DeleteAccountModal component
import { deleteAccount } from '../api/deleteAccount'; // Import the deleteAccount function


const ProfileScreen = () => {
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [userI, setUser] = useState(null); // State to store user info
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State to manage visibility of delete account modal
  const { logOut } = useAuth();
  const navigation = useNavigation(); // Get navigation object

  useEffect(() => {
    // Fetch user info when component mounts
    const fetchUserInfo = async (userI) => {
      try {
        const token = await AsyncStorage.getItem('token');
        const { user, error } = await getUserInfo(token);

        if (user) {
          setUser(user); // Set user state with fetched user data
        } else {
          // Handle error, maybe log out the user or display an error message
          console.error('Error fetching user info:', error.response.data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error.response.data);
      }
    };
    fetchUserInfo(userI);
  }, [userI]);

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
    
  };

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleLogout = async () => {
    try {
      await logOut();
      // Navigate to the login screen after logging out
      //navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { success, error } = await deleteAccount();
      if (success) {
        // Account deleted successfully
        await logOut();
        //navigation.navigate('Login');
      } else {
        // Error deleting account
        console.error('Error deleting account:', error);
        // Optionally display an error message to the user
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      // Handle any unexpected errors
      // Optionally display an error message to the user
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/BB Logo Icon_COLOR.png')} />
      {userI && (
        <Text style={styles.title}>Welcome {userI.login} to your profile!</Text> 
      )}
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
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setDeleteModalVisible(true)}>
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
      {/* Delete Account Modal */}
      <DeleteAccountModal
        isVisible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onDelete={handleDeleteAccount}
      />
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


