import * as React from 'react';
import StartScreen from "./screens/StartScreen";
import HomeScreen from './screens/HomeScreen';

export default async function App() {
  const value = await AsyncStorage.getItem('isLoggedIn');
  {console.log(value)}
  return value == true ? <StartScreen/> : <HomeScreen/>;
  
}