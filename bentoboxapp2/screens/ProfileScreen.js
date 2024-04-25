import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Components/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo } from '../api/getUserInfo';
import DeleteAccountModal from '../Components/DeleteAccountModal';
import { deleteAccount } from '../api/deleteAccount';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons'; // Import anime emojis from FontAwesome5
import tw from 'twrnc';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ProfileScreen = () => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { logOut, userInfo, setUserInfo } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
          const token = await AsyncStorage.getItem('token');
          const { user, error } = await getUserInfo(token);
          
          if (user) {
            setUserInfo(user);
          } else {
            // Handle error, maybe log out the user or display an error message
            console.error('Error fetching user info x:', error);
          }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, [userInfo, setUserInfo]);

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfile');
  };

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const { success, error } = await deleteAccount();
      if (success) {
        await logOut();
      } else {
        console.error('Error deleting account:', error);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['transparent', 'rgba(17, 25, 32, 0.8)', 'rgba(17, 25, 32, 1)']}
        style={styles.background}
      />
      <Text style={styles.title}>My Profile</Text>
      <Image 
        style={styles.logo}
        source={require('../assets/LOGO/Logo w Red Tagline/BB Logo Horizontal_COLOR 1.png')}
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>First Name:</Text>
          <Text style={styles.infoValue}>{userInfo?.first ?? 'Not Available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Last Name:</Text>
          <Text style={styles.infoValue}>{userInfo?.last ?? 'Not Available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Username:</Text>
          <Text style={styles.infoValue}>{userInfo?.login ?? 'Not Available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{userInfo?.email ?? 'Not Available'}</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setDeleteModalVisible(true)}>
        <Text style={styles.deleteButtonText}>Delete Account</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3077b2',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  logo: {
    width: 220,
    height: 78,
    marginBottom: 20,
  },
  infoContainer: {
    borderRadius: 5,
    backgroundColor: '#111920',
    padding: 10,
    marginBottom: 20,
    width: '80%',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  infoLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  infoValue: {
    color: '#fff',
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#3077b2',
  },
  logoutButton: {
    backgroundColor: '#3077b2',
  },
  deleteButton: {
    backgroundColor: '#F70108',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
