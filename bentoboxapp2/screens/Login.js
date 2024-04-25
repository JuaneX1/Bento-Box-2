import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView,Pressable, Modal, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { doLogin } from '../api/doLogin';
import { useAuth } from '../Components/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserInfo } from '../api/getUserInfo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function Login() {
    const navigation = useNavigation();
    const { signIn } = useAuth();
    const { userInfo, setUserInfo} = useAuth();

    const [errorModalVisible, setErrorModalVisible] = useState(false); // State for error modal
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    const fadeInDuration = 250; // Duration for fade in animation
    const fadeAnim = new Animated.Value(0); // Initial value for fade animation

    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    useEffect(() => {
        if (errorModalVisible) {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: fadeInDuration,
            useNativeDriver: true,
          }).start();
        } else {
          // Reset the opacity to 0 when the modal is closed
          fadeAnim.setValue(0);
        }
      }, [errorModalVisible]);

    const handleClick = async () => {
        //await signIn(formData);
        const results = await doLogin(formData);

        if(results.token != null){
            
            const user = await getUserInfo(results.token);
            await signIn(user.user._id);

            setUserInfo(user);
        }
        else{
            if (results.error) {
                const message = typeof results.error === 'string' ? results.error : results.error.message;
                console.log(message);
                setErrorMessage(message);
                setTimeout(() => setErrorMessage(''), 6000);
            }
        }
    };
    return (
        
        <KeyboardAvoidingView style={styles.container}>
             {errorMessage ? (
                                 <Text style={styles.errorText}>{errorMessage}</Text>
                             ): (null)}
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Login: </Text>
            <TextInput
                style={styles.input}
                placeholder="Email*"
                onChangeText={(text) => setFormData({ ...formData, login: text })}
            />
            <Text style={[styles.text, {fontWeight: 'bold'}]}>Password: </Text>
            <TextInput
                style={styles.input}
                placeholder="Password*"
                secureTextEntry={true}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
            <Pressable
                style={styles.submitButton}
                onPress={handleClick}
            >
                <Text style={[styles.text, {fontWeight: 'bold'}]}>Login</Text>
            </Pressable>
            <Modal
                animationType="fade"
                transparent={true}
                visible={errorModalVisible}
                onRequestClose={() => setErrorModalVisible(false)}
            >
            <View  style={{backgroundColor:'rgba(0,0,0,0.5)', flex:1,display:'flex',height:windowWidth, width:windowWidth}}>
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        backgroundColor: '#111920',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 2,
        width: 200,
        padding: 10,
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
    },
    text: {
        color: 'white'
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
      errorText:{
        padding:5,
        color:'red',
        fontWeight:'700'
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
