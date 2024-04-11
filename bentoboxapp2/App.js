import * as React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './Components/AuthContext'; // Import the AuthProvider
import StartScreen from "./screens/StartScreen";
import HomeStack from './Navigation/HomeStack';
import { Router } from './Components/Router';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
