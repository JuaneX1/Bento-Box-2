import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Modal, Dimensions } from 'react-native';
import { useAuth } from '../Components/AuthContext';
import { AntDesign } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function DeleteAccountModal({ isVisible, onClose, onDelete }) {
  const [confirmationText, setConfirmationText] = useState('');

  const handleDeleteAccount = () => {
    if (confirmationText.toUpperCase() === 'DELETE') {
      onDelete(); // Call the onDelete function to delete the account
      setConfirmationText(''); // Reset confirmation text
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, display: 'flex', height: windowHeight, width: windowWidth }}>
        <View style={styles.modalView}>
          <AntDesign name="delete" size={48} color="red" />
          <Text style={styles.modalText}>To continue deletion of your account, please type "DELETE":</Text>
          <TextInput
            style={styles.input}
            placeholder="Type DELETE"
            onChangeText={(text) => setConfirmationText(text)}
            value={confirmationText}
          />
          <Pressable
            style={styles.modalButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.modalButtonText}>Delete Account</Text>
          </Pressable>
          <Pressable
            style={styles.modalButton}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    margin: 20,
    transform: [{ translateY: windowHeight / 3 }],
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    borderColor: 'red',
    alignItems: 'center',
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
  input: {
    height: 40,
    width: 200,
    marginVertical: 8,
    borderWidth: 2,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#ffffff",
    borderColor: '#3077b2'
  },
  modalButton: {
    backgroundColor: "#3077b2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    elevation: 2
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  }
});
