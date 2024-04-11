import * as React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from "../screens/StartScreen";


const Stack = createNativeStackNavigator()

/* <Stack.Screen  
        name = "Home" 
        component = {HomeStack}
        
        options = {{
          title:"Login",
          headerShown:false,
          headerTitle:{
            backgroundColor:'#111920',
            tintColor:'#111920'
          },
         headerStyle:{
          backgroundColor:"#111920"
         },
         headerBackTitleStyle:{
          textColor:"#fff",
          fontSize:16
         }
          
        }}

        />*/ 
export default function StartStack() {
  return (
      <Stack.Navigator >
        <Stack.Screen 
        name="Welcome" 
        component = {StartScreen}
        options = {{
          title:"Welcome",
          headerShown:false,
          headerStyle:{
            backgroundColor:'#111920'
          },
          headerTintColor: '#111920',

        }}
        />
       
      </Stack.Navigator>
  
  );
}