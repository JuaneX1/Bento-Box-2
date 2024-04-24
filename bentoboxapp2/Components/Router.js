import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../Navigation/HomeStack';
import StartStack from '../Navigation/StartStack';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../screens/LoadingScreen';

export const Router = () => {
  const { authData, userInfo } = useAuth();
  
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsyncData = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        global.favorites = favorites;
        
        if(authData){
          console.log("router yes! "+authData);
        }
        else{
          console.log("router boooo! "+authData);
        }
        // Determine initial route based on authentication state
        setInitialRoute(authData ? 'HomeStack' : 'StartStack');
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
        // If error occurs, set initialRoute to the default
        setInitialRoute('StartStack');
      }finally {
        setLoading(false); // Set loading to false once data fetching is done
      }
    };

    fetchAsyncData();
  }, [authData]); // Re-run effect when authData changes

  if (initialRoute === null) {
    // Render a loading indicator while fetching AsyncStorage data
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {initialRoute === 'HomeStack' ? <HomeStack /> : <StartStack />}
    </NavigationContainer>
  );
};
