import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions,StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo } from '../api/getUserInfo'; // Import your getUserInfo function
import DeleteAccountModal from '../Components/DeleteAccountModal'; // Import the DeleteAccountModal component
import { deleteAccount } from '../api/deleteAccount'; // Import the deleteAccount function
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const ProfileScreen = () => {
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [userI, setUser] = useState(null); // State to store user info
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State to manage visibility of delete account modal
  const { logOut } = useAuth();
  const { userInfo, setUserInfo } = useAuth();
  const navigation = useNavigation(); // Get navigation object

  useEffect(() => {
    // Fetch user info when component mounts
    const fetchUserInfo = async () => {
      try {
        
        
          const token = await AsyncStorage.getItem('token');
          const { user, error } = await getUserInfo(token);
          
          if (user) {
           
            setUserInfo(user); // Set user state with fetched user data
          } else {
            // Handle error, maybe log out the user or display an error message
            console.error('Error fetching user info x:', error);
          }
       
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [userInfo]);

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
    
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
     <LinearGradient
                colors={['transparent', 'rgba(17,25,32,0.8)', 'rgba(17,25,32,1)']}
                style={{ width: windowWidth, height: windowHeight, transform: [{ translateY: windowHeight*0.10}]}}
                start={{ x: 0.5, y: 0}}
                end={{ x: 0.5, y: 1 }}
                position="absolute"
            />
      {userInfo && (
        <Text style={styles.title}>My Profile</Text> 
      )}
      <View style ={{borderRadius:5,height:windowHeight/2.25,width: windowWidth/1.5, backgroundColor:"#111920"}}>
     
      <Text style={[tw`text-base font-bold text-white`, {padding: 5}]}>
        First Name: {`\n${userInfo?.first ?? 'Not Available'}`}
      </Text>
      <Text style={[tw`text-base font-bold text-white`, {padding: 5}]}>
        Last Name: {`\n${userInfo?.last ?? 'Not Available'}`}
      </Text>
      <Text style={[tw`text-base font-bold text-white`, {padding: 5}]}>
        Username: {`\n${userInfo?.login ?? 'Not Available'}`}
      </Text>
      <Text style={[tw`text-base font-bold text-white`, {padding: 5}]}>
        Email: {`\n${userInfo?.email ?? 'Not Available'}`}
      </Text>
      </View >
      <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      <View style={styles.buttonContainer}>
        
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.textLogOut}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[ styles.deleteButton]} onPress={() => setDeleteModalVisible(true)}>
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
    backgroundColor: '#3077b2',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    width: '100%', // Ensure it fills the width
    height: '100%', // Ensure it fills the height
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
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection:'row'
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 15,
    width:"30%",
    height:50,
    backgroundColor: '#3077b2',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#e6e7e1',
    marginRight:10
  },
  deleteButton: {
    backgroundColor: '#800000',
    marginLeft:10,
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 15,
    width:"40%",
    height:50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textLogOut:{
    color:"#111920",
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


