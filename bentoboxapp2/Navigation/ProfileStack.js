import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../screens/ProfileScreen'; // Import the ProfileScreen component
import UpdateProfileScreen from '../screens/UpdateProfile'; // Import the UpdateProfileScreen component
import ChangePasswordScreen from '../screens/ChangePassword'; // Import the ChangePasswordScreen component

const Stack = createStackNavigator();

function ProfileStack() {
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
        options={{ headerShown: false }}
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
