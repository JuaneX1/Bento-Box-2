import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SearchStack from './SearchStack';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Import the ProfileScreen component
import FavoriteStack from './FavoriteStack';
import ProfileStack from './ProfileStack';
import SearchScreen from '../screens/SearchScreen';
import BrowseStack from './BrowseStack';
import RecommendationStack from './RecommendationStack';

const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    
    <Tab.Navigator 
      initialRouteName="Browse" 
      screenOptions={{
        tabBarInactiveTintColor:"white",
        tabBarActiveTintColor:"#3077b2",
        tabBarStyle:{ backgroundColor: '#111920',
       
        borderBlockColor:"#111920" }
      }}
      
    >
      <Tab.Screen 
        name="Favorites"  
        component={FavoriteStack} 
        options={{
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Browse"  
        component={BrowseStack}
        options={{
          headerShown:false,
          headerTintColor:"#ffffff",
          headerStyle:{
            backgroundColor:"#111920"
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Searching"
        component={SearchStack}
        options={{
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="For You!"
        component={RecommendationStack}
        options={{
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards" color={color} size={size} />
          ),
        }}
      />

      {/* New Tab.Screen for the profile */}
      <Tab.Screen 
        name="ProfileScreen"

        component={ProfileStack}
        options={{
          headerShown:false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeStack;
