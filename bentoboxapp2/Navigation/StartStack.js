import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from "../screens/StartScreen";
import HomeStack from './HomeStack';
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"; // Import ForgotPassword screen

const Stack = createNativeStackNavigator();

export default function StartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={StartScreen}
        options={{
          title: "Welcome",
          headerShown: false,
          headerStyle: {
            backgroundColor: '#111920'
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen} // Add the Forgot Password screen component here
        options={{
          title: "Forgot Password",
          headerStyle: {
            backgroundColor: '#111920',
          },
          headerTintColor: '#fff', // example text color
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Login",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#111920"
          },
          headerTitleStyle: {
            color: '#fff'
          },
          headerBackTitleStyle: {
            color: "#fff",
            fontSize: 16
          }
        }}
      />
    </Stack.Navigator>
  );
}
