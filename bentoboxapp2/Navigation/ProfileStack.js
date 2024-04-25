import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen'; // Import the ProfileScreen component
import UpdateProfileScreen from '../screens/UpdateProfile'; // Import the UpdateProfileScreen component
import ChangePasswordScreen from '../screens/ChangePassword'; // Import the ChangePasswordScreen component
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
const Stack = createNativeStackNavigator();

function ProfileStack() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Profile"  
        component={ProfileScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="UpdateProfile"  
        component={UpdateProfileScreen} 
        options={{ 
          headerStyle:{
            backgroundColor:'#111920'
          },
          headerTintColor: '#ffffff',
          headerShown: true ,
          headerLeft: () => (
            
            <Ionicons name="arrow-back" size={24} color="white" 
            onPress={() => navigation.navigate("Profile")}
            />
          ),
        }}
      />
      <Stack.Screen 
        name="ChangePassword"  
        component={ChangePasswordScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStack;
