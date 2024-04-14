import * as React from 'react';
import { StyleSheet, Button, Text, View, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiscoverScreen from "../screens/DiscoverScreen";
import AnimeInfoScreen from"../screens/AnimeInfoScreen";
import SearchScreen from '../screens/SearchScreen';
import { AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator()

export default function FavoriteStack() {
  const navigation = useNavigation()
  return (
      <Stack.Navigator >
        <Stack.Screen 
        name="Favorites" 
        component = {HomeScreen}
        options = {{

          headerShown:false,
          headerStyle:{
            backgroundColor:'#111920'
          },
          headerTintColor: '#111920',
         
        }}
        />
         <Stack.Screen 
        name="Info"
        component = {AnimeInfoScreen}
        
        options = {{
          headerShown:false,
          headerStyle:{
            backgroundColor:'#111920',
            headerTintColor: '#111920',
          },
        }}
        />
         
      </Stack.Navigator>
  
  );
}