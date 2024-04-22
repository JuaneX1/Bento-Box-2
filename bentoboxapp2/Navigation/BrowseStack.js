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

export default function BrowseStack() {
  const navigation = useNavigation()
  return (
      <Stack.Navigator
      initialRouteName="Discover" 
      >

        <Stack.Screen 
        name="Discover" 
        component = {DiscoverScreen}
        options = {{

          headerShown:false,
          headerStyle:{
            backgroundColor:'#111920'
          },
          headerTintColor: '#111920',
          headerRight: () => (
            <FontAwesome name="search" size={20} color="white" 
            onPress={() => navigation.navigate('SearchScreen')}
            />
          ),
        }}
        />
        
         <Stack.Screen 
        name="recInfo"
        component = {AnimeInfoScreen}
        
        options = {{
          headerShown:false,
          headerStyle:{
            backgroundColor:'#111920',
            headerTintColor: '#111920',
          },
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