import * as React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from "./Login";
import SignUp from "./SignUp";
import LoginSwitch from '../Components/LoginSwitch';
import {Dimensions} from 'react-native';

/* 
    <Pressable
                    style={styles.button}
                    onPress={() => {
                    // Handle sign in action
                    navigation.navigate('Login')
                    console.log("Sign in button pressed");
                    }}
                >
                    <Text style={styles.buttonText}>Sign In</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, { backgroundColor: '#3077b2' }]}
                    onPress={() => {
                    // Handle sign up action
                    navigation.navigate(SignUpScreen)
                    console.log("Sign up button pressed");
                    }}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </Pressable>
*/


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function StartScreen() {
  const navigation = useNavigation()

  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (tab) => {
      setSelectedTab(tab);
  };

    return (
            <View style={styles.container}>
                <Image 
                    style={styles.image}
                    source={require('../assets/BB Logo Icon_COLOR.png')}
                    />
                    <LoginSwitch
                    selectedTab={selectedTab} onTabChange ={handleTabChange}
                    />

                    {selectedTab == 0 ? <Login/> : <SignUp/>}
              
                <StatusBar style="auto" />
                </View>
    );
                }
    
                const styles = StyleSheet.create({
                    container: {
                      flex: 1,
                      backgroundColor: '#111920',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    image: {
                      width: 100,

                      height: 105,

                      transform:[{scale:0.80}],

                      marginTop: windowHeight/15,
                    },
                    button: {
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 200,
                      height: 50,
                      borderRadius: 25,
                      backgroundColor: '#fff',
                      marginBottom: 20,
                    },
                    buttonText: {
                      color: '#111920',
                      fontSize: 18,
                      fontWeight: 'bold',
                    },
                  });
                  