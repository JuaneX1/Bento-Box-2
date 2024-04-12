import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeStack from '../Navigation/HomeStack';
import StartStack from '../Navigation/StartStack';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from './LoadingScreen';
export const Router = () => {
  const { authData } = useAuth();
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const fetchAsyncData = async () => {
      try {
        //const { authData } = useAuth();
          //await AsyncStorage.removeItem('token');
          // Check if value exists in AsyncStorage, set initialRoute accordingly
          if(authData){
            console.log('good authData');
          }
          else{
            console.log('mid authData');
          }
          setInitialRoute(authData ? 'HomeStack' : 'StartStack');
      } catch (error) {
        console.error('Error fetching data from AsyncStorage:', error);
        // If error occurs, set initialRoute to the default
        setInitialRoute('StartStack');
      }
    };

    fetchAsyncData();
  }, [authData]); // Empty dependency array to run once on component mount

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
