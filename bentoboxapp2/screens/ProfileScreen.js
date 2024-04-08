import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [editUsernameModalVisible, setEditUsernameModalVisible] = useState(false);
  const [editEmailModalVisible, setEditEmailModalVisible] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch stored email from AsyncStorage
        const userEmail = await AsyncStorage.getItem('email');
        if (userEmail) {
          // Fetch username from backend based on the email
          const response = await fetchUsernameFromBackend(userEmail);
          const userData = await response.json();
          setUsername(userData.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const fetchUsernameFromBackend = async (email) => {
    try {
      const response = await fetch(`your_backend_endpoint/user?email=${encodeURIComponent(email)}`);
      return response;
    } catch (error) {
      console.error('Error fetching username from backend:', error);
      throw error;
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
    if (expanded && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
      { text: 'OK', onPress: signOut },
    ]);
  };

  const signOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('Login');
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const renderListItem = ({ item }) => {
    switch (item) {
      case 'Sign Out':
        return (
          <TouchableOpacity style={styles.option} onPress={handleSignOut}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        );
      case 'Edit Username':
        return (
          <TouchableOpacity style={styles.option} onPress={() => setEditUsernameModalVisible(true)}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        );
      case 'Edit Email':
        return (
          <TouchableOpacity style={styles.option} onPress={() => setEditEmailModalVisible(true)}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        );
    }
  };

  const saveNewUsername = async () => {
    try {
      // Save new username to AsyncStorage
      await AsyncStorage.setItem('username', newUsername);
      setUsername(newUsername);
      setEditUsernameModalVisible(false);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };

  const saveNewEmail = () => {
    // Implement logic to save new email
    setEditEmailModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome back, {username || 'Guest'}!</Text>
        <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>{expanded ? 'Hide Options' : 'Show Options'}</Text>
        </TouchableOpacity>
        {expanded && (
          <FlatList
            ref={flatListRef}
            data={['Edit Username', 'Edit Email', 'Sign Out']}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.optionsList}
          />
        )}
      </View>
      {/* Edit Username Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editUsernameModalVisible}
        onRequestClose={() => setEditUsernameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Username</Text>
            <TextInput
              style={styles.input}
              placeholder="New Username"
              value={newUsername}
              onChangeText={setNewUsername}
            />
            <Button title="Save" onPress={saveNewUsername} />
          </View>
        </View>
      </Modal>
      {/* Edit Email Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editEmailModalVisible}
        onRequestClose={() => setEditEmailModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Email</Text>
            <TextInput
              style={styles.input}
              placeholder="New Email"
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <Button title="Save" onPress={saveNewEmail} />
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
  content: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#3077b2',
    borderRadius: 5,
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsList: {
    marginTop: 20,
    width: '80%',
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
